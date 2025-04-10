import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ thống quản lý khách hàng",
  description: "Quản lý và thống kê khách hàng",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Quản lý khách hàng</div>
            <div className="flex gap-4">
              <a href="/" className="hover:underline">
                Trang chủ
              </a>
              <a href="/quan-ly-khach-hang" className="hover:underline">
                Quản lý KH
              </a>
              <a href="/thong-ke-khach-hang" className="hover:underline">
                Thống kê KH
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}



import './globals.css'