document.addEventListener("DOMContentLoaded", () => {
  const s = HRAuth.getSession();
  if (!s) return;
  const table = HRUtils.byId("employeeTugasTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("tugas_harian").filter(
        (t) => t.id_karyawan === s.user_id,
      );
      table.innerHTML =
        rows
          .map(
            (t) =>
              `<tr><td>${HRUtils.fmtDate(t.tanggal)}</td><td><strong>${HRUtils.escape(t.judul_tugas)}</strong></td><td>${HRUtils.escape(t.prioritas)}</td><td>${HRUtils.statusBadge(t.status)}</td><td><div class="progress"><div class="progress-bar" style="width:${Number(t.progress_persen || 0)}%"></div></div><span class="text-muted-small">${t.progress_persen || 0}%</span></td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-primary" href="form.html?id=${t.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${t.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="6"><div class="empty-state">Belum ada tugas.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("tugas_harian", id);
        HRUtils.toast("Tugas dihapus.");
        render();
      }
    });
  }
  const form = HRUtils.byId("employeeTugasForm");
  if (form) {
    form.elements.tanggal.value ||= HRUtils.nowDate();
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("tugas_harian", id);
      if (row)
        Object.entries(row).forEach(([k, v]) => {
          if (form.elements[k]) form.elements[k].value = v ?? "";
        });
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!HRValidator.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      data.id_karyawan = s.user_id;
      data.progress_persen = Number(data.progress_persen || 0);
      const now = new Date().toISOString();
      if (data.id) {
        HRStorage.update("tugas_harian", data.id, data);
        HRUtils.toast("Tugas diperbarui.");
      } else {
        data.id = HRStorage.id("tgs");
        data.created_at = now;
        data.updated_at = now;
        HRStorage.insert("tugas_harian", data);
        HRUtils.toast("Tugas ditambahkan.");
      }
      location.href = "index.html";
    });
  }
});
