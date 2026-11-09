# Assignment 4 - Full-stack Quiz Application

Ứng dụng quiz full-stack: backend Node.js/Express/MongoDB và frontend React, Redux, React Router, Bootstrap 5.

- Giao diện: http://localhost:3001
- API: http://localhost:3000

## Tài khoản mẫu

Chạy `npm run seed` trước khi đăng nhập. Mật khẩu được tạo sẵn để demo.

| Vai trò | Username | Password | Sau khi đăng nhập |
| --- | --- | --- | --- |
| User thường | `John` | `john123` | Dashboard, chỉ làm quiz và xem bài viết |
| Admin | `Mary` | `mary123` | Admin Dashboard, quản lý câu hỏi và bài viết |

Có thể tạo tài khoản mới ở trang Register. Tick **Register as admin** nếu muốn tài khoản admin.

## Chức năng

### User thường

- Đăng ký, đăng nhập, đăng xuất.
- Vào **Dashboard** với menu Home, Quiz, Article, Logout.
- Làm quiz: chọn một đáp án, bấm **Submit Answer**, xem điểm khi làm xong, rồi **Restart Quiz**.
- Xem danh sách bài viết. Không thêm, sửa hoặc xóa câu hỏi.

### Admin

- Đăng nhập xong vào **Admin Dashboard**.
- Menu: Home, Manage Questions, Manage Articles, Logout.
- Thêm, sửa, xóa câu hỏi. Câu hỏi mới được gắn vào quiz **General Knowledge**.
- Thêm, sửa, xóa bài viết.
- Xem danh sách user đã đăng ký qua `GET /users`.

### API

- `POST /users/signup`, `POST /users/login`: đăng ký và đăng nhập, trả về JWT.
- `GET /users`: chỉ admin.
- `GET /quizzes`, `GET /questions`, `GET /articles`: ai cũng xem được.
- `POST`, `PUT`, `DELETE /quizzes`: chỉ admin.
- `POST /questions`: user đã đăng nhập. `PUT` và `DELETE /questions/:id`: admin hoặc đúng tác giả câu hỏi.
- User thường sửa hoặc xóa câu hỏi của người khác sẽ nhận lỗi 403.

## Cách chạy

Cần Node.js và MongoDB đang chạy ở `mongodb://localhost:27017`.

```powershell
copy .env.example .env
npm install
npm run seed
npm run dev
```

Terminal thứ hai:

```powershell
cd client
npm install
npm run dev
```

Mở http://localhost:3001, đăng nhập bằng `John` hoặc `Mary`.
