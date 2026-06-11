# Perancangan Sistem HR Management

> Dokumen ini berisi perancangan teknis aplikasi HR Management System, mencakup arsitektur aplikasi, hierarki menu, Entity Relationship Diagram (ERD), dan struktur file proyek.

---

## Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Arsitektur Aplikasi](#2-arsitektur-aplikasi)
3. [Hierarki Menu](#3-hierarki-menu)
   - [3.1 Backoffice (Admin)](#31-backoffice-admin)
   - [3.2 Portal Karyawan](#32-portal-karyawan)
4. [Entity Relationship Diagram (ERD)](#4-entity-relationship-diagram-erd)
   - [4.1 Tabel Master](#41-tabel-master)
   - [4.2 Tabel Transaksi](#42-tabel-transaksi)
   - [4.3 Relasi Antar Tabel](#43-relasi-antar-tabel)
5. [User Flow](#5-user-flow)
   - [5.1 Alur Admin Backoffice](#51-alur-admin-backoffice)
   - [5.2 Alur Karyawan](#52-alur-karyawan)
6. [Struktur File Proyek](#6-struktur-file-proyek)

---

## 1. Gambaran Umum Sistem

HR Management System adalah aplikasi web yang terdiri dari **dua antarmuka utama**:

| Aplikasi            | Pengguna | Fungsi Utama                                              |
| ------------------- | -------- | --------------------------------------------------------- |
| **Backoffice**      | Admin HR | Kelola data master, monitoring absensi, penilaian kinerja |
| **Portal Karyawan** | Karyawan | Absensi mandiri, input tugas harian, lihat rekap pribadi  |

Kedua aplikasi berbagi satu basis data yang sama dengan kontrol akses berbeda.

---

## 2. Arsitektur Aplikasi

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        BO["Backoffice\n(Admin HR)"]
        PK["Portal Karyawan\n(Employee)"]
    end

    subgraph APP["⚙️ Application Layer"]
        AUTH["Auth &\nAuthorization"]
        MASTER["Master Data\nService"]
        TRANS["Transaction\nService"]
    end

    subgraph DATA["🗄️ Data Layer"]
        DB[("Database\nHR System")]
        LS["LocalStorage\n(Client Cache)"]
    end

    BO -->|"Login sebagai Admin"| AUTH
    PK -->|"Login sebagai Karyawan"| AUTH
    AUTH --> MASTER
    AUTH --> TRANS
    MASTER --> DB
    TRANS --> DB
    BO -.->|"Cache sementara"| LS
    PK -.->|"Cache sementara"| LS
```

---

## 3. Hierarki Menu

### 3.1 Backoffice (Admin)

```mermaid
graph LR
    ROOT["🏠 Dashboard"]

    ROOT --> M1["👥 Data Karyawan"]
    ROOT --> M2["🏢 Master Data"]
    ROOT --> M3["📋 Transaksi"]
    ROOT --> M4["⚙️ Pengaturan"]

    M1 --> M1A["Daftar Karyawan"]
    M1 --> M1B["Tambah Karyawan"]
    M1 --> M1C["Detail / Edit"]

    M2 --> M2A["Departemen"]
    M2 --> M2B["Divisi"]
    M2 --> M2C["Jabatan"]

    M3 --> M3A["Data Absensi"]
    M3 --> M3B["Penilaian Kinerja"]
    M3 --> M3C["Tugas Harian"]

    M4 --> M4A["Manajemen User Admin"]
    M4 --> M4B["Profil & Akun"]
```

### 3.2 Portal Karyawan

```mermaid
graph LR
    ROOT2["🏠 Beranda Karyawan"]

    ROOT2 --> K1["🕐 Absensi"]
    ROOT2 --> K2["📝 Tugas Harian"]
    ROOT2 --> K3["📊 Rekap Saya"]
    ROOT2 --> K4["👤 Profil"]

    K1 --> K1A["Absen Masuk"]
    K1 --> K1B["Absen Keluar"]
    K1 --> K1C["Riwayat Absensi"]

    K2 --> K2A["Input Tugas Hari Ini"]
    K2 --> K2B["Riwayat Tugas"]

    K3 --> K3A["Rekap Absensi Bulanan"]
    K3 --> K3B["Nilai Kinerja Saya"]

    K4 --> K4A["Data Diri"]
    K4 --> K4B["Ubah Password"]
```

---

## 4. Entity Relationship Diagram (ERD)

### 4.1 Tabel Master

```mermaid
erDiagram

    DEPARTEMEN {
        string id PK
        string kode
        string nama
        string kepala_departemen
        enum   status
        text   deskripsi
        datetime created_at
        datetime updated_at
    }

    DIVISI {
        string   id PK
        string   id_departemen FK
        string   kode
        string   nama
        string   kepala_divisi
        enum     status
        datetime created_at
        datetime updated_at
    }

    JABATAN {
        string   id PK
        string   id_divisi FK
        string   nama_jabatan
        string   level
        enum     status
        datetime created_at
        datetime updated_at
    }

    KARYAWAN {
        string   id PK
        string   nik
        string   nama_lengkap
        string   id_jabatan FK
        string   id_divisi FK
        string   id_departemen FK
        string   email
        string   no_telepon
        date     tanggal_bergabung
        enum     status
        string   foto
        datetime created_at
        datetime updated_at
    }

    USER_ADMIN {
        string   id PK
        string   nama
        string   email
        string   password_hash
        enum     role
        enum     status
        datetime last_login
        datetime created_at
    }

    DEPARTEMEN ||--o{ DIVISI        : "memiliki"
    DIVISI     ||--o{ JABATAN       : "memiliki"
    JABATAN    ||--o{ KARYAWAN      : "menjabat"
    DIVISI     ||--o{ KARYAWAN      : "bertugas di"
    DEPARTEMEN ||--o{ KARYAWAN      : "berada di"
```

### 4.2 Tabel Transaksi

```mermaid
erDiagram

    KARYAWAN {
        string id PK
        string nik
        string nama_lengkap
    }

    ABSENSI {
        string   id PK
        string   id_karyawan FK
        date     tanggal
        time     jam_masuk
        time     jam_keluar
        enum     status
        string   lokasi_masuk
        string   lokasi_keluar
        string   foto_masuk
        string   foto_keluar
        text     keterangan
        datetime created_at
    }

    TUGAS_HARIAN {
        string   id PK
        string   id_karyawan FK
        date     tanggal
        string   judul_tugas
        text     deskripsi
        enum     prioritas
        enum     status
        time     jam_mulai
        time     jam_selesai
        int      progress_persen
        text     catatan
        datetime created_at
        datetime updated_at
    }

    PENILAIAN_KINERJA {
        string   id PK
        string   id_karyawan FK
        string   id_penilai FK
        string   periode
        int      tahun
        float    nilai_kedisiplinan
        float    nilai_kerjasama
        float    nilai_produktivitas
        float    nilai_inisiatif
        float    nilai_total
        text     catatan_penilai
        enum     status
        datetime tanggal_penilaian
        datetime created_at
    }

    KARYAWAN       ||--o{ ABSENSI           : "melakukan"
    KARYAWAN       ||--o{ TUGAS_HARIAN      : "mengerjakan"
    KARYAWAN       ||--o{ PENILAIAN_KINERJA : "dinilai dalam"
    KARYAWAN       ||--o{ PENILAIAN_KINERJA : "menilai (penilai)"
```

### 4.3 Relasi Antar Tabel

```mermaid
erDiagram

    DEPARTEMEN {
        string id PK
        string kode
        string nama
    }

    DIVISI {
        string id PK
        string id_departemen FK
        string nama
    }

    JABATAN {
        string id PK
        string id_divisi FK
        string nama_jabatan
    }

    KARYAWAN {
        string id PK
        string nik
        string nama_lengkap
        string id_jabatan FK
        string id_divisi FK
        string id_departemen FK
    }

    ABSENSI {
        string id PK
        string id_karyawan FK
        date   tanggal
        enum   status
    }

    TUGAS_HARIAN {
        string id PK
        string id_karyawan FK
        date   tanggal
        enum   status
    }

    PENILAIAN_KINERJA {
        string id PK
        string id_karyawan FK
        float  nilai_total
        string periode
    }

    USER_ADMIN {
        string id PK
        string email
        enum   role
    }

    DEPARTEMEN         ||--o{ DIVISI             : "1 dept → banyak divisi"
    DIVISI             ||--o{ JABATAN            : "1 divisi → banyak jabatan"
    JABATAN            ||--o{ KARYAWAN           : "1 jabatan → banyak karyawan"
    DIVISI             ||--o{ KARYAWAN           : "1 divisi → banyak karyawan"
    DEPARTEMEN         ||--o{ KARYAWAN           : "1 dept → banyak karyawan"
    KARYAWAN           ||--o{ ABSENSI            : "1 karyawan → banyak absensi"
    KARYAWAN           ||--o{ TUGAS_HARIAN       : "1 karyawan → banyak tugas"
    KARYAWAN           ||--o{ PENILAIAN_KINERJA  : "1 karyawan → banyak penilaian"
```

---

## 5. User Flow

### 5.1 Alur Admin Backoffice

```mermaid
flowchart TD
    START([Buka Aplikasi]) --> LOGIN[Halaman Login]
    LOGIN --> AUTH{Autentikasi\nAdmin?}
    AUTH -->|Gagal| LOGIN
    AUTH -->|Berhasil| DASH[Dashboard Backoffice]

    DASH --> MA[Kelola Master Data]
    DASH --> MK[Kelola Karyawan]
    DASH --> MT[Kelola Transaksi]

    MA --> MA1[CRUD Departemen]
    MA --> MA2[CRUD Divisi]
    MA --> MA3[CRUD Jabatan]

    MK --> MK1[Tambah Karyawan Baru]
    MK --> MK2[Edit Data Karyawan]
    MK --> MK3[Nonaktifkan Karyawan]

    MT --> MT1[Monitoring Absensi\nSeluruh Karyawan]
    MT --> MT2[Input / Koreksi\nPenilaian Kinerja]
    MT --> MT3[Lihat Rekap\nTugas Harian]

    MT1 --> EXPORT[Export Laporan]
    MT2 --> EXPORT
```

### 5.2 Alur Karyawan

```mermaid
flowchart TD
    START2([Buka Portal Karyawan]) --> LOGIN2[Login Karyawan]
    LOGIN2 --> AUTH2{Autentikasi\nKaryawan?}
    AUTH2 -->|Gagal| LOGIN2
    AUTH2 -->|Berhasil| HOME[Beranda Karyawan]

    HOME --> ABS[Absensi]
    HOME --> TUGAS[Tugas Harian]
    HOME --> REKAP[Lihat Rekap Saya]

    ABS --> ABS1{Sudah Absen\nMasuk?}
    ABS1 -->|Belum| ABS2[Absen Masuk\nFoto + Lokasi]
    ABS1 -->|Sudah| ABS3{Sudah Absen\nKeluar?}
    ABS3 -->|Belum| ABS4[Absen Keluar\nFoto + Lokasi]
    ABS3 -->|Sudah| ABS5[Tampilkan\nRekap Hari Ini]

    TUGAS --> T1[Lihat Tugas Hari Ini]
    TUGAS --> T2[Input Tugas Baru]
    TUGAS --> T3[Update Progress Tugas]

    REKAP --> R1[Rekap Absensi Bulanan]
    REKAP --> R2[Nilai Kinerja Pribadi]
```

---

## 6. Struktur File Proyek

```
hr-management/
|
├── docs/
│   └── PERANCANGAN.md          ← Dokumen perancangan ini
|
├── assets/
│   ├── css/
│   │   ├── main.css            ← Style global
│   │   ├── sidebar.css         ← Komponen sidebar
│   │   └── components.css      ← Komponen reusable (card, badge, dll)
│   │
│   ├── js/
│   │   ├── app.js              ← Entry point & inisialisasi global
│   │   ├── storage.js          ← Helper localStorage (CRUD generic)
│   │   ├── auth.js             ← Logika autentikasi global
│   │   ├── components-loader.js← Loader partial HTML dari folder components/
│   │   ├── validation.js       ← Helper validasi form
│   │   └── utils.js            ← Fungsi utilitas umum
│   │
│   └── img/
│       ├── logo.png
│       └── default-avatar.png
|
├── components/                 ← Partial HTML reusable agar header/navbar/footer tidak di-copy di setiap halaman
│   ├── header.html             ← Header/topbar reusable untuk Admin dan Portal Karyawan
│   ├── navbar.html             ← Sidebar Admin dan navbar Portal Karyawan
│   └── footer.html             ← Footer reusable
├── pages/
│   │
│   ├── data-departemen/
│   │   ├── index.html          ← Daftar departemen
│   │   ├── form.html           ← Tambah / Edit departemen
│   │   └── script.js           ← Logic CRUD departemen
│   │
│   ├── data-divisi/
│   │   ├── index.html          ← Daftar divisi
│   │   ├── form.html           ← Tambah / Edit divisi
│   │   └── script.js           ← Logic CRUD divisi
│   │
│   ├── data-jabatan/
│   │   ├── index.html          ← Daftar jabatan
│   │   ├── form.html           ← Tambah / Edit jabatan
│   │   └── script.js           ← Logic CRUD jabatan
│   │
│   ├── data-karyawan/
│   │   ├── index.html          ← Daftar karyawan
│   │   ├── form.html           ← Tambah / Edit karyawan
│   │   ├── detail.html         ← Detail profil karyawan
│   │   └── script.js           ← Logic CRUD & detail karyawan
│   │
│   ├── data-absensi/
│   │   ├── index.html          ← Rekap absensi (Admin view)
│   │   ├── detail.html         ← Detail absensi per karyawan
│   │   └── script.js           ← Logic rekap & detail absensi admin
│   │
│   ├── data-penilaian/
│   │   ├── index.html          ← Daftar penilaian kinerja
│   │   ├── form.html           ← Form penilaian
│   │   └── script.js           ← Logic CRUD penilaian kinerja
│   │
│   ├── data-tugas/
│   │   ├── index.html          ← Rekap tugas harian (Admin view)
│   │   ├── detail.html         ← Detail tugas per karyawan
│   │   └── script.js           ← Logic rekap & detail tugas admin
│   │
│   └── user-admin/
│       ├── index.html          ← Daftar user admin
│       ├── form.html           ← Tambah / Edit user admin
│       └── script.js           ← Logic CRUD user admin
|
├── employee/                   ← Portal Karyawan (aplikasi terpisah)
│   ├── index.html              ← Beranda karyawan (setelah login)
│   ├── login.html              ← Login karyawan
│   ├── script.js               ← Logic dashboard & login karyawan
│   │
│   ├── absensi/
│   │   ├── index.html          ← Form absen masuk/keluar
│   │   ├── riwayat.html        ← Riwayat absensi pribadi
│   │   └── script.js           ← Logic absensi karyawan
│   │
│   ├── tugas/
│   │   ├── index.html          ← Daftar tugas hari ini
│   │   ├── form.html           ← Input tugas baru / update progress
│   │   └── script.js           ← Logic tugas karyawan
│   │
│   └── profil/
│       ├── index.html          ← Profil & ubah password
│       └── script.js           ← Logic profil & ubah password
|
├── index.html                  ← Landing / redirect ke login admin
└── script.js                   ← Logic landing / redirect global awal
```

---

## Catatan Teknis

| Aspek                | Keterangan                                                                      |
| -------------------- | ------------------------------------------------------------------------------- |
| **Penyimpanan data** | `localStorage` untuk prototyping; migrasi ke REST API / backend saat production |
| **Storage key**      | Prefix `hr_` untuk semua key (contoh: `hr_departemen`, `hr_karyawan`)           |
| **ID record**        | Format `{entitas}-{timestamp}` (contoh: `dep-1718000000000`)                    |
| **Autentikasi**      | `sessionStorage` untuk sesi login aktif; timeout otomatis setelah idle          |
| **Validasi**         | Semua form menggunakan validasi client-side sebelum simpan ke storage           |
| **Notifikasi**       | Toast notification via Bootstrap untuk feedback aksi CRUD                       |
| **Foto absensi**     | Capture via `getUserMedia()` API (kamera perangkat)                             |
| **Lokasi absensi**   | `navigator.geolocation` API untuk koordinat GPS                                 |

---
