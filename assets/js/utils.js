const HRUtils = {
  qs(name) {
    return new URLSearchParams(location.search).get(name);
  },
  nowDate() {
    return new Date().toISOString().slice(0, 10);
  },
  nowTime() {
    return new Date().toTimeString().slice(0, 5);
  },
  fmtDate(v) {
    if (!v) return "-";
    return new Date(v).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },
  fmtDateTime(v) {
    if (!v) return "-";
    return new Date(v).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  },
  byId(id) {
    return document.getElementById(id);
  },
  nameOf(entity, id, field = "nama") {
    const row = HRStorage.find(entity, id);
    return row
      ? row[field] || row.nama_lengkap || row.nama_jabatan || "-"
      : "-";
  },
  statusBadge(status) {
    const map = {
      Aktif: "success",
      Nonaktif: "secondary",
      Hadir: "success",
      Izin: "warning",
      Sakit: "info",
      Alpha: "danger",
      Proses: "primary",
      Selesai: "success",
      Tertunda: "warning",
      Draft: "secondary",
      Final: "success",
    };
    return `<span class="badge text-bg-${map[status] || "secondary"} badge-status">${status || "-"}</span>`;
  },
  escape(v) {
    return String(v ?? "").replace(
      /[&<>'"]/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[c],
    );
  },
  toast(message, variant = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container position-fixed top-0 end-0 p-3";
      document.body.appendChild(container);
    }
    const el = document.createElement("div");
    el.className = `toast align-items-center text-bg-${variant} border-0`;
    el.role = "alert";
    el.ariaLive = "assertive";
    el.ariaAtomic = "true";
    el.innerHTML = `<div class="d-flex"><div class="toast-body">${this.escape(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Tutup"></button></div>`;
    container.appendChild(el);
    const toast = new bootstrap.Toast(el, { delay: 2600 });
    toast.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
  },
  confirmDelete(text = "Data akan dihapus. Lanjutkan?") {
    return window.confirm(text);
  },
  downloadCSV(filename, rows) {
    if (!rows.length) {
      this.toast("Tidak ada data untuk diekspor.", "warning");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => `"${String(r[h] ?? "").replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
window.HRUtils = HRUtils;
