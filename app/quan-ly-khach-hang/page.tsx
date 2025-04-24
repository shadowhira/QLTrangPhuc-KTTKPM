"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { KhachHang } from "@/lib/types"
import { fetchKhachHang, createKhachHang, updateKhachHang, deleteKhachHang } from "@/lib/api"

export default function QuanLyKhachHangPage() {
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<KhachHang>>({
    ho: "",
    ten: "",
    sdt: "",
    email: "",
    diaChi: {
      thonXom: "",
      quanHuyen: "",
      tinhThanhPho: "",
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const pageSizeOptions = [5, 10, 20, 50]

  useEffect(() => {
    loadKhachHang()
  }, [currentPage, searchTerm, pageSize])

  const loadKhachHang = async () => {
    try {
      setLoading(true)
      const result = await fetchKhachHang(searchTerm, currentPage, pageSize)
      setKhachHangs(result.content)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
      setCurrentPage(result.currentPage)
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as any),
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Tạo object mới với cấu trúc đúng
      const customerData: any = {
        ho: formData.ho || '',
        ten: formData.ten || '',
        sdt: formData.sdt || '',
        email: formData.email || '',
        diaChi: {
          thonXom: formData.diaChi?.thonXom || '',
          quanHuyen: formData.diaChi?.quanHuyen || '',
          tinhThanhPho: formData.diaChi?.tinhThanhPho || ''
        }
        // Không gửi các trường thừa
      };

      console.log('Data to send:', customerData);

      if (isEditing && currentId !== null) {
        await updateKhachHang(currentId, customerData)
        alert('Cập nhật khách hàng thành công!')
        resetForm()
        setShowForm(false)
        loadKhachHang()
      } else {
        try {
          await createKhachHang(customerData)
          alert('Thêm khách hàng mới thành công!')
          resetForm()
          setShowForm(false)
          loadKhachHang()
        } catch (createError: any) {
          if (createError.message.includes('duplicate key')) {
            if (createError.message.includes('email')) {
              alert('Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.')
            } else if (createError.message.includes('sdt')) {
              alert('Số điện thoại đã tồn tại trong hệ thống. Vui lòng sử dụng số điện thoại khác.')
            } else {
              alert('Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.')
            }
          } else {
            alert(`Lỗi khi thêm khách hàng: ${createError.message}`)
          }
        }
      }
    } catch (error: any) {
      console.error("Error saving customer:", error)
      alert(`Lỗi: ${error.message}`)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset về trang 1 khi tìm kiếm
    loadKhachHang()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Không cần gọi loadKhachHang() vì useEffect sẽ tự động gọi khi currentPage thay đổi
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => {
    const newPageSize = parseInt(e.target.value)
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset về trang 1 khi thay đổi số lượng hiển thị
    // Không cần gọi loadKhachHang() vì useEffect sẽ tự động gọi khi pageSize thay đổi
  }

  const handleEdit = (khachHang: KhachHang) => {
    setFormData({
      ho: khachHang.ho,
      ten: khachHang.ten,
      sdt: khachHang.sdt,
      email: khachHang.email,
      diaChi: {
        thonXom: khachHang.diaChi.thonXom,
        quanHuyen: khachHang.diaChi.quanHuyen,
        tinhThanhPho: khachHang.diaChi.tinhThanhPho,
      },
    })
    setCurrentId(khachHang.id)
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await deleteKhachHang(id)
        loadKhachHang()
      } catch (error) {
        console.error("Error deleting customer:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      ho: "",
      ten: "",
      sdt: "",
      email: "",
      diaChi: {
        thonXom: "",
        quanHuyen: "",
        tinhThanhPho: "",
      },
    })
    setIsEditing(false)
    setCurrentId(null)
  }

  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý khách hàng</h1>

      {/* Form thêm/sửa khách hàng trong Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ</label>
                <Input name="ho" value={formData.ho} onChange={handleInputChange} placeholder="Nhập họ" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tên</label>
                <Input name="ten" value={formData.ten} onChange={handleInputChange} placeholder="Nhập tên" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <Input
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  type="email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thôn/Xóm</label>
                <Input
                  name="diaChi.thonXom"
                  value={formData.diaChi?.thonXom}
                  onChange={handleInputChange}
                  placeholder="Nhập thôn/xóm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
                <Input
                  name="diaChi.quanHuyen"
                  value={formData.diaChi?.quanHuyen}
                  onChange={handleInputChange}
                  placeholder="Nhập quận/huyện"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
                <Input
                  name="diaChi.tinhThanhPho"
                  value={formData.diaChi?.tinhThanhPho}
                  onChange={handleInputChange}
                  placeholder="Nhập tỉnh/thành phố"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách khách hàng</h2>
          <Button onClick={handleAddNew}>Thêm khách hàng mới</Button>
        </div>

        {/* Thanh tìm kiếm */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
        </form>

        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {khachHangs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    khachHangs.map((khachHang) => (
                      <TableRow key={khachHang.id}>
                        <TableCell>{khachHang.id}</TableCell>
                        <TableCell>{`${khachHang.ho} ${khachHang.ten}`}</TableCell>
                        <TableCell>{khachHang.sdt}</TableCell>
                        <TableCell>{khachHang.email}</TableCell>
                        <TableCell>
                          {[khachHang.diaChi.thonXom, khachHang.diaChi.quanHuyen, khachHang.diaChi.tinhThanhPho]
                            .filter(Boolean)
                            .join(", ")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(khachHang)}>
                              Sửa
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(khachHang.id)}>
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Phân trang và chọn số lượng hiển thị */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              {totalPages > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Hiển thị tối đa 5 trang, ưu tiên trang hiện tại ở giữa
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else {
                        const leftOffset = Math.min(2, currentPage - 1);
                        const startPage = Math.max(1, currentPage - leftOffset);
                        const endPage = Math.min(totalPages, startPage + 4);
                        pageToShow = startPage + i;

                        if (pageToShow > endPage) return null;
                      }

                      return (
                        <PaginationItem key={pageToShow}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageToShow)}
                            isActive={currentPage === pageToShow}
                            className="cursor-pointer"
                          >
                            {pageToShow}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }).filter(Boolean)}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                          isActive={currentPage === totalPages}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Hiển thị</span>
                <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange({ target: { value } } as any)}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={pageSize.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map(size => (
                      <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">trên trang</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Hiển thị {khachHangs.length} trên tổng số {totalElements} khách hàng
            </div>
          </>
        )}
      </div>
    </div>
  )
}

