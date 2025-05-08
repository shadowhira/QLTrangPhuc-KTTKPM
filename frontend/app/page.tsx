import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hệ thống quản lý khách hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/quan-ly-khach-hang">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Quản lý khách hàng</h2>
            <p>Thêm, sửa, xóa và xem thông tin khách hàng</p>
          </div>
        </Link>
        <Link href="/thong-ke-khach-hang">
          <div className="bg-green-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Thống kê khách hàng</h2>
            <p>Xem thống kê khách hàng theo doanh thu</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

