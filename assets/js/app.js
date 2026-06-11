document.addEventListener("DOMContentLoaded", async () => {
  if (window.seedHRData) {
    seedHRData();
  }

  if (window.HRComponents) {
    await HRComponents.loadAll();
  }

  const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      backdrop?.classList.toggle("show");
    });

    backdrop?.addEventListener("click", () => {
      sidebar.classList.remove("show");
      backdrop.classList.remove("show");
    });
  }

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => HRAuth.logout());
  });

  const session = HRAuth.getSession();

  document.querySelectorAll("[data-session-name]").forEach((element) => {
    element.textContent = session?.nama || "Pengguna";
  });

  document.querySelectorAll("[data-session-role]").forEach((element) => {
    element.textContent = session?.role || "-";
  });
});
