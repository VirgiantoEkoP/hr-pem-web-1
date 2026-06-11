document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("jabatanTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("jabatan");
      table.innerHTML =
        rows
          .map(
            (j) =>
              `<tr><td><strong>${HRUtils.escape(j.nama_jabatan)}</strong></td><td>${HRUtils.escape(HRUtils.nameOf("divisi", j.id_divisi))}</td><td>${HRUtils.escape(j.level)}</td><td>${HRUtils.statusBadge(j.status)}</td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-primary" href="form.html?id=${j.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${j.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="5"><div class="empty-state">Belum ada data jabatan.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("jabatan", id);
        HRUtils.toast("Jabatan dihapus.");
        render();
      }
    });
  }
  const form = HRUtils.byId("jabatanForm");
  if (form) {
    const sel = HRUtils.byId("divisiSelect");
    sel.innerHTML =
      '<option value="">Pilih divisi</option>' +
      HRStorage.all("divisi")
        .map(
          (d) => `<option value="${d.id}">${HRUtils.escape(d.nama)}</option>`,
        )
        .join("");
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("jabatan", id);
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
        HRStorage.update("jabatan", data.id, data);
        HRUtils.toast("Jabatan diperbarui.");
      } else {
        data.id = HRStorage.id("jab");
        data.created_at = now;
        data.updated_at = now;
        HRStorage.insert("jabatan", data);
        HRUtils.toast("Jabatan ditambahkan.");
      }
      location.href = "index.html";
    });
  }
});
