let isMirrored = false;
let video = document.getElementById('video');
let photoPreview = document.getElementById('photo-preview');
let selectedFilter = '';
let photoCount = 3;
let takenPhotos = [];

// Ganti jumlah foto
document.getElementById('photo-count').addEventListener('change', function () {
  photoCount = parseInt(this.value);
  takenPhotos = [];
  photoPreview.innerHTML = '';
  document.getElementById('info').textContent = '';
});

// Nyalakan kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Kamera tidak bisa diakses:', err);
    document.getElementById('info').textContent = 'Kamera tidak bisa diakses!';
  });

// Ambil satu foto
function takePhoto() {
  if (takenPhotos.length >= photoCount) {
    document.getElementById('info').textContent = `Kamu sudah ambil ${photoCount} foto. Klik tombol Next buat lanjut.`;
    return;
  }
  const flash = document.getElementById('flash');
  flash.style.opacity = 1;
  setTimeout(() => {
    flash.style.opacity = 0;
  }, 100);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 300;

  if (isMirrored) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  switch (selectedFilter) {
    case 'fresh':
      context.filter = 'brightness(1.1) contrast(1.2) saturate(1.3)';
      break;
    case 'vintage':
      context.filter = 'sepia(0.5) contrast(1.1)';
      break;
    case 'bw':
      context.filter = 'grayscale(1) contrast(1.1)';
      break;
    case 'warm':
      context.filter = 'sepia(0.3) saturate(1.4) brightness(1.1)';
      break;
    case 'dreamy':
      context.filter = 'blur(1px) brightness(1.3) contrast(0.9)';
      break;
    case 'aesthetic':
      context.filter = 'sepia(0.2) brightness(1.1) contrast(1.3) saturate(1.6)';
      break;
    default:
      context.filter = 'none';
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const photo = new Image();
  photo.src = canvas.toDataURL('image/png');
  photoPreview.appendChild(photo);
  takenPhotos.push(photo.src);

  if (takenPhotos.length === photoCount) {
    localStorage.setItem('photos', JSON.stringify(takenPhotos));
    document.getElementById('info').textContent = `Selesai! Kamu sudah ambil ${photoCount} foto. Klik Next buat lanjut.`;
  }
}

// Jalankan foto otomatis setiap 3 detik
function startPhotoSequence() {
  takenPhotos = [];
  photoPreview.innerHTML = '';
  let count = 0;

  document.getElementById('info').textContent = 'Mulai pengambilan foto...';

  const interval = setInterval(() => {
    if (count < photoCount) {
      takePhoto();
      count++;
    } else {
      clearInterval(interval);
    }
  }, 3000); // 3 detik jeda antar foto
}

// Pilih filter
function setFilter(filter) {
  selectedFilter = filter;

  switch (filter) {
    case 'fresh':
      video.style.filter = 'brightness(1.1) contrast(1.2) saturate(1.3)';
      break;
    case 'vintage':
      video.style.filter = 'sepia(0.5) contrast(1.1)';
      break;
    case 'bw':
      video.style.filter = 'grayscale(1) contrast(1.1)';
      break;
    case 'warm':
      video.style.filter = 'sepia(0.3) saturate(1.4) brightness(1.1)';
      break;
    case 'dreamy':
      video.style.filter = 'blur(1px) brightness(1.3) contrast(0.9)';
      break;
    case 'aesthetic':
      video.style.filter = 'sepia(0.2) brightness(1.1) contrast(1.3) saturate(1.6)';
      break;
    default:
      video.style.filter = 'none';
  }
}

// Mirror
function toggleMirror() {
  video.classList.toggle("mirror");
  isMirrored = !isMirrored;
}

// Tombol Next / Start
document.querySelector(".start-button").addEventListener("click", function () {
  localStorage.setItem("jumlahFoto", photoCount);
});

// Filter default saat load
window.addEventListener('load', () => {
  setFilter('none');
});

// Tombol mulai foto otomatis
document.getElementById('start-sequence').addEventListener('click', startPhotoSequence);

// Hasil foto (di halaman result.html)
const photos = JSON.parse(localStorage.getItem("photos")) || [];
const photocount = localStorage.getItem("photoCount");
const container = document.getElementById("result-container");
if (container) {
  photos.slice(0, photoCount).forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "result-photo";
    container.appendChild(img);
  });
  container.classList.add(`layout-${photoCount}`);
}

// === Tombol Mulai Foto Otomatis ===
document.getElementById('start-sequence').addEventListener('click', startPhotoSequence);

function startPhotoSequence() {
  takenPhotos = [];
  photoPreview.innerHTML = '';
  let count = 0;

  document.getElementById('info').textContent = 'Mulai pengambilan foto...';

  function countdownAndShoot() {
    let countdownEl = document.getElementById('countdown');
    let timeLeft = 3;

    countdownEl.textContent = timeLeft;
    countdownEl.style.display = 'block';

    const countdownTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        countdownEl.textContent = timeLeft;
      } else {
        clearInterval(countdownTimer);
        countdownEl.textContent = '';
        countdownEl.style.display = 'none';
        takePhoto();
        count++;
        if (count < photoCount) {
          setTimeout(countdownAndShoot, 500); // jeda 0.5 detik sebelum mulai countdown lagi
        }
      }
    }, 1000);
  }

  countdownAndShoot();
}
