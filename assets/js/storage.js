const HR_PREFIX = "hr_";
const HRStorage = {
  key(entity) {
    return `${HR_PREFIX}${entity}`;
  },
  all(entity) {
    try {
      return JSON.parse(localStorage.getItem(this.key(entity)) || "[]");
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  set(entity, rows) {
    localStorage.setItem(this.key(entity), JSON.stringify(rows));
    return rows;
  },
  id(prefix) {
    return `${prefix}-${Date.now()}`;
  },
  find(entity, id) {
    return this.all(entity).find((row) => row.id === id) || null;
  },
  insert(entity, row) {
    const rows = this.all(entity);
    rows.push(row);
    this.set(entity, rows);
    return row;
  },
  update(entity, id, patch) {
    const rows = this.all(entity).map((row) =>
      row.id === id
        ? { ...row, ...patch, updated_at: new Date().toISOString() }
        : row,
    );
    this.set(entity, rows);
    return this.find(entity, id);
  },
  remove(entity, id) {
    const rows = this.all(entity).filter((row) => row.id !== id);
    this.set(entity, rows);
    return rows;
  },
  upsert(entity, row) {
    return row.id && this.find(entity, row.id)
      ? this.update(entity, row.id, row)
      : this.insert(entity, row);
  },
};
function seedHRData() {
  const now = new Date().toISOString();
  if (!localStorage.getItem(HRStorage.key("departemen"))) {
    HRStorage.set("departemen", [
      {
        id: "dep-1718000000000",
        kode: "HRD",
        nama: "Human Resource",
        kepala_departemen: "Nadia Rahma",
        status: "Aktif",
        deskripsi: "Pengelolaan SDM dan administrasi karyawan",
        created_at: now,
        updated_at: now,
      },
      {
        id: "dep-1718000000001",
        kode: "OPS",
        nama: "Operasional",
        kepala_departemen: "Raka Putra",
        status: "Aktif",
        deskripsi: "Pelaksanaan operasional harian",
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("divisi"))) {
    HRStorage.set("divisi", [
      {
        id: "div-1718000000000",
        id_departemen: "dep-1718000000000",
        kode: "RECR",
        nama: "Recruitment",
        kepala_divisi: "Mira Safitri",
        status: "Aktif",
        created_at: now,
        updated_at: now,
      },
      {
        id: "div-1718000000001",
        id_departemen: "dep-1718000000001",
        kode: "FIELD",
        nama: "Field Operation",
        kepala_divisi: "Bimo Aditya",
        status: "Aktif",
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("jabatan"))) {
    HRStorage.set("jabatan", [
      {
        id: "jab-1718000000000",
        id_divisi: "div-1718000000000",
        nama_jabatan: "HR Officer",
        level: "Staff",
        status: "Aktif",
        created_at: now,
        updated_at: now,
      },
      {
        id: "jab-1718000000001",
        id_divisi: "div-1718000000001",
        nama_jabatan: "Supervisor Lapangan",
        level: "Supervisor",
        status: "Aktif",
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("karyawan"))) {
    HRStorage.set("karyawan", [
      {
        id: "kar-1718000000000",
        nik: "EMP001",
        nama_lengkap: "Andi Saputra",
        id_departemen: "dep-1718000000000",
        id_divisi: "div-1718000000000",
        id_jabatan: "jab-1718000000000",
        email: "andi@hr.local",
        password: "123456",
        no_telepon: "081200000001",
        tanggal_bergabung: "2024-01-10",
        status: "Aktif",
        foto: "",
        created_at: now,
        updated_at: now,
      },
      {
        id: "kar-1718000000001",
        nik: "EMP002",
        nama_lengkap: "Sinta Permata",
        id_departemen: "dep-1718000000001",
        id_divisi: "div-1718000000001",
        id_jabatan: "jab-1718000000001",
        email: "sinta@hr.local",
        password: "123456",
        no_telepon: "081200000002",
        tanggal_bergabung: "2024-03-17",
        status: "Aktif",
        foto: "",
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("user_admin"))) {
    HRStorage.set("user_admin", [
      {
        id: "usr-1718000000000",
        nama: "Admin HR",
        email: "admin@hr.local",
        password: "admin123",
        role: "Super Admin",
        status: "Aktif",
        last_login: "",
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("absensi"))) {
    const today = new Date().toISOString().slice(0, 10);
    HRStorage.set("absensi", [
      // {
      //   id: "abs-1718000000000",
      //   id_karyawan: "kar-1718000000000",
      //   tanggal: today,
      //   jam_masuk: "08:02",
      //   jam_keluar: "17:05",
      //   status: "Hadir",
      //   lokasi_masuk: "-6.200000,106.816666",
      //   lokasi_keluar: "-6.200000,106.816666",
      //   foto_masuk: "",
      //   foto_keluar: "",
      //   keterangan: "Sample data",
      //   created_at: now,
      //   updated_at: now,
      // },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("tugas_harian"))) {
    const today = new Date().toISOString().slice(0, 10);
    HRStorage.set("tugas_harian", [
      {
        id: "tgs-1718000000000",
        id_karyawan: "kar-1718000000000",
        tanggal: today,
        judul_tugas: "Validasi data karyawan",
        deskripsi: "Memeriksa kelengkapan data master karyawan.",
        prioritas: "Tinggi",
        status: "Proses",
        jam_mulai: "09:00",
        jam_selesai: "",
        progress_persen: 65,
        catatan: "Masih cek nomor telepon.",
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  if (!localStorage.getItem(HRStorage.key("penilaian_kinerja"))) {
    HRStorage.set("penilaian_kinerja", [
      {
        id: "nil-1718000000000",
        id_karyawan: "kar-1718000000000",
        id_penilai: "kar-1718000000001",
        periode: "Juni",
        tahun: 2026,
        nilai_kedisiplinan: 88,
        nilai_kerjasama: 84,
        nilai_produktivitas: 90,
        nilai_inisiatif: 82,
        nilai_total: 86,
        catatan_penilai: "Kinerja stabil dan responsif.",
        status: "Final",
        tanggal_penilaian: now,
        created_at: now,
        updated_at: now,
      },
    ]);
  }
}
window.HRStorage = HRStorage;
window.seedHRData = seedHRData;
