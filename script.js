let currentEngine = 'baidu';
let bookmarks = [];
const modal = document.getElementById('modal');

window.onload = function () {
  updateDateTime();
  renderWeather();
  loadBookmarks();
  loadSettings();
  initEventListeners();
  setInterval(updateDateTime, 1000);
};

// === 时间 ===
function updateDateTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' });
  const weekStr = now.toLocaleDateString('zh-CN', { weekday:'long' });
  const timeStr = now.toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  document.getElementById('datetime').textContent = `${dateStr} ${weekStr} ${timeStr}`;
}

// === 天气 ===
async function renderWeather() {
  const weatherEl = document.getElementById('weather');
  weatherEl.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>获取中...</span>';

  const cityMap = {
    Beijing: '北京', Shanghai: '上海', Guangzhou: '广州', Shenzhen: '深圳',
    Hangzhou: '杭州', Chengdu: '成都', Wuhan: '武汉', Xian: '西安',
    Chongqing: '重庆', Tianjin: '天津', Nanjing: '南京', Changsha: '长沙'
  };

  const weatherCodeMap = {
    0: '晴天', 1: '多云', 2: '多云', 3: '阴天',
    45: '雾', 48: '雾', 51: '小雨', 53: '小雨', 55: '中雨',
    61: '小雨', 63: '中雨', 65: '大雨', 71: '小雪', 73: '中雪', 75: '大雪',
    80: '阵雨', 81: '阵雨', 95: '雷阵雨'
  };

  let cityCn = '未知城市';

  try {
    const locRes = await fetch('https://api.ip.sb/geoip/');
    const loc = await locRes.json();
    const cityEn = loc.city || 'Hangzhou';
    const lat = loc.latitude || 30.27;
    const lon = loc.longitude || 120.15;
    cityCn = cityMap[cityEn] || cityEn;

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`);
    const weather = await weatherRes.json();
    const temp = weather.current_weather?.temperature;
    const weatherCode = weather.current_weather?.weathercode;
    const weatherText = weatherCodeMap[weatherCode] || '天气未知';

    weatherEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${cityCn} · ${temp}℃ · ${weatherText}</span>`;
  } catch (err) {
    console.error('天气获取失败', err);
    weatherEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${cityCn} · 天气服务异常</span>`;
  }
}

// === 搜索 ===
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const engineBtns = document.querySelectorAll('.engine-btn');

  engineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      engineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEngine = btn.dataset.engine;
    });
  });

  function doSearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) return;
    let url;
    switch (currentEngine) {
      case 'baidu':
        url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
        break;
      case 'google':
        url = `https://www.sogou.com/web?query=${encodeURIComponent(keyword)}`;
        break;
      case 'bing':
        url = `https://cn.bing.com/search?q=${encodeURIComponent(keyword)}`;
        break;
    }
    window.open(url, '_blank');
    searchInput.value = '';
  }

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keypress', e => e.key === 'Enter' && doSearch());
}

// === 书签 ===
function loadBookmarks() {
  const localData = localStorage.getItem('myNavFinal');
  if (localData) {
    bookmarks = JSON.parse(localData);
  } else {
    bookmarks = [
      { id: 1, name: 'B站', url: 'https://www.bilibili.com', icon: 'fa-play-circle', color: '#fb7299' },
      { id: 2, name: '古德微', url: 'http://gdwrobot.com', icon: 'fa-robot', color: '#2196f3' },
      { id: 3, name: '豆包', url: 'https://www.doubao.com', icon: 'fa-robot', color: '#1677ff' },
      { id: 4, name: '元宝', url: 'https://yuanbao.tencent.com', icon: 'fa-coins', color: '#ffc107' },
      { id: 5, name: '千问', url: 'https://tongyi.aliyun.com', icon: 'fa-brain', color: '#ff7a45' },
      { id: 6, name: 'DeepSeek', url: 'https://www.deepseek.com', icon: 'fa-brain', color: '#165DFF' },
      { id: 7, name: 'Kimi', url: 'https://kimi.moonshot.cn', icon: 'fa-comment-alt', color: '#36BFFA' },
      { id: 8, name: 'GitHub', url: 'https://github.com', icon: 'fa-github', color: '#171515' },
      { id: 9, name: 'AutoDL', url: 'https://www.autodl.com', icon: 'fa-cloud', color: '#1890ff' }
    ];
    saveBookmarksToLocal();
  }
  renderBookmarks();
}

function getFaviconUrl(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`;
  } catch(e) {
    return '';
  }
}

function renderBookmarks() {
  const grid = document.getElementById('bookmarksGrid');
  grid.innerHTML = '';
  bookmarks.forEach(item => {
    const card = document.createElement('a');
    card.href = item.url;
    card.target = '_blank';
    card.className = 'bookmark-card';
    card.innerHTML = `
      <div class="card-row">
        <div class="icon-plate">
          <div class="icon" style="background:${item.color}">
            <img src="${getFaviconUrl(item.url)}" onerror="this.remove()" class="favicon-img" alt="">
            <i class="fas ${item.icon}"></i>
          </div>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="name">${item.name}</div>
    `;
    grid.appendChild(card);
  });
  bindCardActions();
}

function bindCardActions() {
  document.querySelectorAll('.card-actions button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const id = +btn.dataset.id;
      btn.classList.contains('edit-btn') ? openEditModal(id) : deleteBookmark(id);
    });
  });
}

function openModal(isEdit = false, data = null) {
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('bookmarkForm');
  if (isEdit && data) {
    title.textContent = '编辑网址';
    document.getElementById('bookmarkId').value = data.id;
    document.getElementById('bookmarkName').value = data.name;
    document.getElementById('bookmarkUrl').value = data.url;
    document.getElementById('bookmarkIcon').value = data.icon || 'fa-globe';
    document.getElementById('bookmarkColor').value = data.color || '#409eff';
  } else {
    title.textContent = '添加网址';
    form.reset();
    document.getElementById('bookmarkId').value = '';
  }
  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
}

function openEditModal(id) {
  const data = bookmarks.find(item => item.id === id);
  data && openModal(true, data);
}

function saveBookmark(e) {
  e.preventDefault();
  const id = document.getElementById('bookmarkId').value;
  const name = document.getElementById('bookmarkName').value.trim();
  let url = document.getElementById('bookmarkUrl').value.trim();
  const icon = document.getElementById('bookmarkIcon').value;
  const color = document.getElementById('bookmarkColor').value;
  if (!url.startsWith('http')) url = 'https://' + url;

  if (id) {
    const index = bookmarks.findIndex(item => item.id === +id);
    bookmarks[index] = { ...bookmarks[index], name, url, icon, color };
  } else {
    bookmarks.push({ id: Date.now(), name, url, icon: icon || 'fa-globe', color });
  }
  saveBookmarksToLocal();
  renderBookmarks();
  closeModal();
}

function deleteBookmark(id) {
  if (confirm('确定删除？')) {
    bookmarks = bookmarks.filter(item => item.id !== id);
    saveBookmarksToLocal();
    renderBookmarks();
  }
}

function saveBookmarksToLocal() {
  localStorage.setItem('myNavFinal', JSON.stringify(bookmarks));
}

// === 设置 ===
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'auto' && systemDark.matches);
  document.body.className = isDark ? 'dark' : '';
}

function loadSettings() {
  const theme = localStorage.getItem('theme') || 'auto';
  applyTheme(theme);
  const themeBtn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
  if (themeBtn) themeBtn.classList.add('active');

  const fontSize = localStorage.getItem('fontSize') || '16';
  document.documentElement.style.fontSize = `${fontSize}px`;
  const fontBtn = document.querySelector(`.font-btn[data-size="${fontSize}"]`);
  if (fontBtn) fontBtn.classList.add('active');
}

function toggleTheme(theme) {
  applyTheme(theme);
  localStorage.setItem('theme', theme);
}

systemDark.addEventListener('change', () => {
  const theme = localStorage.getItem('theme') || 'auto';
  if (theme === 'auto') applyTheme('auto');
});

function changeFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
  localStorage.setItem('fontSize', size);
}

// === 事件绑定 ===
function initEventListeners() {
  initSearch();

  document.getElementById('addBookmarkBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('bookmarkForm').addEventListener('submit', saveBookmark);

  const settingBtn = document.getElementById('settingBtn');
  const closePanel = document.getElementById('closePanel');
  const panel = document.getElementById('settingsPanel');
  const backdrop = document.getElementById('backdrop');

  function openSettings() {
    panel.classList.add('show');
    backdrop.classList.add('show');
  }
  function closeSettings() {
    panel.classList.remove('show');
    backdrop.classList.remove('show');
  }

  settingBtn.addEventListener('click', openSettings);
  closePanel.addEventListener('click', closeSettings);
  backdrop.addEventListener('click', closeSettings);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toggleTheme(btn.dataset.theme);
    });
  });

  document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      changeFontSize(btn.dataset.size);
    });
  });
}