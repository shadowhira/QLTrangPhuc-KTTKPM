FROM node:18-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies với flag --force để giải quyết xung đột phiên bản
RUN npm install --force

# Sao chép tất cả các file còn lại
COPY . .

# Thiết lập biến môi trường cho build
ENV NEXT_PUBLIC_API_URL=http://localhost:30080/api

# Build ứng dụng Next.js
RUN npm run build

# Expose port 3005
EXPOSE 3005

# Chạy ứng dụng
CMD ["npm", "start"]
