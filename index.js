// Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('show');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    sidebarToggle?.addEventListener('click', toggleSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });

    // Close sidebar when clicking close button
    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking any sidebar link (mobile)
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeSidebar();
      });
    });

      // Close sidebar on escape key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              closeSidebar();
          }
      });

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  // Jalankan search hanya saat user mengetik (bukan saat Enter ditekan)
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword === "") {
      removeHighlights();
      return;
    }
    removeHighlights();
    searchAndHighlight(keyword);
  });

  // ENTER hanya untuk pindah ke hasil berikutnya (tanpa reset highlight)
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // cegah form submit
      goToNextHighlight();
    }
  });
}
    
// Pastikan pakai createClient dari supabase-js
const { createClient } = window.supabase;

const supabaseUrl = 'https://gykbniseplrqvrnabzdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyNTcsImV4cCI6MjA2ODkwNzI1N30.0ESeTAo3RRdVkGL3UGte8-KUjBy2F8Rh40O-bo67P0w'; // pakai anon key, bukan service_role
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function fetchUMKMData() {
  const { data, error } = await supabaseClient
    .from('umkm') // sesuaikan nama tabel
    .select('*');

  if (error) {
    console.error('Error fetching data from Supabase:', error.message);
    const dataInfo = document.getElementById('data-info');
    if (dataInfo) {
      dataInfo.textContent = 'Terjadi kesalahan saat memuat data. Silakan refresh halaman.';
      dataInfo.className = 'text-red-500 text-sm text-center py-4';
    }
    return [];
  }

  return data;
}


fetchUMKMData().then(data => {
  console.log("Data dari Supabase:", data);

  UMKM_DATA = data;
  filteredData = [...UMKM_DATA];
    const kategoriUnik = [...new Set(data.map(d => d.kategori?.toLowerCase().trim()))];
    console.log("Kategori tersedia dari data:", kategoriUnik);

function tampilkanUMKM(data, keyword = "") {
  const umkmList = document.getElementById("umkmList");
  const wrapper = document.getElementById("umkmWrapper");

  if (!umkmList || !wrapper) return;

  // Saat belum ada input pencarian → sembunyikan
  if (keyword.trim() === "") {
    wrapper.classList.add("hidden");
    umkmList.innerHTML = "";
    return;
  }

  // Tampilkan wrapper karena pencarian dilakukan
  wrapper.classList.remove("hidden");

  // Tidak ada hasil
  if (data.length === 0) {
    umkmList.innerHTML = `
      <li class="col-span-3 text-center text-gray-500 italic">Tidak ditemukan hasil.</li>
    `;
    return;
  }

  // Ada hasil
  umkmList.innerHTML = data.map(umkm => `
    <li class="bg-white border border-gray-200 rounded-lg p-4 shadow">
      <h4 class="text-lg font-bold text-[#7b603b]">${umkm.nama_usaha}</h4>
      <p class="text-sm text-gray-600">${umkm.alamat ?? '-'}</p>
      <p class="text-xs text-gray-500 italic">${umkm.kategori ?? ''}</p>
    </li>
  `).join('');
}

  const total = data.length; // tambahkan ini ✅

  const memiliki = data.filter(d => d.status_nib?.toLowerCase().trim() === "sudah memiliki").length;
  const belum = total - memiliki;

  const pelatihan_sudah = data.filter(d =>
    d.status_plt?.toString().trim().toLowerCase() === "pernah"
  ).length;
  const pelatihan_belum = total - pelatihan_sudah;

    // === PIE CHART UMKM UNGGULAN ===

    const ctxPie = document.getElementById('pieChart')?.getContext('2d');
      if (ctxPie) {
    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: ['Belum Memiliki SKU', 'Sudah Memiliki SKU'],
        datasets: [{
          data: [belum, memiliki],
          backgroundColor: ['#D7C0A6', '#A67C52'],
          borderWidth: 0
        }]
      },
      options: pieOptions,
      plugins: [pieLabelsPlugin]
    });
    }

 // DOUGHNUT CHART
  const ctxDoughnut = document.getElementById('doughnutChart')?.getContext('2d');
  if (ctxDoughnut) {
    new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
        labels: ['Sudah Pelatihan', 'Belum Pelatihan'],
        datasets: [{
          data: [pelatihan_sudah, pelatihan_belum],
          backgroundColor: ['#A67C52', '#D7C0A6'],
          borderWidth: 0
        }]
      },
      options: doughnutOptions,
      plugins: [doughnutLabelsPlugin]
    });
}
}
)
  .catch(error => {
    console.error('Gagal mengambil data:', error);
  });

        const pieOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 600
                        },
                        color: '#4b3924'
                    }
                },
                tooltip: {
                callbacks: {
                    label: function (context) {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const value = context.parsed;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${value} UMKM (${percentage}%)`;
                    }
                }
                }

            }
        };

        // Plugin untuk label di pie chart
        const pieLabelsPlugin = {
            id: 'labelOnPie',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                const dataset = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);
                const total = dataset.data.reduce((a, b) => a + b, 0);
                
                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                
                meta.data.forEach((arc, i) => {
                    const angle = (arc.startAngle + arc.endAngle) / 2;
                    const r = (arc.outerRadius + arc.innerRadius) / 2;
                    const x = chart.width / 2 + r * Math.cos(angle);
                    const y = chart.height / 2 + r * Math.sin(angle);
                    const value = dataset.data[i];
                    const percent = Math.round((value / total) * 100);
                    
                    // Only show label if percentage is >= 3%
                    if (percent >= 3) {
                        ctx.fillText(`${value}`, x, y - 7);
                        ctx.fillText(`(${percent}%)`, x, y + 7);
                    }
                });
                ctx.restore();
            }
        };

        // === PIE CHART UMKM UNGGULAN END ===

        // === DOUGHNUT CHART PELATIHAN UMKM START ===

        const doughnutData = {
            labels: ['Sudah Pelatihan', 'Belum Pelatihan'],
            datasets: [{
                data: [158, 674], // 158 sudah pelatihan, 674 belum pelatihan
                backgroundColor: ['#A67C52', '#D7C0A6'],
                borderWidth: 0
            }]
        };

        const doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 600
                        },
                        color: '#4b3924'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' UMKM';
                        }
                    }
                }
            }
        };

        // Plugin untuk label di donut chart
        const doughnutLabelsPlugin = {
            id: 'labelInsideSlice',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                const dataset = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);
                const total = dataset.data.reduce((a, b) => a + b, 0);

                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;

                meta.data.forEach((arc, i) => {
                    const angle = (arc.startAngle + arc.endAngle) / 2;
                    const radius = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.5;
                    const x = chart.chartArea.left + (chart.chartArea.width / 2) + radius * Math.cos(angle);
                    const y = chart.chartArea.top + (chart.chartArea.height / 2) + radius * Math.sin(angle);

                    const value = dataset.data[i];
                    const percent = Math.round((value / total) * 100);

                    if (percent >= 3) {
                        ctx.fillText(`${value}`, x, y - 7);
                        ctx.fillText(`(${percent}%)`, x, y + 7);
                    }
                });

                ctx.restore();
            }
        };


    // Add click event listeners to navbar and sidebar to navigate to statistik.html
   const el = document.getElementById("some-id");
  if (el) {
    el.addEventListener("click", function() {
      // aksi
    });
  }

    document.getElementById('sidebar').addEventListener('click', function() {
      window.location.href = 'statistik.html';
    });

let highlightedMatches = [];
let currentHighlightIndex = 0;
let lastKeyword = "";

function searchAndHighlight(keyword) {
  const mainContent = document.body;
  const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
  const regex = new RegExp(keyword, "gi");

  highlightedMatches = [];
  currentHighlightIndex = 0; // selalu mulai dari awal

  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentNode && node.nodeValue.match(regex)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach(node => {
    const parent = node.parentNode;
    const frag = document.createDocumentFragment();
    const parts = node.nodeValue.split(regex);
    const matches = node.nodeValue.match(regex);

    parts.forEach((part, i) => {
      frag.appendChild(document.createTextNode(part));
      if (i < matches.length) {
        const span = document.createElement("span");
        span.className = "highlighted";
        span.textContent = matches[i];
        highlightedMatches.push(span);
        frag.appendChild(span);
      }
    });

    parent.replaceChild(frag, node);
  });

  scrollToCurrentHighlight();
}

function scrollToCurrentHighlight() {
  if (highlightedMatches.length === 0) return;

  highlightedMatches.forEach(el => el.classList.remove("current"));

  const target = highlightedMatches[currentHighlightIndex];
  if (target) {
    target.classList.add("current");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function goToNextHighlight() {
  if (highlightedMatches.length === 0) return;

  currentHighlightIndex = (currentHighlightIndex + 1) % highlightedMatches.length;
  scrollToCurrentHighlight();
}

function removeHighlights() {
  const highlighted = document.querySelectorAll(".highlighted");
  highlighted.forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });
}

// Chatbot functionality
        function makeLinksClickable(text) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          return text.replace(urlRegex, function (url) {
            return `<a href="${url}" target="_blank" class="clickable-link">${url}</a>`;
          });
        }

        function toggleChatbot() {
          // FIXED: Ganti 'window' dengan 'chatbotWin' untuk avoid conflict dengan global window object
          const chatbotWin = document.getElementById("chatbotWindow");
          if (!chatbotWin) {
            console.error("Element chatbotWindow tidak ditemukan");
            return;
          }
          chatbotWin.classList.toggle("active");
        }

        function sendMessage() {
          const input = document.getElementById("chatInput");
          if (!input) {
            console.error("Element chatInput tidak ditemukan");
            return;
          }
          
          const message = input.value.trim();

          if (message) {
            addMessage(message, "user");
            input.value = "";

            // Auto-collapse questions
            autoCollapseQuestions();

            // Show typing indicator
            showTypingIndicator();

            // Simulate bot response
            setTimeout(() => {
              hideTypingIndicator();
              const response = getBotResponse(message);
              addMessage(response, "bot");
            }, 1500);
          }
        }

        function handleEnter(event) {
          if (event.key === "Enter") {
            sendMessage();
          }
        }

        function addMessage(text, sender) {
          const messagesContainer = document.getElementById("chatbotMessages");
          if (!messagesContainer) {
            console.error("Element chatbotMessages tidak ditemukan");
            return;
          }
          
          const messageDiv = document.createElement("div");
          messageDiv.className = `message ${sender}`;

          const bubbleDiv = document.createElement("div");
          bubbleDiv.className = "message-bubble";

          // FIXED: Tambahkan makeLinksClickable untuk pesan bot
          if (sender === "bot") {
            bubbleDiv.innerHTML = makeLinksClickable(text);
          } else {
            bubbleDiv.innerHTML = text;
          }

          messageDiv.appendChild(bubbleDiv);
          messagesContainer.appendChild(messageDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function askQuestion(type) {
          let question = "";
          let response = "";

          switch (type) {
            case "panduan-kbli":
              question = "Panduan KBLI (Klasifikasi Baku Lapangan Usaha)";
              response = `📋 <strong>Panduan KBLI:</strong><br><br>
                        KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah sistem klasifikasi resmi yang digunakan di Indonesia untuk mengelompokkan kegiatan ekonomi atau jenis usaha berdasarkan aktivitas utamanya. KBLI ini wajib dicantumkan saat pelaku usaha mendaftarkan NIB (Nomor Induk Berusaha) melalui sistem OSS (Online Single Submission).<br><br>
                        <strong>Fungsi KBLI dalam pengajuan NIB:</strong><br>
                        Menentukan jenis usaha yang dijalankan pelaku usaha. 
                        Menjadi dasar penentuan perizinan berusaha dan kewajiban lainnya.
                        Digunakan oleh pemerintah untuk keperluan statistik, pajak, dan pembinaan usaha. <br><br>
                        <strong>Cara menentukan KBLI:</strong><br>
                        1. Identifikasi kegiatan utama usaha Anda<br>
                        2. Cari kategori yang paling sesuai di daftar KBLI<br>
                        3. Gunakan kode 5 digit yang tepat<br><br>
                        <strong>Contoh:</strong><br>
                        • Warung makan: 56101<br>
                        • Toko kelontong: 47211<br>
                        • Jasa potong rambut: 96021`;
              break;

            case "persyaratan-nib":
              question = "Persyaratan Pengajuan NIB";
              response = `📄 <strong>Persyaratan NIB (Nomor Induk Berusaha):</strong><br><br>
                        <strong>Dokumen yang diperlukan untuk Usaha Perseorangan (UMK/Usaha Mikro dan Kecil):</strong><br>
                        1.	KTP dan NIK pemilik usaha<br>
                        2.	Alamat lengkap usaha<br>
                        3.	Jenis dan nama usaha<br>
                        4.	Nomor telepon dan email aktif<br>
                        5.	Kode KBLI yang sesuai dengan jenis usaha<br>
                        6.	NPWP (jika ada)<br>
                        7.	Lokasi dan luas tempat usaha<br>
                        8.	Jumlah tenaga kerja<br>
                        9.	Rencana investasi atau modal usaha<br>
                        10.	Surat pernyataan bersedia mematuhi peraturan (akan muncul otomatis di sistem OSS)<br><br>
                        <strong>Untuk Badan Usaha (PT, CV, Yayasan, dll.):</strong><br>
                        1.	Akta pendirian dan SK Kemenkumham<br>
                        2.	NPWP Badan Usaha<br>
                        3.	Data pengurus/pemilik<br>
                        4.	Alamat email & nomor HP perusahaan<br>
                        5.	Dokumen pendukung lain tergantung jenis badan usaha<br><br>
                        <strong>Catatan:</strong><br>
                        • NIB berlaku seumur hidup<br>
                        • Gratis dan dapat diurus online di OSS`;
              break;

            case "langkah-nib":
              question = "Langkah-langkah Pengajuan NIB";
              response = `📝 <strong>Langkah-langkah Pengajuan NIB </strong><br><br>
                        Pengajuan NIB dilakukan secara online melalui platform resmi OSS (Online Single Submission). NIB dapat diperoleh oleh pelaku usaha perseorangan maupun non-perseorangan (seperti PT, CV, koperasi, yayasan). <br><br>
                        <strong>Adapun Langkah-langkah Pengajuan NIB : </strong><br>
                        1. Akses Website OSS. Buka https://oss.go.id Pilih menu "Daftar" dan buat akun OSS jika belum memiliki.<br>
                        2. Lengkapi data diri dan data usaha.<br>
                        3. Pilih KBLI sesuai usaha.<br>
                        4. Submit dan cetak NIB.<br><br>
                        <strong>Catatan:</strong> Gunakan KBLI 2020 yang sesuai agar tidak terkendala dalam proses perizinan lanjutan. Simpan baik-baik file NIB dan akun OSS kamu.`;
              break;

            case "persyaratan-halal":
              question = "Persyaratan Sertifikat Halal";
              response = `🥘 <strong>Persyaratan Sertifikat Halal:</strong><br><br>
                        <strong>Dokumen yang diperlukan:</strong><br>
                        1. Sertifikat NIB<br>
                        2. Manual sistem jaminan halal<br>
                        3. Daftar produk dan bahan baku<br>
                        4. Sertifikat halal bahan baku<br>
                        5. Dokumentasi proses produksi<br>
                        6. Daftar penyelia halal<br><br>
                        <strong>Biaya:</strong><br>
                        • Mikro: Gratis<br>
                        • Kecil: Rp 300.000<br>
                        • Menengah: Rp 2.500.000`;
              break;

            case "langkah-halal":
              question = "Langkah-langkah Sertifikat Halal";
              response = `✅ <strong>Langkah-langkah Sertifikat Halal:</strong><br><br>
                        1. <strong>Persiapan</strong> dokumen persyaratan<br>
                        2. <strong>Daftar</strong> di SIHALAL https://bpjph.halal.go.id/ <br>
                        3. <strong>Upload</strong> semua dokumen<br>
                        4. <strong>Pembayaran</strong> biaya sertifikasi<br>
                        5. <strong>Pemeriksaan</strong> dokumen oleh LPPOM MUI<br>
                        6. <strong>Audit</strong> ke lokasi produksi<br>
                        7. <strong>Keputusan</strong> komisi fatwa MUI<br>
                        8. <strong>Penerbitan</strong> sertifikat halal<br><br>
                        <strong>Masa berlaku:</strong> 4 tahun`;
              break;

            case "bantuan-umkm":
              question = "Program Bantuan UMKM";
              response = `💰 <strong>Program Bantuan UMKM:</strong><br><br>
                        <strong>1. Bantuan Produktif Usaha Mikro (BPUM)</strong><br>
                        • Dana bantuan Rp 2.4 juta<br>
                        • Untuk usaha mikro terdampak pandemi<br><br>
                        <strong>2. KUR (Kredit Usaha Rakyat)</strong><br>
                        • Mikro: hingga Rp 50 juta<br>
                        • Kecil: hingga Rp 500 juta<br>
                        • Bunga rendah dan mudah diakses<br><br>
                        <strong>3. Program Pelatihan UMKM</strong><br>
                        • Pelatihan digital marketing<br>
                        • Manajemen keuangan usaha<br>
                        • Pengembangan produk<br><br>
                        <strong>Info lebih lanjut:</strong> Hubungi Dinas Koperasi setempat`;
              break;
          }

          addMessage(question, "user");

          // Show typing indicator
          showTypingIndicator();

          setTimeout(() => {
            hideTypingIndicator();
            addMessage(response, "bot");

            // Auto-collapse questions setelah memilih
            autoCollapseQuestions();
          }, 1500);
        }

        function getBotResponse(message) {
          const msg = message.toLowerCase();

          if (msg.includes("halo") || msg.includes("hai") || msg.includes("selamat")) {
            return "Halo! 👋 Selamat datang di BAKUL KAHURIPAN. Saya siap membantu Anda dengan informasi seputar UMKM, NIB, sertifikat halal, dan layanan lainnya. Ada yang bisa saya bantu?";
          }

          if (msg.includes("nib") || msg.includes("nomor induk berusaha") || msg.includes("apa itu nomor induk berusaha") || msg.includes("apa itu nib")) {
            return `🆔 <strong>Tentang NIB:</strong><br><br>
                    NIB (Nomor Induk Berusaha) adalah identitas tunggal untuk pelaku usaha di Indonesia. NIB menggantikan TDP, SIUP, dan izin usaha lainnya.<br><br>
                    Silakan pilih pertanyaan spesifik tentang NIB di menu cepat, atau tanyakan hal spesifik yang ingin Anda ketahui.`;
          }

          if (msg.includes("halal") || msg.includes("sertifikat halal")) {
            return `🥘 <strong>Tentang Sertifikat Halal:</strong><br><br>
                    Sertifikat halal adalah bukti tertulis yang dikeluarkan oleh MUI untuk menyatakan kehalalan suatu produk.<br><br>
                    Wajib untuk produk makanan, minuman, obat, dan kosmetik yang beredar di Indonesia.<br><br>
                    Pilih pertanyaan spesifik di menu cepat untuk info lebih detail!`;
          }

          if (msg.includes("kbli") || msg.includes("apa itu kbli") || msg.includes("tolong jelaskan mengenai kbli")) {
            return `📋 <strong>Tentang KBLI:</strong><br><br>
                    KBLI adalah sistem klasifikasi untuk mengelompokkan unit usaha menurut kegiatan ekonomi yang dilakukan.<br><br>
                    Setiap usaha harus memiliki kode KBLI yang sesuai dengan kegiatan utamanya. Pilih "Panduan KBLI" di menu cepat untuk info lengkap!`;
          }

          if (msg.includes("bantuan") || msg.includes("modal") || msg.includes("pinjaman")) {
            return `💰 <strong>Program Bantuan UMKM:</strong><br><br>
                    Ada berbagai program bantuan untuk UMKM seperti BPUM, KUR, dan program pelatihan.<br><br>
                    Pilih "Program Bantuan UMKM" di menu cepat untuk info lengkap tentang syarat dan cara mengajukan!`;
          }

          if (msg.includes("terima kasih") || msg.includes("thanks")) {
            return "🙏 Sama-sama! Senang bisa membantu Anda. Jika ada pertanyaan lain tentang UMKM, NIB, sertifikat halal, atau layanan BAKUL KAHURIPAN lainnya, jangan ragu untuk bertanya ya!";
          }

          if (msg.includes("statistik") || msg.includes("data")) {
            return `📊 <strong>Data UMKM BAKUL KAHURIPAN:</strong><br><br>
                    • Total UMKM: 443 usaha<br>
                    • Yang sudah memiliki NIB: 86 usaha<br>
                    • Kategori terbanyak: Kuliner (168 usaha)<br>
                    • Tersebar di 104 RT dan 19 RW<br><br>
                    Data ini terus diupdate untuk memberikan gambaran terkini perkembangan UMKM di wilayah Kahuripan.`;
          }
          
          if (msg.includes("pabrik tempe") || msg.includes("pembuatan tempe")|| msg.includes("produksi tempe")) {
            return `<strong>10391 - INDUSTRI TEMPE KEDELAI</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan tempe dari kedelai. Usaha pembuatan tempe yang bahan bakunya selain kedelai (dari kacang tanah/kacang-kacangan lainnya), seperti tempe bongkrek, dimasukkan dalam kelompok 10393.`;
          }
          
          if (msg.includes("pabrik tahu") || msg.includes("pembuatan tahu")|| msg.includes("produksi tahu")) {
            return `<strong>10392 - INDUSTRI TAHU KEDELAI</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan tahu dari kedelai. Usaha pembuatan tahu yang bahan bakunya selain kedelai (dari kacang tanah/kacang-kacangan lainnya) dimasukkan dalam kelompok 10393`;
          }
          
          if (msg.includes("pembuatan kue basah")|| msg.includes("produksi kue basah")) {
            return `<strong>10792 - INDUSTRI KUE BASAH</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan macam-macam makanan kue basah, yaitu sejenis kue yang relatif tidak tahan lama, seperti wajik, lemper, kue lapis, lumpia, dan martabak (termasuk pembuatan tape dan lempok`;
          }
          
          if (msg.includes("isi ulang galon") || msg.includes("air minum isi ulang")|| msg.includes("galon isi ulang")) {
            return `<strong>11052 - INDUSTRI AIR MINUM ISI ULANG</strong><br><br>
                    Kelompok ini mencakup industri air minum yang dapat langsung dikonsumsi berupa depot air isi ulang baik yang dioperasikan manual oleh manusia maupun mesin pengisi otomatis (automatic tap water machine) dengan menggunakan wadah dan tutup tanpa merk yang dapat disediakan oleh depot dan/atau dibawa sendiri oleh konsumen.`;
                  }
          
          if (msg.includes("pembuatan barang jadi tekstil untuk keperluar rumah tangga") || msg.includes("pembuatan selimut")|| msg.includes("pembuatan seprei") || msg.includes("pembuatan taplak meja") || msg.includes("pembuatan sarung bantal")|| msg.includes("pembuatan gorden") || msg.includes("pembuatan handuk") ) {
            return `<strong>13921 - INDUSTRI BARANG JADI TEKSTIL UNTUK KEPERLUAN RUMAH TANGGA</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan barang-barang jadi tekstil, seperti selimut, seprei, taplak meja, sarung bantal, bed cover, gorden, handuk, sarung alas kursi, sajadah/penutup lantai yang dibuat dengan proses penggabungan dan/atau penjahitan beberapa bahan tekstil, selubung mobil dan selimut listrik dan lain-lain. Sajadah/penutup lantai dari karpet/permadani dimasukkan dalam kelompok 13930.`;
                  }

          if (msg.includes("pembuatan barang jadi tekstil sulaman") || msg.includes("pembuatan barang sulaman")|| msg.includes("produksi barang sulaman") || msg.includes("pembuatan pakaian sulaman") || msg.includes("produksi pakaian sulaman ") ) {
            return `<strong>13922 - INDUSTRI BARANG JADI TEKSTIL SULAMAN</strong><br><br>
                    Kelompok ini mencakup usaha barang jadi tekstil sulaman, baik yang dikerjakan dengan tangan maupun dengan mesin, seperti pakaian/barang jadi sulaman dan badge.`;
                  }

          if (msg.includes("pembuatan tenda") || msg.includes("pembuatan bendera")|| msg.includes("pembuatan terpal") || msg.includes("pembuatan parasut") || msg.includes("produksi tenda")|| msg.includes("produksi bendera") || msg.includes("produksi terpal") ) {
            return `<strong>13929 - INDUSTRI BARANG JADI TEKSTIL LAINNYA</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan barang jadi tekstil lainnya, seperti layar, tenda, bendera, terpal, parasut, pelampung/jaket penyelamat dan lain-lain: lap pembersih, serbet piring dan barang perlengkapan sejenisnya dan lain-lain.`;
                  }

          if (msg.includes("pembuatan karpet") || msg.includes("pembuatan permadani")|| msg.includes("pembuatan sajadah") || msg.includes("produksi karpet") || msg.includes("produksi permadani")|| msg.includes("produksi sajadah") ) {
            return `<strong>13930 - INDUSTRI KARPET DAN PERMADANI</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan karpet, permadani, sajadah, dan sejenisnya yang terbuat dari serat, baik serat alam, sintetis maupun serat campuran, baik yang dikerjakan dengan proses tenun (woven), tufting, braiding, flocking dan needle punching. Termasuk industri penutup lantai dari lakan atau bulu kempa yang dibuat dengan jarum tenun. Karpet yang terbuat dari bahan-bahan gabus, karet atau plastik masing-masing dimasukkan dalam kelompok 16299, 22191 atau 22210. Sajadah/penutup lantai yang dibuat dengan proses penggabungan dan/atau penjahitan beberapa bahan tekstil dimasukkan dalam kelompok 13921. Kain alas lantai dengan lapisan permukaan keras dimasukkan dalam kelompok 13999.`;
                  }

          if (msg.includes("pembuatan karpet") || msg.includes("pembuatan permadani")|| msg.includes("pembuatan sajadah") || msg.includes("produksi karpet") || msg.includes("produksi permadani")|| msg.includes("produksi sajadah") ) {
            return `<strong>13930 - INDUSTRI KARPET DAN PERMADANI</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan karpet, permadani, sajadah, dan sejenisnya yang terbuat dari serat, baik serat alam, sintetis maupun serat campuran, baik yang dikerjakan dengan proses tenun (woven), tufting, braiding, flocking dan needle punching. Termasuk industri penutup lantai dari lakan atau bulu kempa yang dibuat dengan jarum tenun. Karpet yang terbuat dari bahan-bahan gabus, karet atau plastik masing-masing dimasukkan dalam kelompok 16299, 22191 atau 22210. Sajadah/penutup lantai yang dibuat dengan proses penggabungan dan/atau penjahitan beberapa bahan tekstil dimasukkan dalam kelompok 13921. Kain alas lantai dengan lapisan permukaan keras dimasukkan dalam kelompok 13999.`;
                  }

          if (msg.includes("usaha konveksi") || msg.includes("konveksi pakaian")|| msg.includes("usaha konveksi kemeja") || msg.includes("usaha konveksi pakaian") || msg.includes("usaha konveksi pakaian olahraga")|| msg.includes("produksi sajadah") ) {
            return `<strong>14111 - INDUSTRI PAKAIAN JADI (KONVEKSI) DARI TEKSTIL</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan pakaian jadi (konveksi) dari tekstil/kain (tenun maupun rajutan) dengan cara memotong dan menjahit sehingga siap dipakai, seperti kemeja, celana, kebaya, blus, rok, baju bayi, pakaian tari dan pakaian olahraga.`;
                  }

          if (msg.includes("usaha penjahitan") || msg.includes("penjahit pakaian")|| msg.includes("jasa jahit pakaian") || msg.includes("jasa penjahit") || msg.includes("penjahit baju")|| msg.includes("jasa jahit baju") ) {
            return `<strong>14120 - PENJAHITAN DAN PEMBUATAN PAKAIAN SESUAI PESANAN</strong><br><br>
                    Kelompok ini mencakup usaha penjahitan dan pembuatan pakaian sesuai pesanan yang melayani masyarakat umum dengan tujuan komersil.`;
                  }

          if (msg.includes("produksi mukena") || msg.includes("pembuatan mukena")|| msg.includes("produksi topi") || msg.includes("produksi kerudung") || msg.includes("usaha produksi mukena")|| msg.includes("usaha produksi kerudung") || msg.includes("usaha pembuatan mukena") || msg.includes("usaha pembuatan topi") || msg.includes("produksi kerudung")) {
            return `<strong>14131 - INDUSTRI PERLENGKAPAN PAKAIAN DARI TEKSTIL</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan perlengkapan pakaian jadi (konveksi) tekstil dan dari kain dengan cara memotong dan menjahit sehingga siap dipakai, seperti topi, peci, dasi, sarung tangan, mukena, selendang, kerudung, ikat pinggang, syal, bando, dasi tuksedo, jaring rambut, dan lain-lain, baik dari kain tenun maupun kain rajut yang dijahit. Termasuk industri alas kaki dari bahan kain tanpa sol dan bagian-bagian dari produk yang disebutkan sebelumnya.`;
                  }

          if (msg.includes("produksi baju kaos") || msg.includes("pembuatan baju kaos") || msg.includes("usaha produksi baju kaos") || msg.includes("usaha pembuatan baju kaos") || msg.includes("produksi sweater") || msg.includes("pembuatan sweater") || msg.includes("usaha produksi sweater") || msg.includes("usaha pembuatan sweater") || msg.includes("produksi kardigan rajut") || msg.includes("pembuatan kardigan rajut") || msg.includes("usaha produksi kardigan rajut") || msg.includes("usaha pembuatan kardigan rajut")) {
            return `<strong>14301 - INDUSTRI PAKAIAN JADI RAJUTAN</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan pakaian jadi, seperti sweater, kardigan, baju kaos, mantel, dan barang sejenisnya, termasuk topi yang dibuat dengan cara dirajut ataupun renda, kecuali industri rajutan kaos kaki.`;
                  }

          if (msg.includes("produksi kaos kaki") || msg.includes("pembuatan kaos kaki") || msg.includes("usaha produksi kaos kaki") || msg.includes("usaha pembuatan kaos kaki")) {
            return `<strong>14303 - INDUSTRI RAJUTAN KAOS KAKI DAN SEJENISNYA</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan kaos kaki yang dibuat dengan cara rajut ataupun renda, seperti kaos kaki, termasuk kaos kaki, stocking, pantyhose.`;
                  }

          if (msg.includes("usaha mebel") || msg.includes("pembuatan meja") || msg.includes("usaha pembuatan meja") || msg.includes("usaha pembuatan kursi") || msg.includes("pembuatan kursi") || msg.includes("usaha pembuatan bangku") || msg.includes("usaha pembuatan lemari") || msg.includes("pembuatan bangku") || msg.includes("usaha pembuatan bangku") || msg.includes("usaha pembuatan lemari")) {
            return `<strong>31001 - INDUSTRI FURNITUR DARI KAYU</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan furnitur dari kayu untuk rumah tangga dan kantor, seperti meja, kursi, bangku, tempat tidur, lemari, rak, kabinet, penyekat ruangan dan sejenisnya.`;
                  }

          if (msg.includes("minimarket") || msg.includes("Minimarket")|| msg.includes("supermarket")|| msg.includes("Supermarket")) {
            return `<strong>47111 - PERDAGANGAN ECERAN BERBAGAI MACAM BARANG YANG UTAMANYA MAKANAN, MINUMAN ATAU TEMBAKAU DI MINIMARKET/SUPERMARKET</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran berbagai jenis barang kebutuhan yang utamanya bahan makanan/makanan, minuman atau tembakau dengan harga yang sudah ditentukan serta pembeli mengambil dan membayar sendiri kepada kasir (self service/swalayan). Disamping itu juga dapat menjual beberapa barang bukan makanan seperti perabot rumah tangga, mainan anak-anak, dan pakaian. Misalnya minimarket atau supermarket atau hypermarket.`;
          }

          if (msg.includes("sembako") || msg.includes("toko sembako") || msg.includes("warung sembako")) {
            return `<strong>47112 - PERDAGANGAN ECERAN BERBAGAI MACAM BARANG YANG UTAMANYA MAKANAN, MINUMAN ATAU TEMBAKAU BUKAN DI MINIMARKET/SUPERMARKET/HYPERMARKET (TRADISIONAL)</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran berbagai jenis barang kebutuhan yang utamanya bahan makanan/makanan, minuman atau tembakau di dalam bangunan bukan swalayan/minimarket/supermarket. Disamping itu juga dapat menjual beberapa barang bukan makanan seperti pakaian, perabot rumah tangga, dan mainan anak. Misalnya warung atau toko bahan kebutuhan pokok.`;
          }

          if (msg.includes("toserba") || msg.includes("toko serba ada")) {
            return `<strong>47191 - PERDAGANGAN ECERAN BERBAGAI MACAM BARANG YANG UTAMANYA BUKAN MAKANAN, MINUMAN ATAU TEMBAKAU DI TOSERBA (DEPARTMENT STORE)</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran berbagai jenis barang yang utamanya bukan makanan, minuman atau tembakau dalam toserba (department store), yang terintegrasi di bawah satu pengelolaan. Pada umumnya barang-barang yang diperdagangkan antara lain pakaian, mebel, perhiasan, mainan anak-anak, alatalat olahraga dan kosmetik.`;
          }

          if (msg.includes("kelontong") || msg.includes("toko kelontong")) {
            return `<strong>47192 - PERDAGANGAN ECERAN BERBAGAI MACAM BARANG YANG UTAMANYA BUKAN MAKANAN, MINUMAN ATAU TEMBAKAU (BARANG-BARANG KELONTONG) BUKAN DI TOSERBA (DEPARTMENT STORE)</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran berbagai jenis barang yang utamanya bukan makanan, minuman atau tembakau bukan toserba/department store. Pada umumnya barang-barang yang diperdagangkan antara lain pakaian, perabot rumah tangga, perhiasan, mainan anak-anak dan kosmetik, yang terintegrasi di bawah satu pengelolaan. Misalnya toko barang kelontong.`;
          }

          if (msg.includes("penjual buah-buahan") || msg.includes("pedagang buah-buahan")) {
            return `<strong>47212 - PERDAGANGAN ECERAN BUAH-BUAHAN</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran khusus buah-buahan di dalam bangunan, seperti apel, anggur, alpokat, belimbing, duku, durian, jambu, jeruk, mangga, manggis, nanas, pisang, pepaya, rambutan, sawo, salak dan semangka.`;
          }

          if (msg.includes("penjual sayuran") || msg.includes("pedagang sayuran")) {
            return `<strong>47212 - PERDAGANGAN ECERAN SAYURAN</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran khusus sayuran di dalam bangunan, seperti bawang merah, bawang putih, kentang, wortel, terong, buncis, mentimun, labu siam, kacang panjang dan kacang merah.`;
          }

          if (msg.includes("penjual telur") || msg.includes("pedagang telur") || msg.includes("penjual susu") || msg.includes("pedagang susu") || msg.includes("penjual daging") || msg.includes("pedagang daging")) {
            return `<strong>47214 - PERDAGANGAN ECERAN HASIL PETERNAKAN</strong><br><br>
            Kelompok ini mencakup usaha perdagangan eceran khusus hasil peternakan di dalam bangunan, seperti susu dan telur, termasuk pula daging ternak dan unggas.`;
          }

          if (msg.includes("usaha kontrakan") || msg.includes("usaha kost") || msg.includes("usaha kos-kosan") || msg.includes("sewa kontrakan") || msg.includes("sewa ruko") || msg.includes("sewa kos-kosan") || msg.includes("sewa kost")) {
            return `<strong>55900 - PENYEDIAAN AKOMODASI LAINNYA</strong><br><br>
            Kelompok ini mencakup usaha penyediaan jasa pelayanan penginapan dalam periode waktu yang tidak singkat. Termasuk usaha penyediaan akomodasi untuk jangka yang lebih lama atau sementara baik kamar sendiri atau kamar bersama atau asrama untuk pelajar, pekerja musiman dan sejenisnya. Misalnya kegiatan penyediaan akomodasi ini mencakup tempat tinggal pelajar, asrama sekolah, asrama atau pondok pekerja dan rumah kost, baik dengan makan maupun tidak dengan makan.`;
          }

          if (msg.includes("usaha warung makan") || msg.includes("usaha rumah makan") || msg.includes("usaha tempat makan") || msg.includes("warung makan") || msg.includes("penjual nasi dan lauk pauk") || msg.includes("rumah makan")) {
            return `<strong>56102 - RUMAH/WARUNG MAKAN</strong><br><br>
            Kelompok ini mencakup jenis usaha jasa penyediaan makanan dan minuman untuk dikonsumsi di tempat usahanya yang bertempat di sebagian atau seluruh bangunan tetap (tidak berpindah-pindah), yang menyajikan makanan dan minuman di tempat usahanya.`;
          }

          if (msg.includes("usaha nasi goreng") || msg.includes("usaha pecel lele") || msg.includes("usaha nasi to") || msg.includes("nasi goreng") || msg.includes("pecel lele") || msg.includes("nasi to") || msg.includes("penjual nasi kuning") || msg.includes("penjual nasi to") || msg.includes("penjual nasi goreng") || msg.includes("penjual pecel lele") || msg.includes("penjual bubur")  || msg.includes("penjual baso") || msg.includes("penjual mie ayam") || msg.includes("penjual sate") || msg.includes("penjual soto") || msg.includes("penjual usus ayam")) {
            return `<strong>56103 - KEDAI MAKANAN</strong><br><br>
            Kelompok ini mencakup usaha jasa pangan yang menjual dan menyajikan makanan siap dikonsumsi yang melalui proses pembuatan di tempat tetap yang dapat dipindahpindahkan atau dibongkar pasang, biasanya dengan menggunakan tenda, seperti kedai seafood, pecel ayam dan lain-lain.`;
          }

          if (msg.includes("usaha warung kopi") || msg.includes("warung kopi") || msg.includes("usaha caffe") || msg.includes("caffe") || msg.includes("usaha kafe") || msg.includes("kafe")) {
            return `<strong>56303 - RUMAH/WARUNG MAKAN</strong><br><br>
            Kelompok ini mencakup jenis usaha penyediaan utamanya minuman baik panas maupun dingin dikonsumsi di tempat usahanya, bertempat di sebagian atau seluruh bangunan permanen, baik dilengkapi dengan peralatan/perlengkapan untuk proses pembuatan dan penyimpanan maupun tidak dan baik telah mendapatkan surat keputusan sebagai rumah minum dari instansi yang membinanya maupun belum.`;
          }

          if (msg.includes("usaha nasi goreng keliling") || msg.includes("usaha cilok keliling") || msg.includes("usaha pempek") || msg.includes("nasi goreng keliling") || msg.includes("cilok") || msg.includes("pempek") || msg.includes("penjual nasi kuning") || msg.includes("penjual pempek") || msg.includes("penjual nasi goreng keliling") || msg.includes("penjual cilok keliling") || msg.includes("penjual bubur keliling")  || msg.includes("penjual baso keliling") || msg.includes("penjual mie ayam keliling") || msg.includes("penjual sate keliling") || msg.includes("penjual cimol keliling") ) {
            return `<strong>56103 - KEDAI MAKANAN</strong><br><br>
            Kelompok ini mencakup usaha jasa pangan yang menjual dan menyajikan makanan siap dikonsumsi yang melalui proses pembuatan di tempat tetap yang dapat dipindahpindahkan atau dibongkar pasang, biasanya dengan menggunakan tenda, seperti kedai seafood, pecel ayam dan lain-lain.`;
          }

          // Default response
          return `Maaf, saya belum memahami pertanyaan Anda dengan baik. 😅<br><br>
                Silakan pilih dari pertanyaan yang tersedia di menu cepat, atau coba tanyakan tentang:<br>
                • NIB (Nomor Induk Berusaha)<br>
                • Sertifikat Halal<br>
                • KBLI<br>
                • Program Bantuan UMKM<br>
                • Statistik UMKM<br><br>
                Atau ketik pertanyaan dengan kata kunci yang lebih spesifik ya! 🤖`;
        }

        // Add typing indicator
        function showTypingIndicator() {
          const messagesContainer = document.getElementById("chatbotMessages");
          if (!messagesContainer) {
            console.error("Element chatbotMessages tidak ditemukan");
            return;
          }
          
          const typingDiv = document.createElement("div");
          typingDiv.className = "message bot typing-indicator";
          typingDiv.id = "typing-indicator";

          const bubbleDiv = document.createElement("div");
          bubbleDiv.className = "message-bubble";
          bubbleDiv.innerHTML = "💭 Sedang mengetik...";

          typingDiv.appendChild(bubbleDiv);
          messagesContainer.appendChild(typingDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTypingIndicator() {
          const indicator = document.getElementById("typing-indicator");
          if (indicator) {
            indicator.remove();
          }
        }

        // Function to toggle quick questions
        function toggleQuestions() {
          const quickQuestions = document.getElementById("quickQuestions");
          if (!quickQuestions) {
            console.error("Element quickQuestions tidak ditemukan");
            return;
          }
          
          const isExpanded = quickQuestions.classList.contains("expanded");

          if (isExpanded) {
            quickQuestions.classList.remove("expanded");
            quickQuestions.classList.add("collapsed");
          } else {
            quickQuestions.classList.remove("collapsed");
            quickQuestions.classList.add("expanded");
          }
        }

        // Auto-collapse questions after user sends a message
        function autoCollapseQuestions() {
          const quickQuestions = document.getElementById("quickQuestions");
          if (quickQuestions && quickQuestions.classList.contains("expanded")) {
            setTimeout(() => {
              quickQuestions.classList.remove("expanded");
              quickQuestions.classList.add("collapsed");
            }, 1000);
          }
        }

        // Chatbot animations and effects
        document.addEventListener("DOMContentLoaded", function () {
          console.log("DOM loaded, initializing chatbot...");
          
          // Set initial state ke expanded
          const quickQuestions = document.getElementById("quickQuestions");
          if (quickQuestions) {
            quickQuestions.classList.add("expanded");
            console.log("Quick questions initialized");
          } else {
            console.error("quickQuestions element tidak ditemukan");
          }

          // Add welcome message animation
          setTimeout(() => {
            const firstMessage = document.querySelector(".message.bot .message-bubble");
            if (firstMessage) {
              firstMessage.style.animation = "fadeInUp 0.5s ease";
            }
          }, 500);

          // Add floating animation to chatbot button
          const chatbotToggle = document.querySelector(".chatbot-toggle");
          if (chatbotToggle) {
            setInterval(() => {
              chatbotToggle.style.transform = "translateY(-2px) scale(1.02)";
              setTimeout(() => {
                chatbotToggle.style.transform = "translateY(0) scale(1)";
              }, 1000);
            }, 3000);
          }
        });

        // Add CSS for chatbot animations
        const chatbotStyle = document.createElement("style");
        chatbotStyle.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .typing-indicator .message-bubble {
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                
                .question-button {
                    position: relative;
                    overflow: hidden;
                }
                
                .question-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s ease;
                }
                
                .question-button:hover::before {
                    left: 100%;
                }
            `;
        document.head.appendChild(chatbotStyle);

        // Test function - untuk debug
        function testChatbot() {
          console.log("Testing chatbot elements:");
          console.log("chatbotWindow:", document.getElementById("chatbotWindow"));
          console.log("chatInput:", document.getElementById("chatInput"));
          console.log("chatbotMessages:", document.getElementById("chatbotMessages"));
          console.log("quickQuestions:", document.getElementById("quickQuestions"));
        }

        // Fungsi untuk membuka chatbot dari tombol "Mulai Chat Sekarang"
        function openChatbot() {
          const chatbotWindow = document.getElementById("chatbotWindow");
          if (chatbotWindow) {
            // Jika chatbot window sudah ada, langsung tampilkan
            chatbotWindow.classList.add("active");
          } else {
            // Jika belum ada, toggle chatbot (akan membuat window baru)
            toggleChatbot();
          }
          
          // Focus pada input setelah chatbot terbuka
          setTimeout(() => {
            const chatInput = document.getElementById("chatInput");
            if (chatInput) {
              chatInput.focus();
            }
          }, 300);
        }

        // Highlight otomatis berdasarkan parameter di URL (contoh: ?search=bakul)
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search");

  if (searchTerm) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = searchTerm;
    }
    removeHighlights();
    searchAndHighlight(searchTerm.toLowerCase());
  }
});
