document.addEventListener("DOMContentLoaded", () => {
  seedHRData();
  const form = document.getElementById("adminLoginForm");
  if (!form) return;
  HRValidator.bind(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!HRValidator.validateForm(form)) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (HRAuth.loginAdmin(data.email.trim(), data.password.trim()))
      location.href = "dashboard.html";
    else HRUtils.toast("Email atau password admin tidak sesuai.", "danger");
  });
});
