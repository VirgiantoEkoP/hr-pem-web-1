document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("adminTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("user_admin");
      table.innerHTML =
        rows
          .map(
            (u) =>
              `<tr><td><strong>${HRUtils.escape(u.nama)}</strong></td><td>${HRUtils.escape(u.email)}</td><td>${HRUtils.escape(u.role)}</td><td>${HRUtils.statusBadge(u.status)}</td><td>${HRUtils.fmtDateTime(u.last_login)}</td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-primary" href="form.html?id=${u.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${u.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="6"><div class="empty-state">Belum ada user admin.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("user_admin", id);
        HRUtils.toast("User admin dihapus.");
        render();
      }
    });
  }
  const form = HRUtils.byId("adminForm");
  if (form) {
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("user_admin", id);
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
        HRStorage.update("user_admin", data.id, data);
        HRUtils.toast("User admin diperbarui.");
      } else {
        data.id = HRStorage.id("usr");
        data.created_at = now;
        data.updated_at = now;
        data.last_login = "";
        HRStorage.insert("user_admin", data);
        HRUtils.toast("User admin ditambahkan.");
      }
      location.href = "index.html";
    });
  }
});
