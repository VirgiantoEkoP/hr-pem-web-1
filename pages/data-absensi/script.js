document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("absensiTable");
  if (table) {
    const search = HRUtils.byId("searchAbsensi"),
      tanggal = HRUtils.byId("filterTanggal");
    const render = () => {
      const q = (search.value || "").toLowerCase();
      const t = tanggal.value;
      const rows = HRStorage.all("absensi").filter((a) => {
        const nama = HRUtils.nameOf(
          "karyawan",
          a.id_karyawan,
          "nama_lengkap",
        ).toLowerCase();
        return (!q || nama.includes(q)) && (!t || a.tanggal === t);
      });
      table.innerHTML =
        rows
          .map(
            (a) =>
              `<tr><td>${HRUtils.fmtDate(a.tanggal)}</td><td>${HRUtils.escape(HRUtils.nameOf("karyawan", a.id_karyawan, "nama_lengkap"))}</td><td>${a.jam_masuk || "-"}</td><td>${a.jam_keluar || "-"}</td><td>${HRUtils.statusBadge(a.status)}</td><td><span class="text-muted-small">${HRUtils.escape(a.lokasi_masuk || "-")}</span></td><td class="text-end"><a class="btn btn-sm btn-outline-secondary" href="detail.html?id=${a.id}">Detail</a></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="7"><div class="empty-state">Data absensi tidak ditemukan.</div></td></tr>`;
    };
    [search, tanggal].forEach((el) => el.addEventListener("input", render));
    render();
    HRUtils.byId("exportAbsensi")?.addEventListener("click", () =>
      HRUtils.downloadCSV("absensi.csv", HRStorage.all("absensi")),
    );
  }
  const detail = HRUtils.byId("absensiDetail");
  if (detail) {
    const a = HRStorage.find("absensi", HRUtils.qs("id"));
    if (!a) {
      detail.innerHTML = '<div class="empty-state">Data tidak ditemukan.</div>';
      return;
    }
    const imgIn = a.foto_masuk
      ? `<img class="photo-preview rounded" src="${a.foto_masuk}">`
      : '<div class="empty-state">Foto masuk kosong.</div>';
    const imgOut = a.foto_keluar
      ? `<img class="photo-preview rounded" src="${a.foto_keluar}">`
      : '<div class="empty-state">Foto keluar kosong.</div>';
    detail.innerHTML = `<h2 class="h4 fw-bold">${HRUtils.escape(HRUtils.nameOf("karyawan", a.id_karyawan, "nama_lengkap"))}</h2><p class="text-muted">${HRUtils.fmtDate(a.tanggal)} · ${a.status}</p><div class="row g-3"><div class="col-md-6"><div class="soft-panel"><h6>Masuk</h6><p>Jam: <strong>${a.jam_masuk || "-"}</strong><br>Lokasi: <span class="text-muted-small">${a.lokasi_masuk || "-"}</span></p>${imgIn}</div></div><div class="col-md-6"><div class="soft-panel"><h6>Keluar</h6><p>Jam: <strong>${a.jam_keluar || "-"}</strong><br>Lokasi: <span class="text-muted-small">${a.lokasi_keluar || "-"}</span></p>${imgOut}</div></div></div><a href="index.html" class="btn btn-light mt-3">Kembali</a>`;
  }
});
