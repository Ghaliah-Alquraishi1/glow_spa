document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000, // animation duration in milliseconds
    once: true      // animation occurs only once
  });

  // Initialize Vanilla Tilt for 3D tilt effect
  VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2
  });





  // Music control for background audio
  const spaMusic = document.getElementById("spaMusic");
  const toggleBtn = document.getElementById("toggleMusic");
  const icon = toggleBtn?.querySelector("i");

  let isPlaying = false;

  toggleBtn?.addEventListener("click", () => {
    if (isPlaying) {
      spaMusic.pause();
      icon.classList.remove("fa-volume-up");
      icon.classList.add("fa-volume-mute");
    } else {
      spaMusic.play();
      icon.classList.remove("fa-volume-mute");
      icon.classList.add("fa-volume-up");
    }
    isPlaying = !isPlaying;
  });

  // Update the cart count in the header
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("glowCart")) || [];
    const cartCountEl = document.querySelector(".cart-count");
    cartCountEl.textContent = cart.length;
  }

  updateCartCount();

  // Show service details in the modal
  window.showDetails = function(title, desc, price) {
    currentService = { title, price: price.match(/\d+/)[0] };
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = desc;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('serviceModal').style.display = 'flex';
  };

  let currentService = {};

  // Add selected service to localStorage cart
  document.getElementById("addToCartFromModal")?.addEventListener("click", function () {
    let cart = JSON.parse(localStorage.getItem("glowCart")) || [];
    cart.push(currentService);
    localStorage.setItem("glowCart", JSON.stringify(cart));
    updateCartCount(); 
    alert("Service added to cart!");
  });

  // Set up elements for search, sort, and clearing filters
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const clearBtn = document.getElementById("clearFilters");
  const serviceSection = document.querySelector(".services-grid");

  // Filtering and sorting logic for service cards
  function filterAndSortCards() {
    const filter = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;
    const allCards = Array.from(serviceSection.querySelectorAll(".service-card"));

    // Filter services by title or description
    allCards.forEach(card => {
      const title = card.querySelector("h4").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();
      const match = title.includes(filter) || desc.includes(filter);
      card.style.display = match ? "flex" : "none";
    });

    const visibleCards = allCards.filter(card => card.style.display !== "none");

    // Sort services by name or price
    if (sortValue === "name-asc") {
      visibleCards.sort((a, b) =>
        a.querySelector("h4").textContent.localeCompare(b.querySelector("h4").textContent)
      );
    } else if (sortValue === "name-desc") {
      visibleCards.sort((a, b) =>
        b.querySelector("h4").textContent.localeCompare(a.querySelector("h4").textContent)
      );
    } else if (sortValue.includes("price")) {
      visibleCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector("button").getAttribute("onclick").match(/\$([\d.]+)/)[1]);
        const priceB = parseFloat(b.querySelector("button").getAttribute("onclick").match(/\$([\d.]+)/)[1]);
        return sortValue === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }

    // Re-append sorted cards to the DOM
    visibleCards.forEach(card => serviceSection.appendChild(card));
  }

  // Event listeners for live search, sorting, and clearing
  searchInput?.addEventListener("input", filterAndSortCards);
  sortSelect?.addEventListener("change", filterAndSortCards);
  clearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    sortSelect.value = "";
    filterAndSortCards();
  });
});
