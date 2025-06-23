// --- RoastMeLOL Main JS ---

// Helper: Animate element with a class, then remove it
function animateCSS(element, animation, duration = 700) {
  element.classList.add(animation);
  setTimeout(() => element.classList.remove(animation), duration);
}

// Navigation buttons
const navRandom = document.getElementById('nav-random');
const navCustom = document.getElementById('nav-custom');
const sectionRandom = document.getElementById('random-roast');
const sectionCustom = document.getElementById('custom-roast');

navRandom.onclick = () => {
  sectionRandom.classList.remove('d-none');
  sectionCustom.classList.add('d-none');
  animateCSS(sectionRandom, 'animate-fadeIn');
};

navCustom.onclick = () => {
  sectionCustom.classList.remove('d-none');
  sectionRandom.classList.add('d-none');
  animateCSS(sectionCustom, 'animate-fadeIn');
};

// Load roasts from JSON
let roasts = [];
fetch('roasts.json') // Make sure the path is correct
  .then(res => res.json())
  .then(data => { roasts = data; })
  .catch(err => console.error('Failed to load roasts.json:', err));

// Funny GIFs
const funnyGifs = [
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
  "https://media.giphy.com/media/3o6Zt8zb1Pp2v3bF7e/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif"
];

// Random Roast Elements
const scanBtn = document.getElementById('scan-btn');
const roastResult = document.getElementById('roast-result');
const roastGif = document.getElementById('roast-gif');
const roastText = document.getElementById('roast-text');
const shareRandom = document.getElementById('share-random');
const downloadRandom = document.getElementById('download-random');

// Scan button logic
scanBtn.onclick = () => {
  if (!roasts.length) return;
  const idx = Math.floor(Math.random() * roasts.length);
  const roast = roasts[idx];

  roastGif.innerHTML = `<img src="${roast.gif}" alt="roast gif" class="rounded img-fluid mx-auto shadow mb-3" />`;
  roastText.textContent = roast.text;

  roastResult.classList.remove('d-none');
  roastResult.classList.add('d-flex');
  animateCSS(roastResult, 'animate-bounce');
};

// Custom Roast Elements
const customInput = document.getElementById('custom-input');
const gifGallery = document.getElementById('gif-gallery');
const generateBtn = document.getElementById('generate-btn');
const customResult = document.getElementById('custom-result');
const customGif = document.getElementById('custom-gif');
const customText = document.getElementById('custom-text');
const shareCustom = document.getElementById('share-custom');
const downloadCustom = document.getElementById('download-custom');

let selectedGif = funnyGifs[0];

// Render GIF Picker
function renderGifGallery() {
  gifGallery.innerHTML = '';
  funnyGifs.forEach((gif) => {
    const img = document.createElement('img');
    img.src = gif;
    img.alt = 'funny gif';
    img.className = `img-thumbnail m-1 ${selectedGif === gif ? 'border-4 border-primary' : ''}`;
    img.style.cursor = 'pointer';
    img.onclick = () => {
      selectedGif = gif;
      renderGifGallery();
    };
    gifGallery.appendChild(img);
  });
}
renderGifGallery();

// Custom Generate Button
generateBtn.onclick = () => {
  const text = customInput.value.trim();
  if (!text) {
    customInput.classList.add('is-invalid');
    setTimeout(() => customInput.classList.remove('is-invalid'), 800);
    return;
  }

  customGif.innerHTML = `<img src="${selectedGif}" alt="custom gif" class="rounded img-fluid mx-auto shadow mb-3" />`;
  customText.textContent = text;

  customResult.classList.remove('d-none');
  customResult.classList.add('d-flex');
  animateCSS(customResult, 'animate-bounce');
};

// Share & Download Logic
function shareSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!window.html2canvas) {
    alert('Sharing not supported.');
    return;
  }

  html2canvas(section, { backgroundColor: null }).then(canvas => {
    const imageData = canvas.toDataURL('image/png');
    const fileName = 'roastmelol.png';
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("🔥 Check out my roast on RoastMeLOL!");

    canvas.toBlob(blob => {
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'RoastMeLOL',
          text: 'Get roasted at RoastMeLOL!',
          url: window.location.href
        }).catch(err => console.warn('Share failed:', err));
      } else {
        // Fallback modal
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style="z-index: 1055;">
            <div class="bg-white p-4 rounded shadow text-center" style="max-width: 400px;">
              <h5 class="mb-3">Share Roast</h5>
              <img src="${imageData}" alt="roast" class="img-fluid rounded mb-3"/>
              <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" class="btn btn-primary">Facebook</a>
                <a href="https://api.whatsapp.com/send?text=${shareText}%20${pageUrl}" target="_blank" class="btn btn-success">WhatsApp</a>
                <a href="https://www.messenger.com/share?link=${pageUrl}" target="_blank" class="btn btn-info">Messenger</a>
                <a href="mailto:?subject=RoastMeLOL&body=${shareText}%20${pageUrl}" class="btn btn-dark">Email</a>
                <button class="btn btn-secondary" id="download-img">Download</button>
              </div>
              <button class="btn btn-outline-secondary" id="close-share">Close</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        // Download button in modal
        document.getElementById('download-img').onclick = () => {
          const link = document.createElement('a');
          link.href = imageData;
          link.download = fileName;
          link.click();
        };

        // Close modal
        document.getElementById('close-share').onclick = () => {
          modal.remove();
        };
      }
    });
  });
}

function downloadSectionAsImage(sectionId, filename = 'roastmelol.png') {
  const section = document.getElementById(sectionId);
  html2canvas(section, { backgroundColor: null }).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = filename;
    link.click();
  });
}

// Attach events
shareRandom.onclick = () => shareSection('roast-result');
shareCustom.onclick = () => shareSection('custom-result');
downloadRandom.onclick = () => downloadSectionAsImage('roast-result', 'random-roast.png');
downloadCustom.onclick = () => downloadSectionAsImage('custom-result', 'custom-roast.png');

// --- End of Main JS ---
