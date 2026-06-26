const SESSION_KEY = "hr_session";
const IDLE_LIMIT_MS = 30 * 60 * 1000;

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function setSession(session) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...session,
      last_active: Date.now(),
    }),
  );
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function touchSession() {
  const session = getSession();

  if (session) {
    session.last_active = Date.now();
    setSession(session);
  }
}

function sessionExpired() {
  const session = getSession();

  return (
    !session || Date.now() - Number(session.last_active || 0) > IDLE_LIMIT_MS
  );
}

function loginAdmin(email, password) {
  const user = HRStorage.all("user_admin").find(
    (item) =>
      item.email === email &&
      item.password === password &&
      item.status === "Aktif",
  );

  if (!user) {
    return false;
  }

  HRStorage.update("user_admin", user.id, {
    last_login: new Date().toISOString(),
  });

  setSession({
    type: "admin",
    user_id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
  });

  return true;
}

function loginEmployee(email, password) {
  const employee = HRStorage.all("karyawan").find(
    (item) =>
      item.email === email &&
      (item.password || "123456") === password &&
      item.status === "Aktif",
  );

  if (!employee) {
    return false;
  }

  setSession({
    type: "employee",
    user_id: employee.id,
    nama: employee.nama_lengkap,
    email: employee.email,
    role: "Karyawan",
  });

  return true;
}

function buildRelativePath(targetPath) {
  const segments = location.pathname.split("/").filter(Boolean);
  const fileName = segments.at(-1) || "";
  const isHtmlFile = fileName.includes(".");
  const currentDirDepth = isHtmlFile ? segments.length - 1 : segments.length;
  const appRootDepth = Math.max(0, currentDirDepth - 1);
  const prefix = "../".repeat(appRootDepth);

  return prefix + targetPath.replace(/^\//, "");
}

function requireAuth(type) {
  const session = getSession();

  if (!session || sessionExpired() || (type && session.type !== type)) {
    clearSession();

    const fallback =
      type === "employee" ? "/hr-pem-web-1/employee/login.html" : "/hr-pem-web-1/login.html";

    location.href = fallback;

    return null;
  }

  touchSession();
  return session;
}

function logout() {
  const loginPath = location.pathname.includes("/employee/")
    ? "/hr-pem-web-1/employee/login.html"
    : "/hr-pem-web-1/login.html";

  clearSession();

  location.href = loginPath;
}

["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(
  (eventName) => {
    document.addEventListener(eventName, touchSession, {
      passive: true,
    });
  },
);

setInterval(() => {
  if (getSession() && sessionExpired()) {
    clearSession();
    location.reload();
  }
}, 60000);

window.HRAuth = {
  getSession,
  setSession,
  clearSession,
  loginAdmin,
  loginEmployee,
  requireAuth,
  logout,
  touchSession,
};
