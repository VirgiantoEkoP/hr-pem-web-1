document.addEventListener("DOMContentLoaded", () => {
  const table = HRUtils.byId("nilaiTable");
  if (table) {
    const render = () => {
      const rows = HRStorage.all("penilaian_kinerja");
      table.innerHTML =
        rows
          .map(
            (n) =>
              `<tr><td>${HRUtils.escape(n.periode)} ${n.tahun}</td><td>${HRUtils.escape(HRUtils.nameOf("karyawan", n.id_karyawan, "nama_lengkap"))}</td><td>${HRUtils.escape(HRUtils.nameOf("karyawan", n.id_penilai, "nama_lengkap"))}</td><td><strong>${Number(n.nilai_total || 0)}</strong></td><td>${HRUtils.statusBadge(n.status)}</td><td class="text-end"><div class="action-group justify-content-end"><a class="btn btn-sm btn-outline-primary" href="form.html?id=${n.id}">Edit</a><button class="btn btn-sm btn-outline-danger" data-del="${n.id}">Hapus</button></div></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="6"><div class="empty-state">Belum ada penilaian.</div></td></tr>`;
    };
    render();
    table.addEventListener("click", (e) => {
      const id = e.target.dataset.del;
      if (id && HRUtils.confirmDelete()) {
        HRStorage.remove("penilaian_kinerja", id);
        HRUtils.toast("Penilaian dihapus.");
        render();
      }
    });
  }
  const form = HRUtils.byId("nilaiForm");
  if (form) {
    const opts =
      '<option value="">Pilih karyawan</option>' +
      HRStorage.all("karyawan")
        .map(
          (k) =>
            `<option value="${k.id}">${HRUtils.escape(k.nama_lengkap)}</option>`,
        )
        .join("");
    HRUtils.byId("karyawanSelect").innerHTML = opts;
    HRUtils.byId("penilaiSelect").innerHTML = opts;
    const recalc = () => {
      const vals = [...form.querySelectorAll(".score")].map((i) =>
        Number(i.value || 0),
      );
      HRUtils.byId("nilaiTotal").value =
        Math.round(vals.reduce((a, b) => a + b, 0) / 4) || 0;
    };
    form
      .querySelectorAll(".score")
      .forEach((i) => i.addEventListener("input", recalc));
    HRValidator.bind(form);
    const id = HRUtils.qs("id");
    if (id) {
      const row = HRStorage.find("penilaian_kinerja", id);
      if (row)
        Object.entries(row).forEach(([k, v]) => {
          if (form.elements[k]) form.elements[k].value = v ?? "";
        });
    }
    recalc();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      recalc();
      if (!HRValidator.validateForm(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      const now = new Date().toISOString();
      [
        "nilai_kedisiplinan",
        "nilai_kerjasama",
        "nilai_produktivitas",
        "nilai_inisiatif",
        "nilai_total",
        "tahun",
      ].forEach((k) => (data[k] = Number(data[k] || 0)));
      if (data.id) {
        HRStorage.update("penilaian_kinerja", data.id, data);
        HRUtils.toast("Penilaian diperbarui.");
      } else {
        data.id = HRStorage.id("nil");
        data.tanggal_penilaian = now;
        data.created_at = now;
        data.updated_at = now;
        HRStorage.insert("penilaian_kinerja", data);
        HRUtils.toast("Penilaian ditambahkan.");
      }
      location.href = "index.html";
    });
  }
});
