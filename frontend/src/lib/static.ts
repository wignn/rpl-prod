import { Clock, Mail, MapPin, Phone } from "lucide-react"


export const data = {
    alamat:"Jl. Surotokunto, Dsn. Bendasari 2 RT 12 RW 05 No 25, Desa Kondangjaya",
    phone:"+6285215810688"
}


export const contactData = [
  {
    icon: Phone,
    title: "Telepon/WhatsApp",
    content: "+62 852-1581-0688",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@greenkost.com",
  },
  {
    icon: MapPin,
    title: "Alamat",
    content: data.alamat,
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    content: "Senin - Minggu: 08.00 - 20.00 WIB",
  },
]
