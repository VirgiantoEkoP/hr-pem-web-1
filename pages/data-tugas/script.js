document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("tugasAdminTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("tugas_harian");
      table.innerHTML =
        rows
          .map(
            (t) =>
              `<tr><td>${HRUtils.fmtDate(t.tanggal)}</td><td>${HRUtils.escape(HRUtils.nameOf("karyawan", t.id_karyawan, "nama_lengkap"))}</td><td><strong>${HRUtils.escape(t.judul_tugas)}</strong></td><td>${HRUtils.escape(t.prioritas)}</td><td>${HRUtils.statusBadge(t.status)}</td><td><div class="progress"><div class="progress-bar" style="width:${Number(t.progress_persen || 0)}%"></div></div><span class="text-muted-small">${t.progress_persen || 0}%</span></td><td class="text-end"><a class="btn btn-sm btn-outline-secondary" href="detail.html?id=${t.id}">Detail</a></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="7"><div class="empty-state">Belum ada tugas.</div></td></tr>`;
    };
    render();
    HRUtils.byId("exportTugas")?.addEventListener("click", () =>
      HRUtils.downloadCSV("tugas_harian.csv", HRStorage.all("tugas_harian")),
    );
  }
  const detail = HRUtils.byId("tugasDetail");
  if (detail) {
    const t = HRStorage.find("tugas_harian", HRUtils.qs("id"));
    if (!t) {
      detail.innerHTML = '<div class="empty-state">Data tidak ditemukan.</div>';
      return;
    }
    detail.innerHTML = `<h2 class="h4 fw-bold">${HRUtils.escape(t.judul_tugas)}</h2><p class="text-muted">${HRUtils.escape(HRUtils.nameOf("karyawan", t.id_karyawan, "nama_lengkap"))} · ${HRUtils.fmtDate(t.tanggal)}</p><div class="row g-3"><div class="col-md-8"><div class="soft-panel"><h6>Deskripsi</h6><p>${HRUtils.escape(t.deskripsi || "-")}</p><h6>Catatan</h6><p class="mb-0">${HRUtils.escape(t.catatan || "-")}</p></div></div><div class="col-md-4"><div class="soft-panel"><div class="mb-2">Status: ${HRUtils.statusBadge(t.status)}</div><div>Prioritas: <strong>${HRUtils.escape(t.prioritas)}</strong></div><div>Jam: <strong>${t.jam_mulai || "-"} - ${t.jam_selesai || "-"}</strong></div><div class="mt-3"><div class="progress"><div class="progress-bar" style="width:${Number(t.progress_persen || 0)}%"></div></div><span class="text-muted-small">${t.progress_persen || 0}%</span></div></div></div></div><a href="index.html" class="btn btn-light mt-3">Kembali</a>`;
  }
});
