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

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    closeSidebar();
  }
});

// Chart options with integrated legends
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // This makes it horizontal
  plugins: {
    legend: {
      display: false // Hide legend for horizontal bar chart
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return 'UMKM ' + context.parsed.x.toLocaleString('id-ID');
        }
      }
    },
    // Add value labels plugin specifically for bar chart
    valueLabels: {
      display: true
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: 'rgba(75, 57, 36, 0.1)'
      },
      ticks: {
        color: '#4b3924',
        font: {
          size: 12
        },
        callback: function(value) {
          return '' + value.toLocaleString('id-ID');
        }
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        color: '#4b3924',
        font: {
          size: 11
        }
      }
    }
  },
  layout: {
    padding: {
      left: 30,
      right: 30
    }
  },
  onHover: (event, activeElements) => {
    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
  }
};

// Add value labels plugin specifically for bar charts only
Chart.register({
  id: 'valueLabels',
  afterDatasetsDraw: function(chart) {
    // Check if this is a bar chart and if value labels are enabled
    if (chart.config.type === 'bar' && 
        chart.config.options.plugins.valueLabels && 
        chart.config.options.plugins.valueLabels.display) {
      
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar, index) => {
          const data = dataset.data[index];
          ctx.fillStyle = '#4b3924';
          ctx.font = window.innerWidth < 480 ? '10px Arial' : '12px Arial';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            ' ' + data.toLocaleString('id-ID'),
            bar.x + 5,
            bar.y
          );
        });
      });
    }
  }
});

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // We'll use custom legend
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed;
          return label + ': ' + value + '%';
        }
      }
    }
  },
  onHover: (event, activeElements) => {
    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
  }
};

const doughnutOptions = {
  responsive: false,
  maintainAspectRatio: false,
  cutout: '50%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        font: {
          size: 11,
          weight: 600
        },
        color: '#4b3924'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return context.label + ': ' + context.parsed + 'UMKM';
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

// Plugin untuk label di donut chart (diperbaiki agar lebih tengah)
const doughnutLabelsPlugin = {
  id: 'labelInsideSlice',
  afterDatasetDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    const total = dataset.data.reduce((a, b) => a + b, 0);

    ctx.save();
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    meta.data.forEach((arc, i) => {
      const angle = (arc.startAngle + arc.endAngle) / 2;
      // Posisi lebih presisi di tengah slice
      const radius = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.5;
      const x = chart.chartArea.left + (chart.chartArea.width / 2) + radius * Math.cos(angle);
      const y = chart.chartArea.top + (chart.chartArea.height / 2) + radius * Math.sin(angle);

      const value = dataset.data[i];
      const percent = Math.round((value / total) * 100);

      // Hanya tampilkan label jika persentase >= 3%
      if (percent >= 3) {
        ctx.fillText(`${value}`, x, y - 7);
        ctx.fillText(`(${percent}%)`, x, y + 7);
      }
    });

    ctx.restore();
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // ===== HIDE TABLE SECTION BY DEFAULT =====
  const tableSection = document.getElementById('table-section');
  const downloadSection = document.getElementById('download-section');
  const paginationContainer = document.getElementById('pagination-container');
  
  // Hide table-related elements on page load
  if (tableSection) {
    tableSection.style.display = 'none';
  }
  if (downloadSection) {
    downloadSection.style.display = 'none';
  }
  if (paginationContainer) {
    paginationContainer.style.display = 'none';
  }
  
  // Set initial message for data info
  const dataInfo = document.getElementById('data-info');
  if (dataInfo) {
    dataInfo.textContent = 'Silakan terapkan filter untuk menampilkan data UMKM';
    dataInfo.className = 'text-gray-500 text-sm text-center py-4';
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  // Charts will automatically resize due to responsive: true option
});

// Animate numbers on page load
function animateNumbers() {
  const statsElements = [
    { element: document.getElementById('aktif-umkm'), target: 22 },
    { element: document.getElementById('total-umkm'), target: 25 },
    { element: document.getElementById('total-rw'), target: 19},
    { element: document.getElementById('total-pemilik'), target: 25 }
  ];

  statsElements.forEach(({ element, target }) => {
    if (element) {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 30);
    }
  });
}



let UMKM_DATA = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

const supabaseUrl = 'https://gykbniseplrqvrnabzdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24i';
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey);

async function fetchUMKMData() {
  const { data, error } = await supabase
    .from('db_umkm') // GANTI dengan nama tabel UMKM di Supabase
    .select('*');

  if (error) {
    console.error('Error fetching data from Supabase:', error);
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
    
    // ===== DON'T RENDER TABLE ON INITIAL LOAD =====
    // renderTable(filteredData, currentPage); // REMOVED THIS LINE
    
    const sudahPelatihan = UMKM_DATA.filter(
      d => d.status_plt?.toString().trim().toLowerCase() === "pernah"
    ).length;

    const belumPelatihan = UMKM_DATA.length - sudahPelatihan;

    const doughnutData = {
      labels: ['Sudah Pelatihan', 'Belum Pelatihan'],
      datasets: [{
        data: [sudahPelatihan, belumPelatihan],
        backgroundColor: ['#A67C52', '#D7C0A6'],
        borderColor: ['#A67C52', '#D7C0A6'],
        borderWidth: 2
      }]
    };

    const totalHalal = UMKM_DATA.filter(
  d => d.status_plt?.toLowerCase().trim() === "pernah"
).length;

const belumHalal = UMKM_DATA.filter(
  d => d.status_plt?.toLowerCase().trim() === "belum pernah"
).length;

document.getElementById("halal-certified").textContent = totalHalal;
document.getElementById("no-halal-cert").textContent = belumHalal;



    // Hitung jumlah UMKM berdasarkan kategori dinamis
    const categoryCounts = {};
    UMKM_DATA.forEach(item => {
      const kategori = item.kategori?.trim();
      if (kategori) {
        categoryCounts[kategori] = (categoryCounts[kategori] || 0) + 1;
      }
    });



    // Urutkan kategori dari jumlah terbanyak ke terkecil
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const labels = sortedCategories.map(([k]) => k);
    const dataChart = sortedCategories.map(([_, v]) => v);

    // Update deskripsi UMKM Unggulan dari data status NIB
    const total = UMKM_DATA.length;
    const memiliki = UMKM_DATA.filter(d => d.status_nib?.toLowerCase().trim() === "sudah memiliki").length;
    const belum = total - memiliki;
    const persenMemiliki = ((memiliki / total) * 100).toFixed(1);
    const persenBelum = (100 - persenMemiliki).toFixed(1);
    const summaryText = `
      Berdasarkan data yang terhimpun, <strong>UMKM unggulan</strong> di Kelurahan Kahuripan dikategorikan berdasarkan kelengkapan surat keterangan usaha, 
      yaitu <strong>${persenMemiliki}%</strong> sudah memiliki Surat Keterangan Usaha dan <strong>${persenBelum}%</strong> belum memiliki. 
      Informasi ini dapat digunakan sebagai dasar pengembangan program legalitas UMKM.
    `;
    
    // Warna
    const backgroundColor = [
      '#4E342E', '#6D4C41', '#8D6E63', '#A1887F', '#5D4037', '#795548', '#3E2723', 
      '#A0522D', '#7B3F00', '#C49E8A', '#A9746E', '#B86B40', '#D2691E', '#996633', '#8B5A2B'
    ];

    const borderColor = backgroundColor.map(() => '#ffffff');

    if (window.kategoriPieChart) {
      window.kategoriPieChart.destroy();
    }

    document.getElementById("nib-summary").innerHTML = summaryText;

    // === PIE CHART NIB START ===
    const pieLabels = ['Unggulan', 'Bukan Unggulan'];
    const pieData = [memiliki, belum];
    const pieBackgroundColor = ['#A67C52', '#D7C0A6'];

    if (window.kategoriPieChart) {
      window.kategoriPieChart.destroy();
    }

    // Membuat doughnut chart dengan plugin yang diperbaiki
    const doughnutCtx = document.getElementById('doughnutChart')?.getContext('2d');
    if (doughnutCtx) {
      if (window.pelatihanDonutChart) {
        window.pelatihanDonutChart.destroy();
      }

      window.pelatihanDonutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: doughnutData,
        options: doughnutOptions,
        plugins: [doughnutLabelsPlugin]
      });
    }

    const persenSudah = ((sudahPelatihan / UMKM_DATA.length) * 100).toFixed(1);

    document.querySelector('.doughnut-chart-info .chart-description p').innerHTML = `
      Sebaran data pada diagram menunjukkan jumlah UMKM yang sudah mengikuti dan belum mengikuti pelatihan. 
      Dari total ${UMKM_DATA.length} UMKM, sebanyak ${sudahPelatihan} UMKM (${persenSudah}%) telah mengikuti pelatihan, 
      sedangkan ${belumPelatihan} UMKM (${persenBelum}%) belum mengikuti pelatihan. 
      Data ini menggambarkan bahwa sebagian besar pelaku UMKM masih belum mendapatkan akses atau kesempatan pelatihan. 
      Hal ini menjadi perhatian penting untuk meningkatkan kapasitas, daya saing, dan kualitas usaha 
      melalui program pelatihan yang lebih merata dan terjangkau.
    `;

    // Membuat pie chart dengan labels angka
    const ctxPie = document.getElementById('pieChart')?.getContext('2d');
    if (ctxPie) {
      window.kategoriPieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: pieBackgroundColor,
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const totalPie = pieData.reduce((a, b) => a + b, 0);
                  const value = context.parsed;
                  const percentage = ((value / totalPie) * 100).toFixed(1);
                  return `${context.label}: ${value} UMKM (${percentage}%)`;
                }
              }
            }
          }
        },
        plugins: [pieLabelsPlugin] // Menambahkan plugin labels
      });
    }

    // Siapkan data bar chart
    const barData = {
      labels: labels,
      datasets: [{
        label: 'Jumlah UMKM',
        data: dataChart,
        backgroundColor: backgroundColor.slice(0, labels.length),
        borderColor: borderColor.slice(0, labels.length),
        borderWidth: 1
      }]
    };

    const ctxBar = document.getElementById('barChart')?.getContext('2d');
    if (ctxBar) {
      if (window.kategoriBarChart) {
        window.kategoriBarChart.destroy();
      }

      window.kategoriBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: barData,
        options: barOptions
      });
    }

    // === Dashboard Stats ===
    document.getElementById('total-umkm').textContent = UMKM_DATA.length;

    const totalSKU = UMKM_DATA.filter(
      d => d.status_nib?.toLowerCase().trim() === "sudah memiliki"
    ).length;

    const belumSKU = UMKM_DATA.filter(
      d => d.status_nib?.toLowerCase().trim() !== "sudah memiliki"
    ).length;

    document.getElementById('umkm-nib').textContent = totalSKU;
    document.getElementById('no-nib-count').textContent = belumSKU;

    const uniqueRW = new Set(UMKM_DATA.map(d => d.rw)).size;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    const dataInfo = document.getElementById('data-info');
    if (dataInfo) {
      dataInfo.textContent = 'Terjadi kesalahan saat memuat data. Silakan refresh halaman.';
      dataInfo.className = 'text-red-500 text-sm text-center py-4';
    }
  });

// Get category styling class
function getCategoryClass(category) {
  const classes = {
    'Kuliner / Makanan & Minuman': 'kuliner',
    'Jasa': 'jasa',
    'Perdagangan Online': 'online',
    'Toko Kelontong / Sembako / Eceran': 'toko',
    'Produksi dan Penjualan Barang': 'produksi',
    'Pertanian & Peternakan': 'pertanian',
    'Pendidikan & Layanan Khusus': 'pendidikan',
    'Kos-kosan / Kontrakan / Penyewaan Properti': 'properti',
    'Jual Pulsa / Produk Digital': 'pulsa',
    'Otomotif / Bengkel': 'otomotif'
  };
  return classes[category] || 'bg-gray-100 text-gray-800';
}

// ===== UPDATED RENDER TABLE FUNCTION =====
function renderTable(data, page = 1) {
  const tbody = document.getElementById('umkm-table-body');
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  if (!tbody) return;

  tbody.innerHTML = pageData.map((item, index) => `
    <tr class="table-row border-b border-gray-100">
      <td class="px-6 py-4 font-medium text-[#6b5842]">${startIndex + index + 1}</td>
      <td class="px-6 py-4 font-medium text-[#6b5842]">${item.nama_usaha}</td>
      <td class="px-6 py-4">
        <span class="px-3 py-1 text-xs font-semibold rounded-full ${getCategoryClass(item.kategori)}">
          ${item.kategori}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.rt}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.rw}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.alamat}</td>
      <td class="px-6 py-4">
        <span class="px-3 py-1 text-xs font-semibold rounded-full ${
          item.status_nib && item.status_nib.toLowerCase() === 'sudah memiliki'
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }">
          ${item.status_nib}
        </span>
      </td>
      <td class="px-6 py-4">
  <span class="px-3 py-1 text-xs font-semibold rounded-full ${
  item.status_plt && item.status_plt.trim().toLowerCase() === 'pernah'
    ? 'bg-green-100 text-green-800'
    : item.status_plt && item.status_plt.trim().toLowerCase() === 'belum pernah'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-200 text-gray-800'
}">
  ${item.status_plt ? item.status_plt.trim() : '-'}
</span>


</td>

    </tr>`).join('');

  renderPagination(data, page);
}

// Function untuk update info data
function updateDataInfo(data, currentPage) {
  const totalData = data.length;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalData);
  
  const dataInfo = document.getElementById('data-info');
  if (totalData === 0) {
    dataInfo.textContent = 'Tidak ada data yang sesuai dengan filter yang dipilih';
    dataInfo.className = 'text-gray-500 text-sm text-center py-4';
  } else {
    dataInfo.textContent = `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
    dataInfo.className = 'text-gray-600 text-sm';
  }
}

// Render pagination
function renderPagination(data, currentPage) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginationNumbers = document.getElementById('pagination-numbers');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const paginationContainer = document.getElementById('pagination-container');

  // Update info data
  updateDataInfo(data, currentPage);

  // Show/hide pagination based on data length
  if (totalPages <= 1) {
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
    return;
  } else {
    if (paginationContainer) {
      paginationContainer.style.display = 'flex';
    }
  }

  // Update button states
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  // Generate page numbers with box styling
  if (paginationNumbers) {
    let paginationHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                onclick="goToPage(${i})">${i}</button>
      `;
    }

    paginationNumbers.innerHTML = paginationHTML;
  }
}

// Go to specific page
function goToPage(page) {
  currentPage = page;
  renderTable(filteredData, currentPage);
}

// Previous page
document.getElementById('prev-page')?.addEventListener('click', () => {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
});

// Next page
document.getElementById('next-page')?.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
});

// ===== UPDATED APPLY FILTERS FUNCTION =====
function applyFilters() {
  const kategoriVal = document.getElementById('kategori-umkm')?.value.trim().toLowerCase();
  const rtVal = document.getElementById('rt')?.value.trim();
  const rwVal = document.getElementById('rw')?.value.trim();
  const skuVal = document.getElementById('status-nib')?.value.trim().toLowerCase();
  const halalVal = document.getElementById('status-halal')?.value.trim().toLowerCase();

  console.log("Applying filters:", { kategoriVal, rtVal, rwVal, skuVal, halalVal });

  filteredData = UMKM_DATA.filter(item => {
  const kategoriOk = !kategoriVal || kategoriVal === 'all' ||
  (item.kategori && kategoriVal.includes(item.kategori.toLowerCase().trim())) ||
  (item.kategori && item.kategori.toLowerCase().trim().includes(kategoriVal));

  const rtOk = rtVal === 'all' || String(item.rt).trim() === rtVal;
  const rwOk = rwVal === 'all' || String(item.rw).trim() === rwVal;

  const skuOk = skuVal === 'all' || 
    (item.status_nib && item.status_nib.toLowerCase().trim().includes(skuVal));

  const halalOk = halalVal === 'all' ||
    (halalVal === 'pernah'
      ? item.status_plt && item.status_plt.toLowerCase().trim().includes('pernah')
      : item.status_plt && item.status_plt.toLowerCase().trim().includes('belum'));

  return kategoriOk && rtOk && rwOk && skuOk && halalOk;
});



  // ===== SHOW TABLE SECTION WHEN FILTERS ARE APPLIED =====
  const tableSection = document.getElementById('table-section');
  const downloadSection = document.getElementById('download-section');
  
  if (tableSection) {
    tableSection.style.display = 'block';
  }
  
  // Show download section only if there's data
  if (downloadSection) {
    downloadSection.style.display = filteredData.length > 0 ? 'block' : 'none';
  }

  currentPage = 1;
  
  if (filteredData.length > 0) {
    renderTable(filteredData, currentPage);
  } else {
    // Show "no data" message
    const tbody = document.getElementById('umkm-table-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-8 text-center text-gray-500">
            <div class="flex flex-col items-center">
              <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-lg font-medium">Tidak ada data yang sesuai dengan filter</p>
              <p class="text-sm mt-1">Coba ubah kriteria filter untuk mendapatkan hasil</p>
            </div>
          </td>
        </tr>
      `;
    }
    
    // Hide pagination when no data
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
    
    // Update data info
    const dataInfo = document.getElementById('data-info');
    if (dataInfo) {
      dataInfo.textContent = 'Tidak ada data yang sesuai dengan filter yang dipilih';
      dataInfo.className = 'text-gray-500 text-sm text-center py-4';
    }
  }
}

// Reset filters
function resetFilters() {
  // Reset form
  const filterForm = document.getElementById('filter-form');
  if (filterForm) {
    filterForm.reset();
  }
  
  // Reset filtered data
  filteredData = [...UMKM_DATA];
  currentPage = 1;
  
  // ===== HIDE TABLE SECTION WHEN FILTERS ARE RESET =====
  const tableSection = document.getElementById('table-section');
  const downloadSection = document.getElementById('download-section');
  const paginationContainer = document.getElementById('pagination-container');
  
  if (tableSection) {
    tableSection.style.display = 'none';
  }
  if (downloadSection) {
    downloadSection.style.display = 'none';
  }
  if (paginationContainer) {
    paginationContainer.style.display = 'none';
  }
  
  // Reset data info message
  const dataInfo = document.getElementById('data-info');
  if (dataInfo) {
    dataInfo.textContent = 'Silakan terapkan filter untuk menampilkan data UMKM';
    dataInfo.className = 'text-gray-500 text-sm text-center py-4';
  }
}

// Event listeners for filter form
document.getElementById('filter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  applyFilters();
});

document.getElementById('filter-form')?.addEventListener('reset', () => {
  setTimeout(resetFilters, 50); // Small delay to ensure form is reset first
});

// Chatbot functionality
function makeLinksClickable(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank" class="clickable-link">${url}</a>`;
  });
}

function toggleChatbot() {
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

  // Add makeLinksClickable for bot messages
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

    // Auto-collapse questions after selection
    autoCollapseQuestions();
  }, 1500);
}

function getBotResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes("halo") || msg.includes("hai") || msg.includes("selamat")) {
    return "Halo! 👋 Selamat datang di BAKUL KAHURIPAN. Saya siap membantu Anda dengan informasi seputar UMKM, NIB, sertifikat halal, dan layanan lainnya. Ada yang bisa saya bantu?";
  }

  if (msg.includes("nib") || msg.includes("nomor induk berusaha")) {
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

  if (msg.includes("kbli") || msg.includes("klasifikasi")) {
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
            • Total UMKM: ${UMKM_DATA.length} usaha<br>
            • Yang sudah memiliki NIB: ${UMKM_DATA.filter(d => d.status_nib?.toLowerCase().includes('sudah')).length} usaha<br>
            • Kategori terbanyak: Kuliner<br>
            • Tersebar di berbagai RT dan RW<br><br>
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
          
          if (msg.includes("pembuatan kue basah")|| msg.includes("produksi kue basah") || msg.includes("penjual kue basah")) {
            return `<strong>10792 - INDUSTRI KUE BASAH</strong><br><br>
                    Kelompok ini mencakup usaha pembuatan macam-macam makanan kue basah, yaitu sejenis kue yang relatif tidak tahan lama, seperti wajik, lemper, kue lapis, lumpia, dan martabak (termasuk pembuatan tape dan lempok)`;
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
  
  // Set initial state to expanded
  const quickQuestions = document.getElementById("quickQuestions");
  if (quickQuestions) {
    quickQuestions.classList.add("expanded");
    console.log("Quick questions initialized");
  } else {
    console.error("quickQuestions element not found");
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
let highlightedMatches = [];
let currentHighlightIndex = 0;

function goToNextHighlight() {
  if (highlightedMatches.length === 0) return;

  highlightedMatches.forEach(el => el.classList.remove("current"));

  currentHighlightIndex = (currentHighlightIndex + 1) % highlightedMatches.length;
  const target = highlightedMatches[currentHighlightIndex];

  if (target) {
    target.classList.add("current");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    goToNextHighlight();
  }
});

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  let currentIndex = 0;
  let highlights = [];
  let umkmDataGlobal = [];

  // Ambil data
  function removeHighlights() {
    const highlightedElements = document.querySelectorAll(".highlight");
    highlightedElements.forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    highlights = [];
    currentIndex = 0;
  }

  function searchAndHighlight(keyword) {
    removeHighlights();
    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode;
      const value = node.nodeValue;
      const index = value.toLowerCase().indexOf(keyword.toLowerCase());

      if (index !== -1 && node.parentNode) {
        const span = document.createElement("span");
        span.className = "highlight";
        span.textContent = value.substr(index, keyword.length);

        const after = node.splitText(index);
        after.nodeValue = after.nodeValue.substring(keyword.length);
        node.parentNode.insertBefore(span, after);
        highlights.push(span);
      }
    }
  }

  function goToNextHighlight() {
    if (highlights.length === 0) return;

    highlights.forEach(span => span.classList.remove("current-highlight"));
    highlights[currentIndex].classList.add("current-highlight");
    highlights[currentIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    currentIndex = (currentIndex + 1) % highlights.length;
  }

  function tampilkanUMKM(data, keyword) {
    const hasilDiv = document.getElementById("hasilPencarian");
    hasilDiv.innerHTML = "";

    if (data.length === 0) {
      hasilDiv.innerHTML = keyword ? "<p>Tidak ditemukan hasil.</p>" : "";
      return;
    }

    data.forEach(umkm => {
      const div = document.createElement("div");
      div.classList.add("hasil-item");
      div.innerHTML = `<h4>${umkm.nama_usaha}</h4><p>${umkm.alamat}</p><p>${umkm.kategori}</p>`;
      hasilDiv.appendChild(div);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim().toLowerCase();

      if (keyword === "") {
        removeHighlights();
        tampilkanUMKM([], "");
        return;
      }

      searchAndHighlight(keyword);

      const hasil = umkmDataGlobal.filter(umkm =>
        umkm.nama_usaha?.toLowerCase().includes(keyword) ||
        umkm.alamat?.toLowerCase().includes(keyword) ||
        umkm.kategori?.toLowerCase().includes(keyword)
      );

      tampilkanUMKM(hasil, keyword);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goToNextHighlight();
      }
    });
  }
});



/**
 * Display UMKM list based on given data and search keyword.
 *
 * @param {Array} data - Array of UMKM objects to display.
 * @param {string} keyword - Search keyword.
 */
function tampilkanUMKM(data, keyword = "") {
  const umkmList = document.getElementById("umkmList");
  const wrapper = document.getElementById("umkmWrapper");

  if (!umkmList || !wrapper) return;

  // When no search input → hide
  if (keyword.trim() === "") {
    wrapper.classList.add("hidden");
    umkmList.innerHTML = "";
    return;
  }

  // Show wrapper because search is being performed
  wrapper.classList.remove("hidden");

  // No results
  if (data.length === 0) {
    umkmList.innerHTML = `
      <li class="col-span-3 text-center text-gray-500 italic">No results found.</li>
    `;
    return;
  }

  // There are results
  umkmList.innerHTML = data.map(umkm => `
    <li class="bg-white border border-gray-200 rounded-lg p-4 shadow">
      <h4 class="text-lg font-bold text-[#7b603b]">${umkm.nama_usaha}</h4>
      <p class="text-sm text-gray-600">${umkm.alamat ?? '-'}</p>
      <p class="text-xs text-gray-500 italic">${umkm.kategori ?? ''}</p>
    </li>
  `).join('');
}

/**
 * Search and highlight all occurrences of keyword in the document.
 *
 * @param {string} keyword - Keyword to search and highlight.
 */
function searchAndHighlight(keyword) {
  const mainContent = document.body;
  const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
  let firstMatch = null;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue;
    const lowerCaseText = text.toLowerCase();
    let index = lowerCaseText.indexOf(keyword);

    // Skip nodes within highlighted elements to prevent re-highlighting
    if (node.parentNode.classList.contains('highlighted')) {
      continue;
    }

    if (index !== -1) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      while (index !== -1) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));

        const span = document.createElement("span");
        span.className = "highlighted";
        span.textContent = text.substring(index, index + keyword.length);
        fragment.appendChild(span);

        if (!firstMatch) {
          firstMatch = span;
        }

        lastIndex = index + keyword.length;
        index = lowerCaseText.indexOf(keyword, lastIndex);
      }
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));

      node.parentNode.replaceChild(fragment, node);
    }
  }

  // Scroll to first search result if found
  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* Remove all highlights in the document */
function removeHighlights() {
  const highlightedElements = document.querySelectorAll(".highlighted");
  highlightedElements.forEach(el => {
    const parent = el.parentNode;
    // Replace span.highlighted element with its original text
    parent.replaceChild(document.createTextNode(el.textContent), el);
    // Normalize parent node to merge adjacent text nodes
    parent.normalize();
  });
}

// Dropdown functionality
        const downloadBtn = document.getElementById('download-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const dropdownItems = document.querySelectorAll('.dropdown-item');

        // Toggle dropdown
        downloadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            downloadBtn.classList.toggle('open');
        });

        // Handle dropdown item clicks
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const format = this.getAttribute('data-format');
                
                // Close dropdown
                dropdownMenu.classList.remove('show');
                downloadBtn.classList.remove('open');
                
                // Handle download logic
                handleDownload(format);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
            downloadBtn.classList.remove('open');
        });

        // Prevent dropdown from closing when clicking inside
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Download function (customize this according to your needs)
        function handleDownload(format) {
            console.log(`Downloading in ${format.toUpperCase()} format...`);
            
            // Example implementation
            if (format === 'csv') {
                // Your CSV download logic here
                alert('CSV download started!');
                // downloadCSV();
            } else if (format === 'xlsx') {
                // Your Excel download logic here
                alert('Excel download started!');
                // downloadExcel();
            }
        }

// Download functions
function downloadCSV() {
  if (filteredData.length === 0) {
    alert('Tidak ada data untuk diunduh. Silakan terapkan filter terlebih dahulu.');
    return;
  }

  const headers = ['No', 'Nama UMKM', 'Kategori', 'RT', 'RW', 'Alamat Lengkap', 'Status NIB', 'status_plt'];
  const csvContent = [
    headers.join(','),
    ...filteredData.map((item, index) => [
      index + 1,
      `"${item.nama_usaha}"`,
      `"${item.kategori}"`,
      item.rt,
      item.rw,
      `"${item.alamat}"`,
      `"${item.status_nib}"`,
      `"${item.sertif_halal}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `data_umkm_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadXLSX() {
  if (filteredData.length === 0) {
    alert('Tidak ada data untuk diunduh. Silakan terapkan filter terlebih dahulu.');
    return;
  }

  // Check if XLSX library is available
  if (typeof XLSX === 'undefined') {
    alert('Library XLSX tidak tersedia. Silakan gunakan download CSV.');
    return;
  }

  const worksheet_data = [
    ['No', 'Nama UMKM', 'Kategori', 'RT', 'RW', 'Alamat Lengkap', 'Status NIB', 'status_plt'],
    ...filteredData.map((item, index) => [
      index + 1,
      item.nama_usaha,
      item.kategori,
      item.rt,
      item.rw,
      item.alamat,
      item.status_nib,
      item.sertif_halal
    ])
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data UMKM');

  // Style the header row
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell_address = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cell_address]) continue;
    worksheet[cell_address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D7C0A6" } }
    };
  }

  XLSX.writeFile(workbook, `data_umkm_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Add event listeners for download buttons
document.getElementById('download-csv')?.addEventListener('click', downloadCSV);
document.getElementById('download-xlsx')?.addEventListener('click', downloadXLSX);
