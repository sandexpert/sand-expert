// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // 2. Fetch and Render Data
    fetchData();

    async function fetchData() {
        try {
            // Fetch Incoming Trips (STATIC DATA)
            const tripsRes = await fetch('data/upcomingTripsData.json');
            const tripsData = await tripsRes.json();

            // Fetch Destinations (STATIC DATA)
            const destRes = await fetch('data/destinationsData.json');
            const destinationsData = await destRes.json();

            // Render components
            const tripsContainer = document.getElementById('upcoming-trips-list');
            if (tripsContainer) {
                renderTripsCard(tripsData, tripsContainer);
            }

            const destinationsContainer = document.getElementById('destinations-list');
            if (destinationsContainer) {
                renderdestinationsCard(destinationsData, destinationsContainer);
            }

            // Handle Details Pages
            handleDetailsPages(tripsData, destinationsData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function handleDetailsPages(tripsData, destinationsData) {
        // 3. Render Trip Details
        const tripDetailsContainer = document.getElementById('trip-details-container');
        if (tripDetailsContainer) {
            const params = new URLSearchParams(window.location.search);
            const tripId = params.get('id');
            const trip = tripsData.find(t => t.id == tripId);
            if (trip) {

                tripDetailsContainer.innerHTML = `
                <div class="herox">
                    <img id="t-image" src="${trip.image}" alt="Trip Image">
                </div>
                <div class="container trip-info">
                    <h1 id="t-title" style="font-size: 1.5rem; margin-bottom: 1rem; text-align: center;">${trip.title}</h1>
                    <div class="trip-meta-grid">
                            <div><strong>📅 Date:</strong> <span id="t-date">${formatDate(trip.date)}</span></div>
                            <div><strong>⏳ Duration:</strong> <span id="t-duration">${trip.duration} day</span></div>
                            <div><strong>🗺️ Route:</strong> <span id="t-route">${trip.route.join(' → ')}</span></div>
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
                        ${(trip.inclusions && trip.inclusions.length > 0) ? `   
                            <h3>Included</h3>
                            <ul id="t-inclusions" style="line-height: 2;">${trip.inclusions.map(i => `<li>✅ ${i}</li>`).join('')}</ul>` : ''}
                        </div>
                        <div>
                            ${(trip.excludes && trip.excludes.length > 0) ? `
                                <h3>Excluded</h3>
                                <ul id="t-excludes" style="line-height: 2;">${trip.excludes.map(i => `<li>❌ ${i}</li>`).join('')}</ul>` : ''}

                        </div>
                        <div>
                        ${(trip.itinerary && trip.itinerary.length > 0) ? `   
                            <h3>Itinerary</h3>
                            <ul id="t-itinerary" style="list-style: none; padding: 0; line-height: 2;">${trip.itinerary.map((item, index) => {
                    let content = '';
                    if (Array.isArray(item)) {
                        content = item.map(act => `<span class="itinerary-tag">${act}</span>`).join(' ');
                    } else {
                        content = item;
                    }
                    return `
                                <li style="margin-bottom: 0.5rem;">
                                    <strong>Day ${index + 1}:</strong> ${content}
                                </li>`;
                }).join('')}</ul>` : ''}
                        </div>
                    </div>
                </div>
            `;
                // change page title
                document.title = trip.title + " - Trip Details";
            } else {
                tripDetailsContainer.innerHTML = '<p class="container">Trip not found.</p>';
            }
        }

        // 4. Render Destination Details
        const destinationDetailsContainer = document.getElementById('destination-article-container');
        if (destinationDetailsContainer) {
            const params = new URLSearchParams(window.location.search);
            const destinationId = params.get('id');
            const destination = destinationsData.find(d => d.id == destinationId);
            if (destination) {
                // const relatedTrips = tripsData.filter(t => t.id.startsWith(destination.id));
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
            } else {
                destinationDetailsContainer.innerHTML = '<p class="container">Destination not found.</p>';
            }
        }
    }

});

function renderdestinationsCard(destinations, container) {
    container.innerHTML = destinations.map(destination => `
        <article class="card">
            <img src="${destination.image}" alt="${destination.title}" loading="lazy">
            <div class="card-content">
                <h3>${destination.title}</h3>
                <p>Explore the beauty and culture of ${destination.title}.</p>
                <a href="destination-article.html?id=${destination.id}" class="btn" style="margin-top:1rem;">Explore Trips</a>
            </div>
        </article>
    `).join('');
}

function renderTripsCard(trips, container) {
    container.innerHTML = trips.map(trip => `
        <article class="card">
            <img src="${trip.image}" alt="${trip.title}" loading="lazy">
            <div class="card-content">
                <h3>${trip.title}</h3>
                <div class="card-meta">
                    <span>📅 ${formatDate(trip.date)}</span><br>
                </div>
                <div class="card-price">$${trip.pricePerDay} / day</div>
                <a href="trip-details.html?id=${trip.id}" class="btn" style="margin-top:1rem; text-align:center;">View Details</a>
            </div>
        </article>
    `).join('');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
