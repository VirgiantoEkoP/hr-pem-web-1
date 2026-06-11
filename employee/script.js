document.addEventListener("DOMContentLoaded", () => {
  seedHRData();
  const login = HRUtils.byId("employeeLoginForm");
  if (login) {
    HRValidator.bind(login);
    login.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!HRValidator.validateForm(login)) return;
      const data = Object.fromEntries(new FormData(login).entries());
      if (HRAuth.loginEmployee(data.email.trim(), data.password.trim()))
        location.href = "index.html";
      else
        HRUtils.toast("Email atau password karyawan tidak sesuai.", "danger");
    });
    return;
  }
  const s = HRAuth.getSession();
  if (!s) return;
  const k = HRStorage.find("karyawan", s.user_id);
  if (!k) return;
  const abs = HRStorage.all("absensi").filter((a) => a.id_karyawan === k.id);
  const tugas = HRStorage.all("tugas_harian").filter(
    (t) => t.id_karyawan === k.id,
  );
  const nilai = HRStorage.all("penilaian_kinerja").filter(
    (n) => n.id_karyawan === k.id,
  );
  HRUtils.byId("empDept") &&
    (HRUtils.byId("empDept").textContent = HRUtils.nameOf(
      "departemen",
      k.id_departemen,
    ));
  HRUtils.byId("empJabatan") &&
    (HRUtils.byId("empJabatan").textContent = HRUtils.nameOf(
      "jabatan",
      k.id_jabatan,
      "nama_jabatan",
    ));
  HRUtils.byId("empAbsTotal") &&
    (HRUtils.byId("empAbsTotal").textContent = abs.length);
  HRUtils.byId("empTaskTotal") &&
    (HRUtils.byId("empTaskTotal").textContent = tugas.length);
  HRUtils.byId("empNilai") &&
    (HRUtils.byId("empNilai").textContent = nilai.length
      ? nilai.at(-1).nilai_total
      : "-");
  const tbody = HRUtils.byId("empTaskRecent");
  if (tbody) {
    tbody.innerHTML =
      tugas
        .slice(-5)
        .reverse()
        .map(
          (t) =>
            `<tr><td>${HRUtils.fmtDate(t.tanggal)}</td><td>${HRUtils.escape(t.judul_tugas)}</td><td>${HRUtils.statusBadge(t.status)}</td><td>${t.progress_persen || 0}%</td></tr>`,
        )
        .join("") ||
      `<tr><td colspan="4"><div class="empty-state">Belum ada tugas.</div></td></tr>`;
  }
});
