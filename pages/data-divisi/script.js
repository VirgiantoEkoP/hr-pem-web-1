document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("divisiTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("divisi");
      table.innerHTML =
        rows
          .map(
            (d) =>
              `<tr><td><strong>${HRUtils.escape(d.kode)}</strong></td><td>${HRUtils.escape(d.nama)}</td><td>${HRUtils.escape(HRUtils.nameOf("departemen", d.id_departemen))}</td><td>${HRUtils.escape(d.kepala_divisi || "-")}</td><td>${HRUtils.statusBadge(d.status)}</td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-primary" href="form.html?id=${d.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${d.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="6"><div class="empty-state">Belum ada data divisi.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("divisi", id);
        HRUtils.toast("Divisi dihapus.");
        render();
      }
    });
  }
  const form = HRUtils.byId("divisiForm");
  if (form) {
    const dep = HRUtils.byId("departemenSelect");
    dep.innerHTML =
      '<option value="">Pilih departemen</option>' +
      HRStorage.all("departemen")
        .map(
          (d) => `<option value="${d.id}">${HRUtils.escape(d.nama)}</option>`,
        )
        .join("");
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("divisi", id);
      if (row)
        Object.entries(row).forEach(([k, v]) => {
          if (form.elements[k]) form.elements[k].value = v ?? "";
        });
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!HRValidator.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      const now = new Date().toISOString();
      if (data.id) {
        HRStorage.update("divisi", data.id, data);
        HRUtils.toast("Divisi diperbarui.");
      } else {
        data.id = HRStorage.id("div");
        data.created_at = now;
        data.updated_at = now;
        HRStorage.insert("divisi", data);
        HRUtils.toast("Divisi ditambahkan.");
      }
      location.href = "index.html";
    });
  }
});
