document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("karyawanTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("karyawan");
      table.innerHTML =
        rows
          .map(
            (k) =>
              `<tr><td><div class="d-flex align-items-center gap-2"><span class="avatar-sm">${HRUtils.escape((k.nama_lengkap || "?").slice(0, 1))}</span><div><strong>${HRUtils.escape(k.nama_lengkap)}</strong><div class="text-muted-small">${HRUtils.escape(k.email)}</div></div></div></td><td>${HRUtils.escape(k.nik)}</td><td>${HRUtils.escape(HRUtils.nameOf("departemen", k.id_departemen))}</td><td>${HRUtils.escape(HRUtils.nameOf("jabatan", k.id_jabatan, "nama_jabatan"))}</td><td>${HRUtils.statusBadge(k.status)}</td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-secondary" href="detail.html?id=${k.id}">Detail</a><a class="btn btn-sm btn-outline-primary" href="form.html?id=${k.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${k.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="6"><div class="empty-state">Belum ada data karyawan.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("karyawan", id);
        HRUtils.toast("Karyawan dihapus.");
        render();
      }
    });
    HRUtils.byId("exportKaryawan")?.addEventListener("click", () =>
      HRUtils.downloadCSV("karyawan.csv", HRStorage.all("karyawan")),
    );
  }
  const form = HRUtils.byId("karyawanForm");
  if (form) {
    const fillSelect = (id, rows, label) => {
      const el = HRUtils.byId(id);
      el.innerHTML =
        `<option value="">Pilih ${label}</option>` +
        rows
          .map(
            (r) =>
              `<option value="${r.id}">${HRUtils.escape(r.nama || r.nama_jabatan)}</option>`,
          )
          .join("");
    };
    fillSelect("departemenSelect", HRStorage.all("departemen"), "departemen");
    fillSelect("divisiSelect", HRStorage.all("divisi"), "divisi");
    fillSelect("jabatanSelect", HRStorage.all("jabatan"), "jabatan");
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("karyawan", id);
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
        HRStorage.update("karyawan", data.id, data);
        HRUtils.toast("Karyawan diperbarui.");
      } else {
        data.id = HRStorage.id("kar");
        data.created_at = now;
        data.updated_at = now;
        HRStorage.insert("karyawan", data);
        HRUtils.toast("Karyawan ditambahkan.");
      }
      location.href = "index.html";
    });
  }
  const detail = HRUtils.byId("karyawanDetail");
  if (detail) {
    const k = HRStorage.find("karyawan", HRUtils.qs("id"));
    if (!k) {
      detail.innerHTML = '<div class="empty-state">Data tidak ditemukan.</div>';
      return;
    }
    detail.innerHTML = `<div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4"><div class="d-flex align-items-center gap-3"><span class="avatar-sm" style="width:72px;height:72px;font-size:2rem">${HRUtils.escape(k.nama_lengkap.slice(0, 1))}</span><div><h2 class="h4 fw-bold mb-1">${HRUtils.escape(k.nama_lengkap)}</h2><div class="text-muted">${HRUtils.escape(k.email)}</div></div></div><div>${HRUtils.statusBadge(k.status)}</div></div><div class="row g-3"><div class="col-md-4"><div class="soft-panel"><div class="text-muted-small">NIK</div><strong>${HRUtils.escape(k.nik)}</strong></div></div><div class="col-md-4"><div class="soft-panel"><div class="text-muted-small">Departemen</div><strong>${HRUtils.escape(HRUtils.nameOf("departemen", k.id_departemen))}</strong></div></div><div class="col-md-4"><div class="soft-panel"><div class="text-muted-small">Divisi</div><strong>${HRUtils.escape(HRUtils.nameOf("divisi", k.id_divisi))}</strong></div></div><div class="col-md-4"><div class="soft-panel"><div class="text-muted-small">Jabatan</div><strong>${HRUtils.escape(HRUtils.nameOf("jabatan", k.id_jabatan, "nama_jabatan"))}</strong></div></div><div class="col-md-4"><div class="soft-panel"><div class="text-muted-small">Telepon</div><strong>${HRUtils.escape(k.no_telepon || "-")}</strong></div></div><div class="col-md-4"><div class="soft-panel"><div class="text-muted-small">Tanggal Bergabung</div><strong>${HRUtils.fmtDate(k.tanggal_bergabung)}</strong></div></div></div><div class="mt-4"><a href="index.html" class="btn btn-light">Kembali</a><a href="form.html?id=${k.id}" class="btn btn-primary">Edit</a></div>`;
  }
});
