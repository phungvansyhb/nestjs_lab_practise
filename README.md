- cài nest cli để dùng lệnh generate : `npm i -g @nestjs/cli`
- cài thư viện để hot reload : 
  `npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack`
  Thêm file cấu hình webpack : webpack-hmr.config.js
  Sửa file main.ts
  Sửa script dev
- Csrf hoặc xsrf (cross site request forgery) là kiểu tấn công mà kẻ tấn công lừa một người đùng đã đăng nhập thực hiện một hành động không mong muốn trên một website mà họ đang có phiên đăng nhập hợp lệ
1. Nạn nhân đăng nhập vào website ngân hàng (bank.com)
   ↓
2. Browser lưu cookie/session của bank.com
   ↓
3. Nạn nhân vào một website độc hại (evil.com) trong khi vẫn đang đăng nhập bank.com
   ↓
4. Website độc hại gửi request đến bank.com thay mặt nạn nhân
   ↓
5. Browser TỰ ĐỘNG gửi cookie của bank.com cùng với request
   ↓
6. bank.com nghĩ đây là request hợp lệ từ nạn nhân → Thực hiện hành động

cách đề phòng bằng double crsf  : gọi api lấy token crsf => server set cookie vào browser. client set cookie vào request header (sẽ ko có nếu hacker gửi) => khi gọi request tiếp theo server so sánh 2 token để xác minh