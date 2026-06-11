document.addEventListener("DOMContentLoaded", () => {
  const karyawan = HRStorage.all("karyawan");
  const absensi = HRStorage.all("absensi");
  const tugas = HRStorage.all("tugas_harian");
  const nilai = HRStorage.all("penilaian_kinerja");
  HRUtils.byId("karyawanTotal").textContent = karyawan.length;
  HRUtils.byId("hadirTotal").textContent = absensi.filter(
    (a) => a.status === "Hadir",
  ).length;
  HRUtils.byId("tugasTotal").textContent = tugas.length;
  HRUtils.byId("nilaiAvg").textContent = nilai.length
    ? Math.round(
        nilai.reduce((a, b) => a + Number(b.nilai_total || 0), 0) /
          nilai.length,
      )
    : 0;
  const deptMap = HRStorage.all("departemen").map((d) => ({
    nama: d.nama,
    total: karyawan.filter((k) => k.id_departemen === d.id).length,
  }));
  const statusMap = ["Hadir", "Izin", "Sakit", "Alpha"].map((s) => ({
    status: s,
    total: absensi.filter((a) => a.status === s).length,
  }));
  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };
  new Chart(document.getElementById("deptChart"), {
    type: "bar",
    data: {
      labels: deptMap.map((d) => d.nama),
      datasets: [{ label: "Karyawan", data: deptMap.map((d) => d.total) }],
    },
    options: chartOpts,
  });
  new Chart(document.getElementById("attChart"), {
    type: "doughnut",
    data: {
      labels: statusMap.map((s) => s.status),
      datasets: [{ label: "Absensi", data: statusMap.map((s) => s.total) }],
    },
    options: chartOpts,
  });
  const tbody = HRUtils.byId("recentAbsensi");
  tbody.innerHTML =
    absensi
      .slice(-6)
      .reverse()
      .map(
        (a) =>
          `<tr><td>${HRUtils.fmtDate(a.tanggal)}</td><td>${HRUtils.escape(HRUtils.nameOf("karyawan", a.id_karyawan, "nama_lengkap"))}</td><td>${a.jam_masuk || "-"}</td><td>${a.jam_keluar || "-"}</td><td>${HRUtils.statusBadge(a.status)}</td></tr>`,
      )
      .join("") ||
    `<tr><td colspan="5"><div class="empty-state">Belum ada absensi.</div></td></tr>`;
});
