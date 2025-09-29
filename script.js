document.addEventListener('DOMContentLoaded', function() {

    // --- LOGIKA NAVIGASI ---
    
    // Sembunyikan semua menu dropdown saat halaman dimuat (jika CSS tidak menangani ini)
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        // Menggunakan classList untuk mengelola tampilan, lebih baik daripada style.display
        menu.classList.remove('active');
    });

    // Menangani klik pada dropdown utama
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Logika untuk dropdown utama
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Tutup semua dropdown lain
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    const m = d.querySelector('.dropdown-menu');
                    if (m) {
                        m.classList.remove('active');
                        // Tutup juga submenu di dropdown lain
                        const submenus = d.querySelectorAll('.dropdown-menu-submenu');
                        submenus.forEach(submenu => submenu.classList.remove('active'));
                    }
                }
            });
            
            // Buka/tutup dropdown yang diklik
            menu.classList.toggle('active');
        });

        // Logika untuk dropdown submenu (Identifikasi Lanjutan)
        const submenus = dropdown.querySelectorAll('.dropdown-submenu');
        submenus.forEach(submenu => {
            const submenuToggle = submenu.querySelector('.dropdown-toggle-submenu');
            const submenuMenu = submenu.querySelector('.dropdown-menu-submenu');
            if (submenuToggle && submenuMenu) {
                submenuToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // Mencegah event "bubble up" ke dropdown utama
                    submenuMenu.classList.toggle('active');
                });
            }
        });
    });

    // Tutup semua dropdown saat klik di luar area navigasi
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav')) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.remove('active');
                    const submenus = dropdown.querySelectorAll('.dropdown-menu-submenu');
                    submenus.forEach(submenu => submenu.classList.remove('active'));
                }
            });
        }
    });

    // --- LOGIKA SOAL KILAT (INDEX.HTML) ---
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizModal = document.getElementById('quiz-modal');
    const closeBtn = document.querySelector('.close-btn');
    const questionArea = document.getElementById('question-area');
    const quizContainer = document.getElementById('quiz-container');
    const quizResult = document.getElementById('quiz-result');

    const questions = [
        "Apakah anak memiliki masalah dalam perkembangan atau pembelajaran?",
        "Apakah ada perbedaan kemampuan yang signifikan antara anak dan teman sebaya pada usia yang sama?",
        "Apakah masalah yang dimiliki anak bukan dipengaruhi oleh faktor sekolah, seperti kurikulum atau materi yang sulit?",
        "Apakah masalah sudah berlangsung cukup lama?",
        "Apakah masalah terjadi pada beberapa situasi kondisi seperti di rumah dan di sekolah?",
        "Apakah masalah ini mempengaruhi pembelajaran atau kehidupan anak?"
    ];

    let currentQuestionIndex = 0;
    let iyaCount = 0;

    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const questionText = questions[currentQuestionIndex];
            questionArea.innerHTML = `
                <p class="question-text">${questionText}</p>
                <div class="quiz-options">
                    <label><input type="radio" name="answer" value="iya"> Iya</label>
                    <label><input type="radio" name="answer" value="tidak"> Tidak</label>
                </div>
            `;
            const radioButtons = document.querySelectorAll('input[name="answer"]');
            radioButtons.forEach(radio => {
                radio.addEventListener('change', handleAnswer);
            });
        } else {
            showResult();
        }
    }

    function handleAnswer(event) {
        if (event.target.value === 'iya') {
            iyaCount++;
        }
        currentQuestionIndex++;
        showQuestion();
    }

    // Fungsi closeModal harus bisa diakses secara global, jadi pastikan didefinisikan di luar atau di dalam event listener.
    window.closeModal = function() {
        quizModal.style.display = 'none';
        quizContainer.style.display = 'block';
        quizResult.style.display = 'none';
        currentQuestionIndex = 0;
        iyaCount = 0;
    };

    function showResult() {
        quizContainer.style.display = 'none';
        quizResult.style.display = 'flex';

        let resultContent = '';
        const resultTitle = iyaCount >= 3 ? "Hasil Anda: Perlu Perhatian Lebih" : "Hasil Anda: Perkembangan Terlihat Baik";
        const resultText = iyaCount >= 3
            ? "Berdasarkan jawaban Anda, terdapat beberapa tanda yang mengindikasikan perlunya perhatian lebih terhadap perkembangan anak. Anda dapat melanjutkan ke langkah **'Identifikasi Awal'** untuk skrining yang lebih mendalam."
            : "Hasil menunjukkan bahwa tidak ada tanda yang signifikan. Namun, teruslah pantau perkembangan anak Anda. Jika ada kekhawatiran di masa depan, jangan ragu untuk kembali menggunakan alat ini.";

        const resultAction = iyaCount >= 3
            ? `<a href="biodata.html" class="cta-button">Mulai Identifikasi Awal</a>`
            : `<a href="#" class="cta-button" onclick="closeModal()">Selesai</a>`;

        resultContent = `
            <div class="result-card">
                <div class="card-icon"><i class="fas ${iyaCount >= 3 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i></div>
                <h3 class="card-title">${resultTitle}</h3>
                <p class="card-text">${resultText}</p>
            </div>
            <div class="step-action" style="margin-top: 2rem;">
                ${resultAction}
            </div>
        `;
        quizResult.innerHTML = resultContent;
    }

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            quizModal.style.display = 'flex';
            showQuestion();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function(e) {
        if (e.target === quizModal) {
            closeModal();
        }
    });

    // --- LOGIKA BIODATA, KUESIONER, HASIL (DARI script.js ASLI) ---
    
    // LOGIKA BIODATA (BIODATA.HTML)
    const biodataForm = document.getElementById('biodata-form');
    if (biodataForm) {
        biodataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nama = document.getElementById('nama').value;
            const usia = document.getElementById('usia').value;
            const penanggungJawab = document.getElementById('penanggungJawab').value;

            localStorage.setItem('biodata', JSON.stringify({ nama, usia, penanggungJawab }));

            window.location.href = 'kuesioner.html';
        });
    }

    // LOGIKA KUESIONER (KUESIONER.HTML)
    const classifications = {
        'Hambatan Intelektual Ringan': [1, 2, 3, 4, 5],
        'Kesulitan Belajar Spesifik (Disleksia)': [6, 7, 8],
        'Kesulitan Belajar Spesifik (Disgrafia)': [9, 10, 11],
        'Kesulitan Belajar Spesifik (Diskalkulia)': [12, 13, 14],
        'Gangguan Bicara dan Bahasa': [15, 16, 17],
        'Gangguan Emosi dan Perilaku': [18, 19, 20, 21],
        'Spektrum Autis': [22, 23, 24, 25],
        'ADHD': [26, 27, 28, 29]
    };

    const thresholds = {
        'Hambatan Intelektual Ringan': 4,
        'Kesulitan Belajar Spesifik (Disleksia)': 2,
        'Kesulitan Belajar Spesifik (Disgrafia)': 2,
        'Kesulitan Belajar Spesifik (Diskalkulia)': 2,
        'Gangguan Bicara dan Bahasa': 2,
        'Gangguan Emosi dan Perilaku': 3,
        'Spektrum Autis': 3,
        'ADHD': 3
    };

    const skriningForm = document.getElementById('skrining-form');
    if (skriningForm) {
        skriningForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const questions = document.querySelectorAll('.question-item');
            let allAnswered = true;
            let unansweredQuestionNumber = null;

            questions.forEach((item, index) => {
                const qNum = index + 1;
                const qName = `q${qNum}`;
                const answer = document.querySelector(`input[name="${qName}"]:checked`);

                if (!answer) {
                    allAnswered = false;
                    if (unansweredQuestionNumber === null) {
                         unansweredQuestionNumber = qNum;
                    }
                }
            });

            if (!allAnswered) {
                alert('Anda belum mengisi jawaban untuk pertanyaan nomor ' + unansweredQuestionNumber + '. Mohon lengkapi semua pertanyaan.');
                return;
            }

            const categoryScores = {};
            const answers = {};

            for (const category in classifications) {
                categoryScores[category] = 0;
            }

            questions.forEach((item, index) => {
                const qNum = index + 1;
                const qName = `q${qNum}`;
                const answer = document.querySelector(`input[name="${qName}"]:checked`);

                if (answer) {
                    answers[qName] = answer.value;
                    if (answer.value === 'ya') {
                        for (const category in classifications) {
                            if (classifications[category].includes(qNum)) {
                                categoryScores[category]++;
                                break;
                            }
                        }
                    }
                }
            });

            localStorage.setItem('categoryScores', JSON.stringify(categoryScores));
            localStorage.setItem('answers', JSON.stringify(answers));

            window.location.href = 'hasil.html';
        });
    }

// ... (Bagian atas script.js Anda, termasuk logika Navigasi, Quiz, Biodata, Kuesioner, dan definisi classifications & thresholds)

// LOGIKA HASIL & UNDUH PDF (HASIL.HTML) - BAGIAN INI DIMODIFIKASI
const resultContainer = document.getElementById('document-to-print'); // Mengacu pada div utama
const downloadPdfBtn = document.getElementById('download-pdf-button'); // ID tombol yang baru

if (resultContainer) {
    const biodata = JSON.parse(localStorage.getItem('biodata'));
    const categoryScores = JSON.parse(localStorage.getItem('categoryScores'));

    // Definisikan elemen HTML
    const namaAnakEl = document.getElementById('nama-anak');
    const usiaAnakEl = document.getElementById('usia-anak');
    const pengisiInstrumenEl = document.getElementById('pengisi-instrumen');
    const tanggalPengisianEl = document.getElementById('tanggal-pengisian');
    const signatureNameEl = document.getElementById('signature-name-text');
    const summaryContainer = document.getElementById('result-summary');
    const detailsContainer = document.getElementById('result-details');
    const recommendationContainer = document.getElementById('recommendation-container');
    // Tombol lanjut identifikasi sudah dihapus di HTML

    if (biodata && categoryScores) {
        const recommendedClassifications = [];
        let totalYaCount = 0;
        let detailsHtml = '';

        for (const category in categoryScores) {
            totalYaCount += categoryScores[category];
            if (categoryScores[category] >= thresholds[category]) {
                recommendedClassifications.push(category);
                
                // Siapkan rincian skor
                detailsHtml += `
                    <div class="result-item" style="font-weight: bold; background-color: #f7f7f7; padding: 10px;">
                        <div class="question-text">Indikasi **${category}**</div>
                        <div class="answer-status ya">Skor: ${categoryScores[category]}/${classifications[category].length}</div>
                    </div>
                `;
            }
        }

        const tanggal = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // --- PENGISIAN DATA DIRI ---
        namaAnakEl.innerText = biodata.nama;
        usiaAnakEl.innerText = `${biodata.usia} tahun`;
        pengisiInstrumenEl.innerText = biodata.penanggungJawab;
        tanggalPengisianEl.innerText = tanggal;
        signatureNameEl.innerText = `(${biodata.penanggungJawab})`;

        // --- PENGISIAN RINGKASAN ---
        let hasilTitle = "";
        let rekomendasiText = "";

        if (recommendedClassifications.length > 0) {
            hasilTitle = "Perlu Perhatian Lebih";
            rekomendasiText = `
                <p>Berdasarkan jawaban kuesioner, anak Anda menunjukkan **indikasi** terhadap beberapa kategori perkembangan khusus. Hasil skrining menunjukkan kebutuhan perhatian pada klasifikasi berikut:</p>
                <ul style="list-style-type: disc; padding-left: 25px; margin-top: 15px;">
                    ${recommendedClassifications.map(c => `<li>**${c}** (Ambang Batas: ${thresholds[c]}, Skor Anak: ${categoryScores[c]})</li>`).join('')}
                </ul>
                <p>Total jawaban **"Ya"** pada kuesioner: **${totalYaCount}** dari 29 pertanyaan.</p>
                <p>Disarankan untuk melanjutkan ke langkah identifikasi lanjutan atau segera berkonsultasi dengan profesional.</p>
            `;
            detailsContainer.innerHTML = detailsHtml;
        } else {
            hasilTitle = "Perkembangan Terlihat Baik";
            rekomendasiText = `
                <p>Berdasarkan jawaban kuesioner, perkembangan anak terlihat baik dan sesuai dengan tahapan usianya.</p>
                <p>Tidak ada skor kategori yang mencapai ambang batas yang ditentukan. Total jawaban **"Ya"** pada kuesioner: **${totalYaCount}** dari 29 pertanyaan.</p>
                <p>Tetap pantau terus perkembangannya dan berikan stimulasi yang positif.</p>
            `;
            detailsContainer.innerHTML = "<p>Tidak ada indikasi kuat yang melebihi ambang batas pada setiap kategori.</p>";
        }
        
        summaryContainer.innerHTML = `<p style="font-size: 1.1rem; font-weight: bold;">Kesimpulan Skrining: ${hasilTitle}</p>`;
        recommendationContainer.innerHTML = rekomendasiText;

    } else {
        resultContainer.innerHTML = `<p class="error-message" style="color: red; padding: 20px;">Data hasil skrining tidak ditemukan. Mohon ulangi proses skrining dari <a href="biodata.html">halaman biodata</a>.</p>`;
    }

    // Fungsi Unduh PDF menggunakan html2pdf.js - DIFIKSI UNTUK PAGE BREAK
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            alert('Proses mengunduh laporan akan dimulai. Mohon tunggu...');
            
            // Sembunyikan tombol aksi saat proses download
            const buttonContainer = document.querySelector('.download-button-container');
            if (buttonContainer) buttonContainer.style.display = 'none';

            const opt = {
                margin: 10,
                filename: `Laporan-Skrining-Awal-${biodata.nama}-${tanggalPengisianEl.innerText}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                // Meningkatkan skala dan DPI untuk hasil gambar yang lebih tajam
                html2canvas: { scale: 4, logging: false, dpi: 300, letterRendering: true }, 
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                // Menggunakan 'avoid-all' untuk menghindari pemotongan di dalam elemen
                pagebreak: { mode: 'avoid-all' } 
            };

            // Menggunakan elemen 'document-to-print' sebagai konten PDF
            html2pdf().set(opt).from(resultContainer).save().then(() => {
                // Tampilkan kembali tombol setelah proses download selesai/gagal
                if (buttonContainer) buttonContainer.style.display = 'flex';
            }).catch(error => {
                console.error("Gagal membuat PDF:", error);
                alert("Terjadi kesalahan saat mengunduh dokumen. Coba muat ulang halaman.");
                // Tampilkan kembali tombol jika terjadi error
                if (buttonContainer) buttonContainer.style.display = 'flex';
            });
        });
    }
}
// ... (Sisa script.js Anda)
});