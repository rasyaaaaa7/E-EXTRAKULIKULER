// Data awal ekstrakurikuler
const ekskulData = {
    basket: { name: 'Basket', students: ['Ali', 'Budi', 'Cici'], attendance: [] },
    musik: { name: 'Musik', students: ['Dedi', 'Eka'], attendance: [] },
    renang: { name: 'Renang', students: ['Fani', 'Gina', 'Hadi'], attendance: [] }
};

// Load data dari localStorage
function loadData() {
    const stored = localStorage.getItem('ekskulData');
    if (stored) {
        Object.assign(ekskulData, JSON.parse(stored));
    }
}

// Save data ke localStorage
function saveData() {
    localStorage.setItem('ekskulData', JSON.stringify(ekskulData));
}

// Update statistik di home
function updateStats() {
    const statsContainer = document.querySelector('.stat-cards');
    statsContainer.innerHTML = '';
    for (const key in ekskulData) {
        const ekskul = ekskulData[key];
        const total = ekskul.students.length;
        const present = ekskul.attendance.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        const icon = key === 'basket' ? '<svg><circle cx="25" cy="25" r="20" fill="#fff"/><text x="25" y="30" text-anchor="middle" fill="#007bff">🏀</text></svg>' :
                   key === 'musik' ? '<svg><circle cx="25" cy="25" r="20" fill="#fff"/><text x="25" y="30" text-anchor="middle" fill="#007bff">🎵</text></svg>' :
                   '<svg><circle cx="25" cy="25" r="20" fill="#fff"/><text x="25" y="30" text-anchor="middle" fill="#007bff">🏊</text></svg>';
        statsContainer.innerHTML += `
            <div class="stat-card">
                ${icon}
                <h3>${ekskul.name}</h3>
                <p>Hadir: ${present}/${total} (${percentage}%)</p>
            </div>
        `;
    }
}

// Dashboard logic
if (window.location.pathname.includes('dashboard.html')) {
    loadData();
    const select = document.getElementById('ekskul-select');
    const qrcodeDiv = document.getElementById('qrcode');
    const logList = document.getElementById('log-list');
    const resetBtn = document.getElementById('reset-btn');

    // Generate QR
    function generateQR(ekskul) {
        const url = `${window.location.origin}/absensi.html?ekskul=${ekskul}`;
        qrcodeDiv.innerHTML = '';
        new QRCode(qrcodeDiv, url);
    }

    // Update log
    function updateLog() {
        const ekskul = select.value;
        logList.innerHTML = '';
        ekskulData[ekskul].attendance.forEach(entry => {
            logList.innerHTML += `<li>${entry.student} - ${entry.time}</li>`;
        });
    }

    select.addEventListener('change', () => {
        generateQR(select.value);
        updateLog();
    });

    resetBtn.addEventListener('click', () => {
        for (const key in ekskulData) {
            ekskulData[key].attendance = [];
        }
        saveData();
        updateLog();
    });

    // Initial load
    generateQR(select.value);
    updateLog();
} else if (window.location.pathname.includes('index.html')) {
    loadData();
    updateStats();
}

// Simulasi absensi (untuk testing, buat file absensi.html terpisah atau handle via URL param)
if (window.location.search.includes('ekskul=')) {
    const urlParams = new URLSearchParams(window.location.search);
    const ekskul = urlParams.get('ekskul');
    const student = prompt('Masukkan nama siswa:');
    if (student && ekskulData[ekskul].students.includes(student)) {
        ekskulData[ekskul].attendance.push({ student, time: new Date().toLocaleString() });
        saveData();
        alert('Absensi berhasil!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Siswa tidak ditemukan!');
    }
}
