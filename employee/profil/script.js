document.addEventListener("DOMContentLoaded", () => {
  const s = HRAuth.getSession();
  if (!s) return;
  const k = HRStorage.find("karyawan", s.user_id);
  const box = HRUtils.byId("profileInfo");
  if (k && box) {
    box.innerHTML = `<div class="d-flex align-items-center gap-3 mb-3"><span class="avatar-sm" style="width:64px;height:64px;font-size:1.8rem">${HRUtils.escape(k.nama_lengkap.slice(0, 1))}</span><div><h2 class="h5 fw-bold mb-1">${HRUtils.escape(k.nama_lengkap)}</h2><div class="text-muted-small">${HRUtils.escape(k.email)}</div></div></div><div class="soft-panel"><div>NIK: <strong>${HRUtils.escape(k.nik)}</strong></div><div>Departemen: <strong>${HRUtils.escape(HRUtils.nameOf("departemen", k.id_departemen))}</strong></div><div>Divisi: <strong>${HRUtils.escape(HRUtils.nameOf("divisi", k.id_divisi))}</strong></div><div>Jabatan: <strong>${HRUtils.escape(HRUtils.nameOf("jabatan", k.id_jabatan, "nama_jabatan"))}</strong></div><div>Telepon: <strong>${HRUtils.escape(k.no_telepon || "-")}</strong></div></div>`;
  }
  const form = HRUtils.byId("profilePasswordForm");
  if (form) {
    HRValidator.bind(form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!HRValidator.validateForm(form)) return;
      HRStorage.update("karyawan", s.user_id, {
        password: form.elements.password.value,
      });
      HRUtils.toast("Password diperbarui.");
      form.reset();
    });
  }
});
