# Frontend - Hệ thống quản lý khách hàng

Frontend cho hệ thống quản lý khách hàng, được xây dựng bằng Next.js.

## Công nghệ sử dụng

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

## Cài đặt

```bash
# Cài đặt dependencies
npm install
# hoặc
pnpm install
```

## Phát triển

```bash
# Chạy server phát triển
npm run dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

## Build

```bash
# Build ứng dụng cho production
npm run build
# hoặc
pnpm build

# Chạy ứng dụng đã build
npm start
# hoặc
pnpm start
```

## Cấu trúc thư mục

```
/
├── app/                    # Pages và layouts (Next.js App Router)
├── components/             # React Components
├── hooks/                  # Custom React Hooks
├── lib/                    # Utilities và helpers
│   ├── api.ts              # API client
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
└── styles/                 # CSS styles
```

## Kết nối với API

Frontend kết nối với backend thông qua API Gateway. URL của API Gateway được cấu hình trong biến môi trường `NEXT_PUBLIC_API_URL`.

Trong môi trường phát triển, bạn có thể tạo file `.env.local` với nội dung:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Trong môi trường production (Docker), biến môi trường này được cấu hình trong `docker-compose.yml`.

## Các trang chính

- `/` - Trang chủ
- `/quan-ly-khach-hang` - Quản lý khách hàng
- `/thong-ke-khach-hang` - Thống kê khách hàng theo doanh thu
- `/thong-ke-doanh-thu` - Thống kê doanh thu theo thời gian
