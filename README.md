# HR Management Prototype

Aplikasi HR berbasis HTML, Bootstrap, JavaScript, `localStorage`, dan `sessionStorage`.

## Akun Demo

**Admin**

- Email: `admin@hr.local`
- Password: `admin123`

**Karyawan**

- Email: `andi@hr.local`
- Password: `123456`

## Cara Menjalankan dengan Python

Buka terminal/CMD di folder `hr-management`, lalu jalankan:

```bash
py -m http.server 8000
```

Jika perintah `py` tidak tersedia, pakai:

```bash
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

## Struktur Component

Komponen reusable berada di folder:

```text
components/
├── components.js
├── header.html
├── navbar.html
└── footer.html
```

File aktif untuk render component adalah:

```text
components/components.js
```

Setiap halaman cukup memasang placeholder:

```html
<div
  data-component="navbar"
  data-variant="admin"
  data-base-path="../.."
  data-active="dashboard">
</div>

<div
  data-component="header"
  data-variant="admin"
  data-title="Dashboard"
  data-subtitle="Ringkasan operasional HR">
</div>

<div
  data-component="footer"
  data-variant="admin">
</div>
```

Component tidak lagi bergantung pada `fetch()` sehingga lebih stabil saat dijalankan melalui `localhost`.

## Catatan Browser

Jika tampilan masih belum berubah setelah mengganti file, lakukan hard refresh:

- Windows/Linux: `Ctrl + F5`
- Chrome DevTools: klik kanan tombol refresh, pilih **Empty Cache and Hard Reload**

Pastikan folder lama tidak tercampur dengan folder ZIP versi sebelumnya.
