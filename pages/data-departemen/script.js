document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("departemenTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("departemen");
      table.innerHTML =
        rows
          .map(
            (d) =>
              `<tr><td><strong>${HRUtils.escape(d.kode)}</strong></td><td>${HRUtils.escape(d.nama)}</td><td>${HRUtils.escape(d.kepala_departemen || "-")}</td><td>${HRUtils.statusBadge(d.status)}</td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-primary" href="form.html?id=${d.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${d.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="5"><div class="empty-state">Belum ada data departemen.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("departemen", id);
        HRUtils.toast("Departemen dihapus.");
        render();
      }
    });
    HRUtils.byId("exportDepartemen")?.addEventListener("click", () =>
      HRUtils.downloadCSV("departemen.csv", HRStorage.all("departemen")),
    );
  }
  const form = HRUtils.byId("departemenForm");
  if (form) {
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("departemen", id);
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
        HRStorage.update("departemen", data.id, data);
        HRUtils.toast("Departemen diperbarui.");
      } else {
        data.id = HRStorage.id("dep");
        data.created_at = now;
        data.updated_at = now;
        HRStorage.insert("departemen", data);
        HRUtils.toast("Departemen ditambahkan.");
      }
      location.href = "index.html";
    });
  }
});
