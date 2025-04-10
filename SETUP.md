# Hướng dẫn cài đặt và chạy hệ thống Microservices

Tài liệu này cung cấp hướng dẫn chi tiết về cách cài đặt và chạy hệ thống microservices bao gồm Customer Service và Statistics Service.

## Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Maven 3.6 hoặc cao hơn
- Docker và Docker Compose
- Khoảng 4GB RAM trống cho các container
- Khoảng 2GB dung lượng ổ đĩa trống

## Cài đặt

### 1. Cài đặt Java 17

#### Windows
1. Tải JDK 17 từ trang web chính thức của Oracle hoặc OpenJDK
2. Cài đặt JDK
3. Thiết lập biến môi trường JAVA_HOME và thêm %JAVA_HOME%\bin vào PATH

#### macOS
```bash
brew install openjdk@17
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### 2. Cài đặt Maven

#### Windows
1. Tải Maven từ trang web chính thức: https://maven.apache.org/download.cgi
2. Giải nén vào thư mục bạn chọn
3. Thiết lập biến môi trường MAVEN_HOME và thêm %MAVEN_HOME%\bin vào PATH

#### macOS
```bash
brew install maven
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install maven
```

### 3. Cài đặt Docker và Docker Compose

#### Windows
1. Tải và cài đặt Docker Desktop từ trang web chính thức: https://www.docker.com/products/docker-desktop
2. Docker Compose đã được bao gồm trong Docker Desktop

#### macOS
1. Tải và cài đặt Docker Desktop từ trang web chính thức: https://www.docker.com/products/docker-desktop
2. Docker Compose đã được bao gồm trong Docker Desktop

#### Linux (Ubuntu/Debian)
```bash
# Cài đặt Docker
sudo apt update
sudo apt install docker.io

# Cài đặt Docker Compose
sudo apt install docker-compose

# Thêm user hiện tại vào nhóm docker
sudo usermod -aG docker $USER
```

### 4. Kiểm tra cài đặt

```bash
java -version
mvn -version
docker --version
docker-compose --version
```

## Chạy hệ thống

### 1. Chạy bằng Docker Compose (Khuyến nghị)

Cách này sẽ tự động xây dựng và chạy tất cả các service cùng với cơ sở dữ liệu.

```bash
# Clone repository (nếu chưa có)
git clone <repository-url>
cd <repository-directory>

# Chạy hệ thống
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
```

### 2. Chạy từng service riêng biệt (Cho phát triển)

#### Chuẩn bị cơ sở dữ liệu

```bash
# Chạy PostgreSQL và MongoDB
docker-compose up -d postgres mongodb
```

#### Chạy Customer Service

```bash
cd customer-service
mvn clean install
mvn spring-boot:run
```

#### Chạy Statistics Service

```bash
cd statistics-service
mvn clean install
mvn spring-boot:run
```

## Kiểm tra hệ thống

Sau khi hệ thống đã chạy, bạn có thể kiểm tra bằng cách gọi các API:

```bash
# Kiểm tra Customer Service
curl http://localhost:8081/api/customers

# Kiểm tra Statistics Service
curl http://localhost:8082/api/statistics/revenue
```

## Dừng hệ thống

### Nếu chạy bằng Docker Compose

```bash
# Dừng tất cả các service
docker-compose stop

# Dừng và xóa tất cả các container
docker-compose down

# Dừng, xóa tất cả các container và xóa volume dữ liệu
docker-compose down -v
```

### Nếu chạy từng service riêng biệt

Nhấn Ctrl+C trong terminal đang chạy mỗi service để dừng.

## Xử lý sự cố

### 1. Lỗi cổng đã được sử dụng

Nếu bạn gặp lỗi "port is already in use", hãy kiểm tra và dừng các ứng dụng đang sử dụng cổng đó:

```bash
# Windows
netstat -ano | findstr 8081
netstat -ano | findstr 8082

# macOS/Linux
lsof -i :8081
lsof -i :8082
```

### 2. Lỗi kết nối cơ sở dữ liệu

Nếu service không thể kết nối đến cơ sở dữ liệu, hãy kiểm tra:

```bash
# Kiểm tra trạng thái container cơ sở dữ liệu
docker-compose ps postgres
docker-compose ps mongodb

# Xem logs của container cơ sở dữ liệu
docker-compose logs postgres
docker-compose logs mongodb
```

### 3. Xem logs của service

```bash
# Nếu chạy bằng Docker Compose
docker-compose logs customer-service
docker-compose logs statistics-service

# Nếu chạy riêng biệt
# Logs sẽ hiển thị trong terminal đang chạy service
```

## Cấu hình nâng cao

### 1. Thay đổi cổng

Nếu bạn muốn thay đổi cổng mặc định, hãy chỉnh sửa:

- `customer-service/src/main/resources/application.properties`: Thay đổi `server.port`
- `statistics-service/src/main/resources/application.properties`: Thay đổi `server.port`
- `docker-compose.yml`: Cập nhật mapping cổng trong phần `ports`

### 2. Thay đổi thông tin đăng nhập cơ sở dữ liệu

Chỉnh sửa thông tin đăng nhập trong:

- `docker-compose.yml`: Phần `environment` của `postgres` và `mongodb`
- `customer-service/src/main/resources/application.properties`: Cập nhật thông tin kết nối PostgreSQL
- `statistics-service/src/main/resources/application.properties`: Cập nhật thông tin kết nối MongoDB
