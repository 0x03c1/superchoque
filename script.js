const pickupForm = document.getElementById("pickupForm");
const submitToast = document.getElementById("submitToast");
const themeToggle = document.getElementById("themeToggle");
const currentYear = document.getElementById("currentYear");
const COUNTER_ANIMATION_DURATION_MS = 1200;
const COUNTER_FRAME_RATE_MS = 16;

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const pickupDateInput = document.getElementById("data");
if (pickupDateInput) {
  const minPickupDate = new Date();
  minPickupDate.setHours(0, 0, 0, 0);
  minPickupDate.setDate(minPickupDate.getDate() + 1);
  pickupDateInput.min = minPickupDate.toISOString().split("T")[0];
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.innerHTML = '<i class="bi bi-sun-fill me-1"></i>Light Mode';
}

themeToggle?.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill me-1"></i>Dark Mode';
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill me-1"></i>Light Mode';
  }
});

pickupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const quantity = Number(document.getElementById("quantidade")?.value || 0);
  const dateValue = document.getElementById("data")?.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minPickupDate = new Date(today);
  minPickupDate.setDate(minPickupDate.getDate() + 1);
  let selectedDate = null;
  if (dateValue) {
    const [year, month, day] = dateValue.split("-").map(Number);
    if (year && month && day) {
      selectedDate = new Date(year, month - 1, day);
    }
  }

  let isValid = pickupForm.checkValidity();
  if (!quantity || quantity < 1) {
    isValid = false;
  }
  if (!selectedDate || selectedDate < minPickupDate) {
    isValid = false;
    pickupDateInput?.setCustomValidity("Selecione uma data a partir de amanhã.");
  } else {
    pickupDateInput?.setCustomValidity("");
  }

  pickupForm.classList.add("was-validated");
  if (!isValid) {
    return;
  }

  pickupForm.reset();
  pickupForm.classList.remove("was-validated");
  const toastInstance = bootstrap.Toast.getOrCreateInstance(submitToast);
  toastInstance.show();
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
revealElements.forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll(".counter");
const animateCounter = (counter) => {
  const target = Number(counter.getAttribute("data-target"));
  const totalFrames = Math.round(COUNTER_ANIMATION_DURATION_MS / COUNTER_FRAME_RATE_MS);
  let frame = 0;
  const start = 0;
  const countInterval = setInterval(() => {
    frame += 1;
    const progress = frame / totalFrames;
    const current = Math.round(start + target * progress);
    counter.textContent = current.toLocaleString("pt-BR");
    if (frame >= totalFrames) {
      clearInterval(countInterval);
      counter.textContent = target.toLocaleString("pt-BR");
    }
  }, COUNTER_FRAME_RATE_MS);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35 }
);

counters.forEach((counter) => counterObserver.observe(counter));
