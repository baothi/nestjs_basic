### Các bước cần làm để chạy dự án NestJS

#### 1. Cài đặt thư viện với câu lệnh: npm i

#### 2. Chạy dự án với câu lệnh: npm run dev

=================


Bước 1: Kết nối vào mongoDB sử dụng URL:
mongodb://localhost:27017
Bước 2: Sử dụng database admin với câu lệnh sau:
use admin
Kiểm tra xem đã tạo user nào chưa với câu lệnh:
db.getUsers()
Bước 3: Tạo user để đăng nhập vào database
db.createUser(
{
user: "root",
pwd: "123456",
roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
}
)


mongodb://root:123456@localhost:27017/nestjs_connect?authSource=admin