const HRValidator = (() => {
  const messages = {
    required: (label) => `${label} wajib diisi.`,
    email: (label) => `${label} harus berupa email valid.`,
    min: (label, n) => `${label} minimal ${n} karakter.`,
    max: (label, n) => `${label} maksimal ${n} karakter.`,
    numeric: (label) => `${label} harus berupa angka.`,
    between: (label, a, b) => `${label} harus di antara ${a} sampai ${b}.`,
    date: (label) => `${label} harus berupa tanggal valid.`,
  };
  function parseRules(input) {
    return (input.dataset.validate || "")
      .split("|")
      .filter(Boolean)
      .map((rule) => {
        const [name, args] = rule.split(":");
        return { name, args: args ? args.split(",") : [] };
      });
  }
  function labelOf(input) {
    return (
      input.dataset.label ||
      input
        .closest(".mb-3,.col-md-6,.col-md-4,.col-md-3")
        ?.querySelector("label")
        ?.textContent?.replace("*", "")
        .trim() ||
      input.name ||
      "Field"
    );
  }
  function validateInput(input) {
    const val = (input.value || "").trim();
    const label = labelOf(input);
    let error = "";
    for (const rule of parseRules(input)) {
      if (rule.name === "required" && !val) {
        error = messages.required(label);
        break;
      }
      if (
        rule.name === "email" &&
        val &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ) {
        error = messages.email(label);
        break;
      }
      if (rule.name === "min" && val.length < Number(rule.args[0])) {
        error = messages.min(label, rule.args[0]);
        break;
      }
      if (rule.name === "max" && val.length > Number(rule.args[0])) {
        error = messages.max(label, rule.args[0]);
        break;
      }
      if (rule.name === "numeric" && val && Number.isNaN(Number(val))) {
        error = messages.numeric(label);
        break;
      }
      if (rule.name === "between" && val) {
        const n = Number(val),
          a = Number(rule.args[0]),
          b = Number(rule.args[1]);
        if (Number.isNaN(n) || n < a || n > b) {
          error = messages.between(label, a, b);
          break;
        }
      }
      if (rule.name === "date" && val && Number.isNaN(Date.parse(val))) {
        error = messages.date(label);
        break;
      }
    }
    renderError(input, error);
    return !error;
  }
  function renderError(input, error) {
    input.classList.toggle("is-invalid", !!error);
    input.classList.toggle(
      "is-valid",
      !error && !!(input.dataset.validate || "") && !!input.value,
    );
    let feedback = input.parentElement.querySelector(
      ".invalid-feedback.hr-feedback",
    );
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "invalid-feedback hr-feedback";
      input.parentElement.appendChild(feedback);
    }
    feedback.textContent = error;
  }
  function validateForm(form) {
    const fields = [...form.querySelectorAll("[data-validate]")];
    const results = fields.map(validateInput);
    const invalid = fields.filter((_, i) => !results[i]).map(labelOf);
    const summary = form.querySelector(".validation-summary");
    if (summary) {
      if (invalid.length) {
        summary.innerHTML = `<strong>Form belum valid.</strong><br>Periksa field: ${invalid.join(", ")}.`;
        summary.classList.add("show");
      } else {
        summary.classList.remove("show");
        summary.innerHTML = "";
      }
    }
    return results.every(Boolean);
  }
  function bind(form) {
    form.querySelectorAll("[data-validate]").forEach((input) => {
      input.addEventListener("blur", () => validateInput(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) validateInput(input);
      });
    });
  }
  return { validateForm, validateInput, bind };
})();
window.HRValidator = HRValidator;
