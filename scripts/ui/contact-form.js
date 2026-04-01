(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const setError = (element, message) => {
  if (!element) return;
  element.textContent = message;
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const initContactForm = ({ formSelector, nameSelector, emailSelector, messageSelector, recipient }) => {
  const form = document.querySelector(formSelector);
  const nameInput = document.querySelector(nameSelector);
  const emailInput = document.querySelector(emailSelector);
  const messageInput = document.querySelector(messageSelector);

  const errName = document.getElementById("error-name");
  const errEmail = document.getElementById("error-email");
  const errMessage = document.getElementById("error-message");

  if (!form || !nameInput || !emailInput || !messageInput) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = String(nameInput.value || "").trim();
    const email = String(emailInput.value || "").trim();
    const message = String(messageInput.value || "").trim();

    let ok = true;

    setError(errName, "");
    setError(errEmail, "");
    setError(errMessage, "");

    if (name.length < 2) {
      ok = false;
      setError(errName, "Please enter your name.");
    }

    if (!isEmail(email)) {
      ok = false;
      setError(errEmail, "Please enter a valid email address.");
    }

    if (message.length < 10) {
      ok = false;
      setError(errMessage, "Please enter a message (at least 10 characters).");
    }

    if (!ok) return;

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
};

window.PortfolioApp.ui.initContactForm = initContactForm;
})();