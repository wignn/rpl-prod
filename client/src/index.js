"use strict";
require("dotenv").config();
require("colors");
const express = require("express");
const qr = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { PrismaClient } = require("@prisma/client");
const cron = require("node-cron");
const { subDays, isSameDay } = require("date-fns");
const promClient = require("prom-client");

const globalForPrisma = global.globalForPrisma || { prisma: null };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register }); 

const whatsappMessagesSent = new promClient.Counter({
  name: "whatsapp_messages_sent_total",
  help: "Total WhatsApp messages sent",
});
const whatsappMessagesFailed = new promClient.Counter({
  name: "whatsapp_messages_failed_total",
  help: "Total WhatsApp messages failed to send",
});
register.registerMetric(whatsappMessagesSent);
register.registerMetric(whatsappMessagesFailed);

const httpRequestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(httpRequestCounter);

const config = {
  SERVER: {
    PORT: process.env.PORT || 5555,
    BASE_PATH: "/api",
  },
  WHATSAPP: {
    PUPPETEER_OPTIONS: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
};

function formatPhoneNumber(number) {
  let formatted = number.replace(/\D/g, "");
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.slice(1);
  }
  return formatted;
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: config.WHATSAPP.PUPPETEER_OPTIONS,
});

function initializeWhatsApp() {
  client.on("qr", (qrCode) => {
    qr.generate(qrCode, { small: true });
    console.log("QR Code generated, scan it with your phone.");
  });

  client.on("authenticated", () => console.log("Authenticated successfully!"));
  client.on("ready", () => console.log("WhatsApp client is ready!"));

  client.on("message", async (message) => {
    if (message.body === "!ping") {
      await message.reply("pong");
    }
  });

  client.initialize();
}

async function sendWhatsAppMessage(phoneNumber, message) {
  const chatId = `${phoneNumber}@c.us`;
  await client.sendMessage(chatId, message);
  return { number: phoneNumber, message };
}

async function checkAndSendBillingReminders() {
  const tenants = await prisma.tenant.findMany({
    include: {
      rentData: true,
    },
  });
  const today = new Date();

  for (const tenant of tenants) {
    if (!tenant.rentData.rent_date || !tenant.no_telp) continue;

    const reminderDate = subDays(new Date(tenant.rentData.rent_date), 3);
    console.log(
      `Checking ${tenant.full_name} (${tenant.no_telp}) for reminder on ${reminderDate.toLocaleDateString()}`
    );

    if (isSameDay(today, reminderDate)) {
      const formattedNumber = formatPhoneNumber(tenant.no_telp);
      const message = `Halo ${
        tenant.full_name
      }, ini pengingat bahwa Anda memiliki tagihan kos pada tanggal ${new Date(
        tenant.rentData.rent_date
      ).toLocaleDateString()}. Mohon lakukan pembayaran tepat waktu.`;
      try {
        await sendWhatsAppMessage(formattedNumber, message);
        console.log(`✅ Reminder sent to ${tenant.rentData.rent_date}`);

        whatsappMessagesSent.inc();
      } catch (err) {
        console.error(`❌ Failed to send to ${tenant.full_name}: ${err.message}`);

        whatsappMessagesFailed.inc();
      }
    }
  }
}

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString()).inc();
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.post("/api/send-message", async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({
        success: false,
        message: "Number and message are required",
      });
    }

    const formattedNumber = formatPhoneNumber(number);
    const result = await sendWhatsAppMessage(formattedNumber, message);
    whatsappMessagesSent.inc();

    res.json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error sending message:", error);

    whatsappMessagesFailed.inc();

    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

(async () => {
  try {
    console.log("⚡".yellow + " Starting server...".cyan);

    app.listen(config.SERVER.PORT, () => {
      console.log(`Server running on port ${config.SERVER.PORT}`);
    });

    console.log("📱".yellow + " Initializing WhatsApp client...".cyan);
    initializeWhatsApp();

    cron.schedule(
      "0 52 18 * * *", 
      async () => {
        console.log("⏰ Menjalankan pengingat tagihan (18:52 WIB)...");
        try {
          await checkAndSendBillingReminders();
          console.log("✅ Pengingat berhasil dikirim.");
        } catch (err) {
          console.error("❌ Gagal mengirim pengingat:", err.message);
        }
      },
      {
        timezone: "Asia/Jakarta",
      }
    );

    console.log("✅ Server and WhatsApp client initialized!".green.bold);
  } catch (error) {
    console.error("❌ Error starting server:".red.bold, error.message.red);
    process.exit(1);
  }
})();
