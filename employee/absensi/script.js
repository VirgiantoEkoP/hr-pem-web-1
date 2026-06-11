document.addEventListener("DOMContentLoaded", () => {
  const s = HRAuth.getSession();
  if (!s) return;
  const today = HRUtils.nowDate();
  let photo = "",
    locationText = "";
  let stream = null;
  function currentToday() {
    return HRStorage.all("absensi").find(
      (a) => a.id_karyawan === s.user_id && a.tanggal === today,
    );
  }
  function renderStatus() {
    const box = HRUtils.byId("todayStatus");
    if (!box) return;
    const a = currentToday();
    if (!a) {
      box.innerHTML =
        '<div class="empty-state">Belum absen masuk hari ini.</div>';
      return;
    }
    box.innerHTML = `<div class="soft-panel"><div class="mb-2">Status: ${HRUtils.statusBadge(a.status)}</div><div>Masuk: <strong>${a.jam_masuk || "-"}</strong></div><div>Keluar: <strong>${a.jam_keluar || "-"}</strong></div><div class="text-muted-small mt-2">${a.jam_keluar ? "Absensi hari ini sudah lengkap." : "Langkah berikutnya: absen keluar."}</div></div>`;
  }
  renderStatus();
  HRUtils.byId("startCamera")?.addEventListener("click", async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      HRUtils.byId("cameraVideo").srcObject = stream;
      HRUtils.toast("Kamera aktif.");
    } catch (e) {
      HRUtils.toast(
        "Kamera tidak dapat diakses. Gunakan HTTPS/localhost dan izinkan kamera.",
        "danger",
      );
    }
  });
  HRUtils.byId("capturePhoto")?.addEventListener("click", () => {
    const video = HRUtils.byId("cameraVideo"),
      canvas = HRUtils.byId("cameraCanvas");
    if (!video.videoWidth) {
      HRUtils.toast("Aktifkan kamera terlebih dahulu.", "warning");
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    photo = canvas.toDataURL("image/jpeg", 0.75);
    HRUtils.byId("photoText").textContent = "Foto siap";
    HRUtils.toast("Foto berhasil diambil.");
  });
  HRUtils.byId("getLocation")?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      HRUtils.toast("Geolocation tidak didukung browser.", "danger");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationText = `${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
        HRUtils.byId("locationText").textContent = locationText;
        HRUtils.toast("Lokasi berhasil diambil.");
      },
      () =>
        HRUtils.toast(
          "Lokasi tidak dapat diakses. Izinkan akses lokasi.",
          "danger",
        ),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
  HRUtils.byId("submitAbsensi")?.addEventListener("click", () => {
    if (!photo) {
      HRUtils.toast("Ambil foto terlebih dahulu.", "warning");
      return;
    }
    if (!locationText) {
      HRUtils.toast("Ambil lokasi terlebih dahulu.", "warning");
      return;
    }
    const now = new Date().toISOString();
    const existing = currentToday();
    if (!existing) {
      HRStorage.insert("absensi", {
        id: HRStorage.id("abs"),
        id_karyawan: s.user_id,
        tanggal: today,
        jam_masuk: HRUtils.nowTime(),
        jam_keluar: "",
        status: "Hadir",
        lokasi_masuk: locationText,
        lokasi_keluar: "",
        foto_masuk: photo,
        foto_keluar: "",
        keterangan: "",
        created_at: now,
        updated_at: now,
      });
      HRUtils.toast("Absen masuk tersimpan.");
    } else if (!existing.jam_keluar) {
      HRStorage.update("absensi", existing.id, {
        jam_keluar: HRUtils.nowTime(),
        lokasi_keluar: locationText,
        foto_keluar: photo,
      });
      HRUtils.toast("Absen keluar tersimpan.");
    } else {
      HRUtils.toast("Absensi hari ini sudah lengkap.", "info");
    }
    renderStatus();
  });
  const riwayat = HRUtils.byId("riwayatAbsensi");
  if (riwayat) {
    const rows = HRStorage.all("absensi")
      .filter((a) => a.id_karyawan === s.user_id)
      .reverse();
    riwayat.innerHTML =
      rows
        .map(
          (a) =>
            `<tr><td>${HRUtils.fmtDate(a.tanggal)}</td><td>${a.jam_masuk || "-"}</td><td>${a.jam_keluar || "-"}</td><td>${HRUtils.statusBadge(a.status)}</td><td><span class="text-muted-small">${HRUtils.escape(a.lokasi_masuk || "-")}</span></td></tr>`,
        )
        .join("") ||
      `<tr><td colspan="5"><div class="empty-state">Belum ada riwayat absensi.</div></td></tr>`;
  }
});
