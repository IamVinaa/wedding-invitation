
/*
  QUICK CUSTOMIZATION:
  1) Change the names, date, venue and map query below.
  2) Add your photos to the assets folder.
  3) Add assets/wedding-song.mp3.
  4) Upload your ABA QR image using the QR section's upload link.
*/

const WEDDING = {
    bride: "Bride Name",
    groom: "Groom Name",

    // Cambodia local time (UTC+7)
    date: "2026-12-20T17:00:00+07:00",

    venue: "Your Wedding Venue",
    address: "Add your full venue address, Siem Reap, Cambodia",
    time: "Ceremony begins at 5:00 PM",
    mapQuery: "Angkor Wat, Siem Reap, Cambodia"
};


// ========================================
// HELPER
// ========================================

const $ = (id) => document.getElementById(id);

const weddingDate = new Date(WEDDING.date);


// ========================================
// GET HTML ELEMENTS
// ========================================

const openButton = $("openInvitation");
const envelope = $("envelope");
const envelopeScreen = $("envelopeScreen");

const audio = $("weddingMusic");
const musicButton = $("musicButton");


// ========================================
// WEDDING DETAILS
// ========================================

function setWeddingDetails() {

    $("brideName").textContent = WEDDING.bride;
    $("groomName").textContent = WEDDING.groom;

    $("letterNames").textContent =
        `${WEDDING.bride} & ${WEDDING.groom}`;

    $("footerNames").textContent =
        `${WEDDING.bride} & ${WEDDING.groom}`;

    $("venueName").textContent = WEDDING.venue;
    $("venueAddress").textContent = WEDDING.address;

    $("venueDate").textContent =
        weddingDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    $("venueTime").textContent = WEDDING.time;

    $("weddingDateText").textContent =
        weddingDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).replaceAll("/", " · ");

    $("heroDate").textContent =
        weddingDate.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    // Google Maps
    const mapUrl =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WEDDING.mapQuery)}`;

    $("mapLink").href = mapUrl;

    $("mapFrame").src =
        `https://www.google.com/maps?q=${encodeURIComponent(WEDDING.mapQuery)}&output=embed`;
}


// ========================================
// COUNTDOWN
// ========================================

function updateCountdown() {

    let diff = Math.max(
        0,
        weddingDate.getTime() - Date.now()
    );

    const days = Math.floor(diff / 86400000);
    diff %= 86400000;

    const hours = Math.floor(diff / 3600000);
    diff %= 3600000;

    const minutes = Math.floor(diff / 60000);
    diff %= 60000;

    const seconds = Math.floor(diff / 1000);

    $("days").textContent = String(days).padStart(3, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
}


// ========================================
// ENVELOPE OPENING + AUTO MUSIC
// ========================================

// Prevent browser from restoring an old scroll position
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

// Lock scrolling when invitation loads
document.documentElement.classList.add("envelope-locked");
document.body.classList.add("envelope-locked");

window.scrollTo(0, 0);


// Update music button appearance
function updateMusicButton() {

    if (!musicButton || !audio) return;

    if (audio.paused) {
        musicButton.classList.remove("playing");
        musicButton.textContent = "♫";
    } else {
        musicButton.classList.add("playing");
        musicButton.textContent = "Ⅱ";
    }
}


// Open invitation
if (openButton && envelope && envelopeScreen) {

    openButton.addEventListener("click", function () {

        if (openButton.disabled) return;

        openButton.disabled = true;

        // Automatically play music when Open Invitation is clicked
        if (audio) {

            audio.currentTime = 0;

            audio.play()
                .then(() => {
                    updateMusicButton();
                })
                .catch(error => {
                    console.error("Music playback failed:", error);
                });
        }

        // Start envelope opening animation
        envelope.classList.add("open");

        // Keep envelope visible for 3 seconds
        setTimeout(function () {

            envelopeScreen.classList.add("hidden");

            // Wait for fade-out animation
            setTimeout(function () {

                // Unlock normal page scrolling
                document.documentElement.classList.remove("envelope-locked");
                document.body.classList.remove("envelope-locked");

                // Start page at the top
                window.scrollTo(0, 0);

            }, 1300);

        }, 3000);

    });
}


// ========================================
// MUSIC BUTTON: PAUSE / RESUME
// ========================================

if (audio && musicButton) {

    audio.loop = true;

    musicButton.addEventListener("click", async function () {

        if (audio.paused) {

            try {
                await audio.play();
                updateMusicButton();

            } catch (error) {
                console.error("Music playback failed:", error);
            }

        } else {

            audio.pause();
            updateMusicButton();
        }
    });
}


// Keep button icon synchronized with audio
if (audio) {
    audio.addEventListener("play", updateMusicButton);
    audio.addEventListener("pause", updateMusicButton);
    audio.addEventListener("ended", updateMusicButton);
}


// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            }
        });

    },
    {
        threshold: 0.12
    }
);

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});


// ========================================
// MUSIC UPLOAD
// ========================================

const musicUpload = $("musicUpload");

if (musicUpload && audio) {

    musicUpload.addEventListener("change", async function (event) {

        const file = event.target.files[0];

        if (!file) return;

        audio.src = URL.createObjectURL(file);
        audio.currentTime = 0;

        try {
            await audio.play();
            updateMusicButton();

        } catch (error) {
            console.error("Uploaded music could not play:", error);
        }
    });
}


// ========================================
// ABA QR CODE IMAGE PREVIEW
// ========================================

const qrUpload = $("qrUpload");
const qrPreview = $("qrPreview");

if (qrUpload && qrPreview) {

    qrUpload.addEventListener("change", function (event) {

        const file = event.target.files[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        qrPreview.innerHTML = "";

        const img = document.createElement("img");

        img.src = imageUrl;
        img.alt = "ABA Pay QR code";

        qrPreview.appendChild(img);
    });
}


// ========================================
// INITIALIZE WEBSITE
// ========================================

setWeddingDetails();

updateCountdown();

setInterval(updateCountdown, 1000);
