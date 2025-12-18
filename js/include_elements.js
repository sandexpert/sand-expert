

document.addEventListener('DOMContentLoaded', function () {
    // Load header-footer component
    if (document.querySelector('header')) {
        document.querySelector('header').innerHTML = `
            <div class="container nav-container">
                <a href="index.html" class="logo">SAND <img src="assets/logo-compass.webp" alt="logo" class="social-icon"> EXPERT</a>
                <button class="hamburger" aria-label="Toggle navigation">☰</button>
                <img src="assets/logo.webp" alt="logo" class="nav-logo">
                <nav class="nav-links">
                    <a href="index.html">Home</a>
                    <a href="destinations.html">Destinations</a>
                    <a href="upcoming.html">Upcoming Trips</a>
                    <a href="about.html">About us</a>
                </nav>
            </div>
        `;
    }
    if (document.querySelector('book-trip')) {
        document.querySelector('book-trip').innerHTML = `
        <div style="background: #e0f2f1; padding: 2rem; border-radius: 8px;mask-image: linear-gradient(to top, transparent 0%, black 10%);">
            <h2>Book now or get more information</h2>
            <p>Your message matters to us.</p>
            <p>Leave us a message and we will respond to you as soon as possible</p>
            <div class="cta-group">
                <a id="btn-whatsapp" href="https://wa.me/21652525252" target="_blank" class="btn btn-whatsapp">Contact via WhatsApp</a>
                <a id="btn-telegram" href="https://t.me/yourusername" target="_blank" class="btn btn-telegram">Contact via Telegram</a>
                <a id="btn-email" href="mailto:contact@sand.expert" target="_blank" class="btn btn-gmail">Contact via Email</a>
            </div>
        </div>
        `;
    }
    if (document.querySelector('footer')) {
        document.querySelector('footer').innerHTML = `
        <img src="assets/logo.webp" alt="logo" class="nav-logo" style="transform: rotateX(180deg) translateY(7rem) scaleX(-1); z-index: 0; max-height: -webkit-fill-available;">
        <div class="container footer-content">
            <div>
                <h3>SAND EXPERT</h3>
                <p>Making memories, one trip at a time.</p>
            </div>
            <div>
                <h4 style="margin-bottom: 1rem;">Contact :</h4>
                <ul>
                    <li>
                        <a href="https://wa.me/21652525252" target="_blank" style="display: flex; align-items: center;gap: 0.5rem;margin: 0.5rem 0;">
                            <img class="social-icon" src="assets/icons/whatsapp.svg" alt="whatsapp">
                            +21352525252
                        </a>
                    </li>
                    <li>
                        <a href="mailto:contact@sand.expert" target="_blank" style="display: flex; align-items: center;gap: 0.5rem;margin: 0.5rem 0;">
                            <img class="social-icon" src="assets/icons/gmail.svg" alt="email">
                            contact@sand.expert
                        </a>
                    </li>
                    <li>
                        <a href="https://t.me/yourusername" target="_blank" style="display: flex; align-items: center;gap: 0.5rem;margin: 0.5rem 0;">
                            <img class="social-icon" src="assets/icons/telegram.svg" alt="telegram">
                            +21352525252
                        </a>
                    </li>
                </ul>
            </div>
            <div class="social-links">
                <a href="#"><img class="social-icon" src="assets/icons/instagram.svg" alt="instagram"></a>
                <a href="#"><img class="social-icon" src="assets/icons/facebook.svg" alt="facebook"></a>
                <a href="#"><img class="social-icon" src="assets/icons/tiktok.svg" alt="tiktok"></a>
                <a href="#"><img class="social-icon" src="assets/icons/youtube.svg" alt="youtube"></a>
                <a href="#"><img class="social-icon" src="assets/icons/linkedin.svg" alt="linkedin"></a>
                <a href="#"><img class="social-icon" src="assets/icons/whatsapp.svg" alt="whatsapp"></a>
            </div>
        </div>
    </footer>
        `;
    }
});



// --- GALLERY FETCH ---
async function loadGallery() {
    const galleryContainer = document.getElementById('gallery-picturs');
    if (!galleryContainer) return;

    try {
        const res = await fetch('data/galleryData.json');
        if (!res.ok) throw new Error('Failed to load gallery');
        const images = await res.json();

        if (images.length === 0) {
            galleryContainer.innerHTML = ''; // Clear loading message
            // We still want to show the instagram link even if empty
        } else {
            galleryContainer.innerHTML = images.map(img => `
                <div class="card">
                    <img src="/${img.url}" alt="Gallery Image">
                </div>
            `).join('');
        }

        // Append "Last Gallery" Instagram Card
        const instagramCard = document.createElement('div');
        instagramCard.className = 'card gallery-card instagram-card';
        instagramCard.innerHTML = `
            <a href="https://instagram.com/yourusername" target="_blank" style="display:block; position:relative; height:100%;">
                <img src="/assets/last_gallery.webp" alt="More on Instagram" style="height:100%; object-fit:cover;">
                <div class="gallery-overlay">
                    <span>Click here To More</span>
                </div>
            </a>
        `;
        galleryContainer.appendChild(instagramCard);

    } catch (err) {
        console.error(err);
        galleryContainer.innerHTML = '<p>Error loading gallery.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    initGoogleTranslate();
});


// --- LANGUAGE SELECTOR (Custom UI) ---

function initGoogleTranslate() {
    // 1. Inject Google Translate Script
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    // 2. Define callback
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'ar,fr,it,es,en,de',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
    };

    // 3. Create Custom Floating UI
    createLanguageSelector();
}

function createLanguageSelector() {
    // Check for current language from cookie
    const currentLang = getCookie('googtrans') ? getCookie('googtrans').split('/')[2] : 'en';

    const wrapper = document.createElement('div');
    wrapper.id = 'custom-lang-selector';
    wrapper.innerHTML = `
        <div class="lang-toggle" onclick="toggleLangMenu()">
            <img src="assets/flags/${currentLang || 'en'}.webp" onerror="this.src='assets/icons/globe.webp'" alt="Lang" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
        </div>
        <div class="lang-menu" id="lang-menu">
            <button onclick="changeLanguage('en')">
                <img src="assets/flags/en.webp" alt="EN" width="20"> English
            </button>
            <button onclick="changeLanguage('ar')">
                <img src="assets/flags/ar.webp" alt="AR" width="20"> العربية
            </button>
            <button onclick="changeLanguage('fr')">
                <img src="assets/flags/fr.webp" alt="FR" width="20"> Français
            </button>
            <button onclick="changeLanguage('it')">
                <img src="assets/flags/it.webp" alt="IT" width="20"> Italiano
            </button>
            <button onclick="changeLanguage('es')">
                <img src="assets/flags/es.webp" alt="ES" width="20"> Español
            </button>
            <button onclick="changeLanguage('de')">
                <img src="assets/flags/de.webp" alt="DE" width="20"> Deutsch
            </button>
        </div>
        <div id="google_translate_element" style="display:none"></div>
    `;
    document.body.appendChild(wrapper);

    // Add CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-lang-selector {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: sans-serif;
        }
        .lang-toggle {
            width: 50px;
            height: 50px;
            background: white;
            color: #333;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            border: 2px solid #eee;
        }
        .lang-toggle:hover { transform: scale(1.1); }
        .lang-menu {
            display: none;
            position: absolute;
            bottom: 60px;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            overflow: hidden;
            flex-direction: column;
            width: 160px;
        }
        .lang-menu.show { display: flex; }
        .lang-menu button {
            background: none;
            border: none;
            padding: 10px 15px;
            text-align: left;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        }
        .lang-menu button:hover { background: #f0f0f0; }
        .lang-menu button:last-child { border-bottom: none; }

        /* HIDE GOOGLE TRANSLATE TOOLBAR AND TOOLTIP */
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
        } 
        body {
            top: 0px !important; 
        }
        #goog-gt-tt, .goog-te-balloon-frame {
            display: none !important;
        }
        .goog-text-highlight {
            background: none !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);

    // Force remove the banner logic aggressively
    const removeGoogleBanner = () => {
        const banners = document.querySelectorAll('.goog-te-banner-frame');
        banners.forEach(banner => {
            banner.style.display = 'none';
            banner.remove(); // Nuclear option
        });

        if (document.body.style.top !== '0px') {
            document.body.style.top = '0px';
        }
    };

    // Run immediately and on intervals
    removeGoogleBanner();
    setInterval(removeGoogleBanner, 500); // Check every 500ms
}

window.toggleLangMenu = () => {
    const menu = document.getElementById('lang-menu');
    menu.classList.toggle('show');
};

window.changeLanguage = (langCode) => {
    // 1. Set Cookie
    // Google Translate expects /auto/target or /source/target
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`; // Fallback

    // 2. Reload Page to apply
    window.location.reload();
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

