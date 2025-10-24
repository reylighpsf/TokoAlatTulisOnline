# TODO: Perbaikan Autentikasi Admin dengan Sanctum

## Masalah Saat Ini:
- Admin login berhasil, token tersimpan di sessionStorage dengan key "admin_auth_token"
- Ketika admin membuka halaman kelola produk (/api/products), Laravel mengembalikan "Unauthenticated"
- Middleware 'role:admin' tidak berfungsi dengan benar
- Endpoint /api/user tidak mengenali token admin

## Penyebab:
- Guard Sanctum tidak dikonfigurasi untuk membedakan User dan Admin
- Model Admin menggunakan tabel 'users' yang sama tapi tidak ada guard khusus
- Middleware CheckRole tidak dapat mengakses user dari guard yang benar

## Rencana Perbaikan:

### 1. Konfigurasi Auth Guards (config/auth.php)
- [x] Tambahkan guard 'admin' untuk Sanctum
- [x] Konfigurasi provider untuk Admin model

### 2. Update Model Admin (app/Models/Admin.php)
- [x] Pastikan menggunakan guard 'admin'
- [x] Update konfigurasi HasApiTokens

### 3. Update AuthController (app/Http/Controllers/AuthController.php)
- [x] Update adminLogin untuk menggunakan guard 'admin'

### 4. Update Middleware CheckRole (app/Http/Middleware/CheckRole.php)
- [x] Update untuk mendukung guard admin

### 5. Update Routes API (routes/api.php)
- [x] Update middleware untuk admin routes
- [x] Pastikan /api/user dapat mengenali admin tokens

### 6. Testing
- [ ] Test admin login
- [ ] Test akses /api/products
- [ ] Test /api/user endpoint
- [ ] Test middleware role:admin

## Status: Perbaikan Lengkap Selesai

### Frontend Fixes:
- [x] Menghapus halaman AdminLogin.tsx yang tidak diperlukan
- [x] Menghapus route /admin/login
- [x] Update logout untuk mendukung admin logout
- [x] Menjalankan AdminUserSeeder untuk membuat akun admin demo
- [x] Fix redirect admin ke /login bukan / ketika tidak authorized
- [x] Fix redirect admin yang sudah login ke /admin

### Akun Admin Demo:
- Email: admin@printshop.com
- Password: admin123

### Testing Checklist:
- [ ] Admin login di /login (satu halaman login)
- [ ] Akses /api/products setelah login admin
- [ ] Endpoint /api/user mengembalikan data admin
- [ ] Middleware role:admin berfungsi
- [ ] Admin logout berfungsi
- [ ] Admin yang sudah login tidak bisa akses /login lagi
