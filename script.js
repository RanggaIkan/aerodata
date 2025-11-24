// Konfigurasi
const API_KEY = "b2e9dab0e4b772a74db68850d45b56f1"; // Key kamu yang tadi
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Element Selector
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-button');
const weatherContent = document.getElementById('weather-content');
const messageBox = document.getElementById('message-box');

// Event Listeners
searchBtn.addEventListener('click', () => performSearch());
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Fungsi Utama Pencarian
async function performSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError("Silakan masukkan nama kota.");
        return;
    }

    // Reset UI saat loading
    messageBox.classList.remove('hidden');
    messageBox.style.color = '#fff';
    messageBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sedang mencari...';
    weatherContent.classList.add('hidden');

    try {
        const data = await fetchWeatherData(city);
        updateUI(data);
        messageBox.classList.add('hidden');
        weatherContent.classList.remove('hidden');
    } catch (error) {
        showError(error.message);
        weatherContent.classList.add('hidden');
    }
}

// Fetch Data dari API
async function fetchWeatherData(city) {
    // PERBAIKAN: Menggunakan backticks (`) untuk template literal
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=id`;
    
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Kota "${city}" tidak ditemukan.`);
        }
        throw new Error("Terjadi kesalahan jaringan.");
    }

    return await response.json();
}

// Update Tampilan (UI)
function updateUI(data) {
    // Ambil elemen
    const { name, sys, main, weather, wind } = data;
    
    // Update Teks Utama
    document.getElementById('city-name').textContent = `${name}, ${sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(main.temp)}°C`;
    document.getElementById('description').textContent = weather[0].description;
    
    // Update Detail Grid
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${wind.speed} m/s`;
    document.getElementById('feels-like').textContent = `${Math.round(main.feels_like)}°C`;

    // Update Ikon Cuaca (Resolusi tinggi)
    const iconCode = weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Update Tanggal Hari Ini
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', dateOptions);
    document.getElementById('date-info').textContent = today;
}

// Fungsi Tampilkan Error
function showError(message) {
    messageBox.classList.remove('hidden');
    messageBox.style.color = '#ff6b6b';
    messageBox.textContent = message;
}