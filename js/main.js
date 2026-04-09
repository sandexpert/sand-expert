// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      document.addEventListener("click", (e) => {
        if (
          !e.target.closest(".nav-links") &&
          !e.target.closest(".hamburger")
        ) {
          navLinks.classList.remove("active");
        }
      });
    });
  }

  // 2. Fetch and Render Data
  fetchData();

  async function fetchData() {
    try {
      // 1. جلب "الفهارس" فقط لعرض البطاقات (Cards) في الصفحة الرئيسية
      // هذه الملفات تحتوي على مصفوفة بسيطة [ {id, title, image}, ... ]
      const tripsRes = await fetch("data/upcomingTrips_index.json");
      const tripsSummary = await tripsRes.json();

      const destRes = await fetch("data/destinations_index.json");
      const destinationsSummary = await destRes.json();

      // عرض البطاقات (تستخدم البيانات المختصرة من الفهرس)
      const tripsContainer = document.getElementById("upcoming-trips-list");
      if (tripsContainer) {
        renderTripsCard(tripsSummary, tripsContainer);
      }

      const destinationsContainer =
        document.getElementById("destinations-list");
      if (destinationsContainer) {
        renderdestinationsCard(destinationsSummary, destinationsContainer);
      }

      // 2. معالجة صفحات التفاصيل (ستقوم هي بجلب الملف الكامل بناءً على الـ ID)
      await handleDetailsPages();

      setupSliders();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function handleDetailsPages() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    // --- قسم تفاصيل الرحلات ---
    const tripDetailsContainer = document.getElementById(
      "trip-details-container",
    );
    if (tripDetailsContainer) {
      try {
        // جلب ملف JSON الخاص بهذه الرحلة فقط
        const res = await fetch(`data/upcomingTrips/${id}.json`);
        if (!res.ok) throw new Error("Trip not found");
        const trip = await res.json();

        tripDetailsContainer.innerHTML = `
                <div class="herox">
                    <img id="t-image" src="${trip.image}" alt="Trip Image">
                </div>
                <div class="container trip-info">
                    <h1 id="t-title" style="font-size: 1.5rem; margin-bottom: 1rem; text-align: center;">${trip.title}</h1>
                    <div class="trip-meta-grid">
                            <div><strong>📅 Date:</strong> <span id="t-date">${formatDate(trip.date)}</span></div>
                            <div><strong>⏳ Duration:</strong> <span id="t-duration">${trip.duration} day</span></div>
                            <div><strong>🗺️ Route:</strong> <span id="t-route">${trip.route.join(" → ")}</span></div>
                            <div><strong>Price/Day:</strong> <span id="t-price">$${trip.pricePerDay}</span></div>
                            <div><strong>Total Price:</strong> <span id="t-total-price">$${trip.pricePerDay * trip.duration}</span></div>
                        </div>
                        <div class="ql-snow">
                            <div class="ql-editor"> 
                                ${trip.description}
                            </div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 1rem var(--spacing);">
                        <div>
                        ${
                          trip.inclusions && trip.inclusions.length > 0
                            ? `   
                            <h3>Included</h3>
                            <ul id="t-inclusions" style="line-height: 2;">${trip.inclusions.map((i) => `<li>✅ ${i}</li>`).join("")}</ul>`
                            : ""
                        }
                        </div>
                        <div>
                            ${
                              trip.excludes && trip.excludes.length > 0
                                ? `
                                <h3>Excluded</h3>
                                <ul id="t-excludes" style="line-height: 2;">${trip.excludes.map((i) => `<li>❌ ${i}</li>`).join("")}</ul>`
                                : ""
                            }

                        </div>
                        <div>
                                                ${
                          trip.itinerary && trip.itinerary.length > 0
                            ? ` 
                            <h3>Itinerary</h3>
                            <ul id="t-itinerary" style="list-style: none; padding: 0; line-height: 2;">
                            ${trip.itinerary
                              .map((item, index) => {
                                // الوصول إلى القيمة داخل الكائن باستخدام المفتاح itineraryDays
                                // نضع "" كقيمة افتراضية في حال كان الحقل فارغاً
                                const content = item.itineraryDays || ""; 
                                
                                return `
                                <li style="margin-bottom: 0.5rem;">
                                    <strong>Day ${index + 1}:</strong> ${content}
                                </li>`;
                              })
                              .join("")}
                            </ul>`
                            : ""
                        }
                        </div>
                    </div>
                </div>
            `;
        document.title = trip.title + " - Trip Details";
      } catch (e) {
        tripDetailsContainer.innerHTML = "<p>Trip not found.</p>";
      }
    }

    // --- قسم تفاصيل الوجهات ---
    const destinationDetailsContainer = document.getElementById(
      "destination-article-container",
    );
    if (destinationDetailsContainer) {
      try {
        // جلب ملف JSON الخاص بهذه الوجهة فقط
        const res = await fetch(`data/destinations/${id}.json`);
        if (!res.ok) throw new Error("Destination not found");
        const destination = await res.json();

        destinationDetailsContainer.innerHTML = `
                    <div class="herox">
                        <img id="d-image" src="${destination.image}" alt="Destination Image">
                    </div>
                    <div class="container destination-info" style="padding:0">
                        <h1 id="d-title" style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">${destination.title}</h1>
                        <div class="destination-meta-grid">
                    </div>
                    <div class="ql-snow">
                        <div class="ql-editor">
                            ${destination.article} 
                        </div>
                    </div>
                `;
        // change page title
        document.title = destination.title + " - Destination Article";
      } catch (e) {
        destinationDetailsContainer.innerHTML = "<p>Destination not found.</p>";
      }
    }
  }
});

function renderdestinationsCard(destinations, container) {
  container.innerHTML = destinations
    .map(
      (destination) => `
        <div class="card" onclick="window.location.href='destination-article.html?id=${destination.id}'">
            <img src="${destination.image}" alt="${destination.title}" loading="lazy">
            <div class="card-content">
                <h3>${destination.title}</h3>
                <p>Explore the beauty and culture of ${destination.title}.</p>
                <a href="destination-article.html?id=${destination.id}" class="btn" style="margin-top:1rem;">Explore Trips</a>
            </div>
        </div>
    `,
    )
    .join("");
}

function renderTripsCard(trips, container) {
  container.innerHTML = trips
    .map(
      (trip) => `
        <div class="card" onclick="window.location.href='trip-details.html?id=${trip.id}'">
            <img src="${trip.image}" alt="${trip.title}" loading="lazy">
            <div class="card-content">
                <h3>${trip.title}</h3>
                <div class="card-meta">
                    <span>📅 ${formatDate(trip.date)}</span><br>
                </div>
                <div class="card-price">$${trip.pricePerDay} / day</div>
                <div class="btn" style="margin-top:1rem; text-align:center;">View Details</div>
            </div>
            </div>
    `,
    )
    .join("");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function setupSliders() {
  const sliders = document.querySelectorAll(".destinations-slider");

  // 1. Drag-to-Scroll Functionality (Apply to ALL sliders)
  sliders.forEach((slider) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.style.cursor = "grabbing";
      slider.style.scrollSnapType = "none";
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    const stopDragging = () => {
      if (!isDown) return;
      isDown = false;
      slider.style.cursor = "grab";
      slider.style.removeProperty("scroll-snap-type");
    };

    slider.addEventListener("mouseleave", stopDragging);
    slider.addEventListener("mouseup", stopDragging);

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.style.cursor = "grab";
  });

  // 2. Auto-scroll (Apply ONLY to the FIRST slider)
  if (sliders.length > 0) {
    const firstSlider = sliders[0];

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slider = entry.target;

          // Stop observing immediately to save resources
          obs.unobserve(slider);

          // Check if not already scrolled (user interaction)
          if (slider.scrollLeft > 50) return;

          const firstCard = slider.querySelector(".card");
          if (firstCard) {
            const cardWidth = firstCard.offsetWidth;
            slider.scrollBy({
              left: cardWidth + 16, // approx one card + gap
              behavior: "smooth",
            });
          }
        }
      });
    }, observerOptions);

    observer.observe(firstSlider);
  }
}
