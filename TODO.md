# TODO: Fix Product Management Issues

## Issues to Fix:
1. Model Laravel Product:
   - `casts()` dideklarasikan sebagai method, harus diganti properti `$casts`.
   - `is_active` sebaiknya punya default `true`.

2. ProductController:
   - Pagination response tidak sesuai frontend Zustand (`fetchProducts` mengharapkan `data.data`).
   - Tidak ada handling jika user ingin menghapus gambar tanpa upload baru.
   - `per_page` tidak dibatasi, harus ada maksimal (misal 100).

3. Frontend Zustand Store:
   - Setelah create/update/delete, state `products` tidak otomatis terupdate.
   - Error backend harus di-parse supaya validation errors muncul di form.
   - Pagination fallback jika response tidak lengkap.

4. Frontend ProductForm:
   - Jika kategori dipilih "none", backend harus menerima `null` atau string kosong.
   - Validasi file max 2MB sudah ada.
   - Error backend harus tampil di form.

5. Routes:
   - Pertimbangkan versioning API (`/api/v1`).

## Steps:
- [x] Fix app/Models/Product.php: Change casts() to $casts, add is_active default.
- [x] Fix app/Http/Controllers/ProductController.php: Fix pagination structure, add remove_image handling, limit per_page.
- [x] Fix resources/js/views/store/productStore.ts: Update state after CRUD, parse errors, pagination fallback.
- [x] Fix resources/js/views/components/admin/ProductForm.tsx: Handle "none" category, display backend errors.
- [x] Update routes/api.php: Prefix product routes with /v1.
- [x] Test the fixes by running the app and checking CRUD operations.
