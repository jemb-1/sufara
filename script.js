const registerDialog = document.querySelector("#registerDialog");
const profileDialog = document.querySelector("#profileDialog");
const registerForm = document.querySelector("#registerForm");
const locationSelect = document.querySelector("#locationSelect");
const toast = document.querySelector("#toast");

document.querySelectorAll("[data-open-register]").forEach((button) => {
  button.addEventListener("click", () => registerDialog.showModal());
});

document.querySelector("[data-close-dialog]").addEventListener("click", () => registerDialog.close());
document.querySelector("[data-close-profile]").addEventListener("click", () => profileDialog.close());

document.querySelectorAll("[data-open-location]").forEach((button) => {
  button.addEventListener("click", () => {
    locationSelect.value = button.dataset.openLocation;
    registerDialog.showModal();
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(registerForm).get("name");
  registerDialog.close();
  registerForm.reset();
  showToast(`Pendaftaran ${name} berhasil dikirim`);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

const locationCards = [...document.querySelectorAll(".location-card")];
const locationSearch = document.querySelector("#locationSearch");

function filterLocations(query) {
  const normalizedQuery = query.trim().toLowerCase();
  let matches = 0;

  locationCards.forEach((card) => {
    const visible = !normalizedQuery || card.dataset.locationName.toLowerCase().includes(normalizedQuery)
      || card.textContent.toLowerCase().includes(normalizedQuery);
    card.hidden = !visible;
    if (visible) matches += 1;
  });

  document.querySelector("#lokasi").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(matches ? `${matches} lokasi ditemukan` : "Lokasi belum ditemukan");
}

document.querySelector("#searchButton").addEventListener("click", () => {
  filterLocations(locationSearch.value);
});

locationSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") filterLocations(locationSearch.value);
});

document.querySelector("#showAllLocations").addEventListener("click", () => {
  locationSearch.value = "";
  locationCards.forEach((card) => { card.hidden = false; });
  showToast("Menampilkan semua lokasi");
});

document.querySelectorAll(".pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    selectLocation(pin.dataset.location);
  });
});

function selectLocation(name) {
  const card = locationCards.find((item) => item.dataset.locationName === name);
  if (!card) return;

  const pin = [...document.querySelectorAll(".pin")].find((item) => item.dataset.location === name);
  const image = card.querySelector(".location-media img");
  const address = card.querySelector(".location-body p").textContent;
  const schedule = card.querySelector(".schedule").textContent;

  document.querySelectorAll(".pin").forEach((item) => {
    const selected = item === pin;
    item.classList.toggle("selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });

  document.querySelector("#featuredImage").src = image.src;
  document.querySelector("#featuredImage").alt = name;
  document.querySelector("#featuredName").textContent = name;
  document.querySelector("#featuredAddress").textContent = `${address} · ${card.querySelector(".distance").textContent}`;
  document.querySelector("#featuredSchedule").textContent = schedule;
  document.querySelector("#featuredRegister").dataset.openLocation = name;
  document.querySelector("#featuredRegister").setAttribute("aria-label", `Daftar di ${name}`);
  locationSelect.value = name;
}

locationCards.forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute("role", "group");
  card.setAttribute("aria-label", `Tampilkan ${card.dataset.locationName} di peta`);
  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    selectLocation(card.dataset.locationName);
    document.querySelector(".hero-visual").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  card.addEventListener("keydown", (event) => {
    if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    selectLocation(card.dataset.locationName);
    document.querySelector(".hero-visual").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll("[data-profile]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.profile;
    const card = button.closest(".teacher-card");
    const image = card.querySelector("img").src;
    const specialty = card.querySelector(".teacher-info p").textContent;
    document.querySelector("#profileContent").innerHTML = `
      <div class="profile-content-head">
        <img src="${image}" alt="${name}">
        <div>
          <h2>${name}</h2>
          <p>${specialty}</p>
        </div>
      </div>
      <p class="profile-bio">Membimbing peserta untuk memahami ilmu agama dengan tenang, relevan, dan mudah diterapkan dalam kehidupan sehari-hari.</p>
      <div class="profile-meta">
        <div><span>Pengalaman</span><strong>12 tahun</strong></div>
        <div><span>Jadwal terdekat</span><strong>Hari ini, 19.30</strong></div>
      </div>
    `;
    profileDialog.showModal();
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    const filter = button.dataset.filter;
    document.querySelectorAll(".teacher-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.type !== filter;
    });
  });
});
