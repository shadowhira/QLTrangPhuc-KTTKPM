// API client để gọi đến backend

const API_URL = "http://localhost:8080/api"

// Define KhachHang interface
interface KhachHang {
  id: number
  ten: string
  diaChi: string
  soDienThoai: string
}

// Khách hàng API
export async function fetchKhachHang() {
  const response = await fetch(`${API_URL}/khach-hang`)
  if (!response.ok) {
    throw new Error("Failed to fetch customers")
  }
  return response.json()
}

export async function fetchKhachHangById(id: number) {
  const response = await fetch(`${API_URL}/khach-hang/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch customer")
  }
  return response.json()
}

export async function createKhachHang(khachHang: Omit<KhachHang, "id">) {
  const response = await fetch(`${API_URL}/khach-hang`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(khachHang),
  })
  if (!response.ok) {
    throw new Error("Failed to create customer")
  }
  return response.json()
}

export async function updateKhachHang(id: number, khachHang: Partial<KhachHang>) {
  const response = await fetch(`${API_URL}/khach-hang/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(khachHang),
  })
  if (!response.ok) {
    throw new Error("Failed to update customer")
  }
  return response.json()
}

export async function deleteKhachHang(id: number) {
  const response = await fetch(`${API_URL}/khach-hang/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete customer")
  }
  return response.json()
}

// Thống kê API
export async function fetchThongKeKhachHang() {
  const response = await fetch(`${API_URL}/thong-ke/khach-hang`)
  if (!response.ok) {
    throw new Error("Failed to fetch customer statistics")
  }
  return response.json()
}

