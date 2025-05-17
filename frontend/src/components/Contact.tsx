"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Phone,
  MapPin,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { contactData, data } from "@/lib/static";
import dynamic from "next/dynamic";
const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
});

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

export default function Contact() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "Bagaimana cara memesan kamar di GreenKost?",
      answer:
        "Anda dapat memesan kamar dengan menghubungi kami melalui telepon, WhatsApp, atau email. Kami akan membantu Anda memilih kamar yang sesuai dengan kebutuhan Anda.",
      isOpen: false,
    },
    {
      question: "Apakah GreenKost menyediakan fasilitas parkir?",
      answer:
        "Ya, GreenKost menyediakan fasilitas parkir untuk motor dan mobil. Biaya parkir sudah termasuk dalam harga sewa kamar.",
      isOpen: false,
    },
    {
      question: "Berapa lama minimal masa sewa kamar?",
      answer:
        "Minimal masa sewa kamar di GreenKost adalah 3 bulan. Kami juga menawarkan diskon khusus untuk penyewaan jangka panjang (6 bulan atau 1 tahun).",
      isOpen: false,
    },
    {
      question: "Apakah GreenKost menerima pembayaran bulanan?",
      answer:
        "Ya, kami menerima pembayaran bulanan. Pembayaran dapat dilakukan melalui transfer bank atau tunai di kantor kami.",
      isOpen: false,
    },
  ]);

  const toggleFAQ = (index: number) => {
    setFaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          return { ...faq, isOpen: !faq.isOpen };
        }
        return faq;
      })
    );
  };

  return (
    <section id="kontak" className="py-16 md:py-24 bg-none">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Hubungi Kami
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Tertarik dengan GreenKost? Hubungi kami untuk informasi lebih
              lanjut atau jadwalkan kunjungan
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {contactData.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-6 text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-100"
                  >
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-gray-500">{item.content}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4 text-center">
                  Ikuti Kami
                </h3>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="#"
                    className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </Link>
                  <Link
                    href="#"
                    className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </Link>
                  <Link
                    href="#"
                    className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Map and FAQ */}
            <div className="space-y-8">
              {/* Map */}
              <div className="rounded-xl overflow-hidden shadow-md border border-green-100">
                <div className="h-64 w-full">
                  <MapLeaflet
                    lat={-6.322189261099615}
                    lng={107.33368275548138}
                  />
                </div>
                <div className="p-3 bg-white text-center">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${-6.322189261099615},${107.33368275548138}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-50 rounded-md text-green-600 font-medium hover:bg-green-100 transition-colors"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Lihat di Google Maps
                  </Link>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
                <h3 className="text-xl font-medium mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
                  Pertanyaan Umum
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="flex justify-between items-center w-full text-left font-medium py-2"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            faq.isOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          faq.isOpen
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="py-2 text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Link
                  href={`https://wa.me/${data.phone.replace(
                    /\D/g,
                    ""
                  )}?text=Halo%20GreenKost,%20saya%20ingin%20bertanya%20tentang%20kamar.`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  target="_blank" 
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Hubungi Kami Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
