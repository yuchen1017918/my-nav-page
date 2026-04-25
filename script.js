// 全局变量
let currentEngine = 'baidu';
let bookmarks = [];
const modal = document.getElementById('modal');

// 页面初始化
window.onload = function () {
  updateDateTime();
  renderWeather();
  loadBookmarks();
  loadSettings();
  initEventListeners();
  setInterval(updateDateTime, 1000);
};

// ------------------------------
// 时间模块
// ------------------------------
function updateDateTime() {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  document.getElementById('datetime').textContent = now.toLocaleDateString('zh-CN', options);
}

// ------------------------------
// 天气模块
// ------------------------------
async function renderWeather() {
  const weatherEl = document.getElementById('weather');
  weatherEl.innerHTML = '<i class="fas fa-location-arrow"></i><span>获取中...</span>';

  const cityMap = {
    Beijing: '北京', Shanghai: '上海', Guangzhou: '广州', Shenzhen: '深圳',
    Hangzhou: '杭州', Chengdu: '成都', Wuhan: '武汉', Xian: '西安',
    Chongqing: '重庆', Tianjin: '天津'
  };

  try {
    const locRes = await fetch('https://api.ip.sb/geoip/');
    const loc = await locRes.json();
    const cityEn = loc.city || 'Hangzhou';
    const lat = loc.latitude || 30.27;
    const lon = loc.longitude || 120.15;
    const cityCn = cityMap[cityEn] || cityEn;

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`);
    const weather = await weatherRes.json();
    const temp = weather.current_weather?.temperature || '未知';

    weatherEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${cityCn}·${temp}℃</span>`;
  } catch (err) {
    console.error('天气获取失败', err);
    weatherEl.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>杭州·天气服务异常</span>';
  }
}

// ------------------------------
// 搜索模块
// ------------------------------
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const engineBtns = document.querySelectorAll('.engine-btn');

  // 切换引擎
  engineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      engineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEngine = btn.dataset.engine;
    });
  });

  // 执行搜索
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

// ------------------------------
// 网址收藏模块
// ------------------------------
function loadBookmarks() {
  const localData = localStorage.getItem('myNavFinal');
  if (localData) {
    bookmarks = JSON.parse(localData);
  } else {
    bookmarks = [
      { id: 1, name: '百度', url: 'https://www.baidu.com', icon: 'fa-search', color: '#409eff' },
      { id: 2, name: '淘宝', url: 'https://www.taobao.com', icon: 'fa-shopping-bag', color: '#ff5000' },
      { id: 3, name: '抖音', url: 'https://www.douyin.com', icon: 'fa-music', color: '#000000' },
      { id: 4, name: '知乎', url: 'https://www.zhihu.com', icon: 'fa-book', color: '#0084ff' },
      { id: 5, name: 'B站', url: 'https://www.bilibili.com', icon: 'fa-play-circle', color: '#fb7299' },
      { id: 6, name: '微信', url: 'https://weixin.qq.com/', icon: 'fa-weixin', color: '#07c160' },
      { id: 7, name: '古德微', url: 'http://gdwrobot.com', icon: 'fa-robot', color: '#2196f3' },
      { id: 8, name: '豆包', url: 'https://www.doubao.com/', icon: 'fa-robot', color: '#1677ff' },
      { id: 9, name: '洛谷', url: 'https://www.luogu.com.cn/', icon: 'fa-code', color: '#3498db' },
      { id: 10, name: '元宝', url: 'https://yuanbao.tencent.com/', icon: 'fa-coins', color: '#ffc107' },
      { id: 11, name: '千问', url: 'https://tongyi.aliyun.com/', icon: 'fa-brain', color: '#ff7a45' },
      { id: 12, name: '即梦', url: 'https://jimeng.jianying.com/ai-tool/home/', icon: 'fa-palette', color: '#9c27b0' },
      { id: 13, name: 'GitHub', url: 'https://github.com/', icon: 'fa-github', color: '#171515' },
      { id: 14, name: '凤凰网', url: 'https://www.ifeng.com/', icon: 'fa-globe', color: '#d32f2f' },
      { id: 15, name: '央视网', url: 'https://www.cctv.com/', icon: 'fa-tv', color: '#c8102e' },
      { id: 16, name: '微博', url: 'https://weibo.com/', icon: 'fa-weibo', color: '#e6162d' },
      { id: 17, name: '腾讯新闻', url: 'https://news.qq.com/', icon: 'fa-newspaper', color: '#0052d9' },
      { id: 18, name: '小红书', url: 'https://www.xiaohongshu.com/', icon: 'fa-heart', color: '#fe2c55' },
      { id: 19, name: '豆瓣', url: 'https://www.douban.com/', icon: 'fa-star', color: '#007722' },
      { id: 20, name: 'DeepSeek', url: 'https://www.deepseek.com/', icon: 'fa-brain', color: '#165DFF' },
      { id: 21, name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: 'fa-comment-alt', color: '#36BFFA' },
      { id: 22, name: '班级圈', url: 'https://yuchen1017918.github.io/class_circle/', icon: 'fa-comment-dots', color: '#36BFFA' }
    ];
    saveBookmarksToLocal();
  }
  renderBookmarks();
}

// 渲染卡片
function renderBookmarks() {
  const grid = document.getElementById('bookmarksGrid');
  grid.innerHTML = '';
  bookmarks.forEach(item => {
    const card = document.createElement('a');
    card.href = item.url;
    card.target = '_blank';
    card.className = 'bookmark-card';
    card.innerHTML = `
      <div class="card-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <div class="icon" style="background:${item.color}">
        <i class="fas ${item.icon}"></i>
      </div>
      <div class="name">${item.name}</div>
    `;
    grid.appendChild(card);
  });
  bindCardActions();
}

// 卡片编辑/删除事件
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

// 打开弹窗
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

// 保存网址
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

// 删除网址
function deleteBookmark(id) {
  if (confirm('确定删除？')) {
    bookmarks = bookmarks.filter(item => item.id !== id);
    saveBookmarksToLocal();
    renderBookmarks();
  }
}

// 本地存储
function saveBookmarksToLocal() {
  localStorage.setItem('myNavFinal', JSON.stringify(bookmarks));
}

// ------------------------------
// 设置模块
// ------------------------------
function loadSettings() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.className = theme === 'dark' ? 'dark' : '';
  document.querySelector(`.theme-btn[data-theme="${theme}"]`).classList.add('active');

  const fontSize = localStorage.getItem('fontSize') || '16';
  document.documentElement.style.fontSize = `${fontSize}px`;
  document.querySelector(`.font-btn[data-size="${fontSize}"]`).classList.add('active');
}

function toggleTheme(theme) {
  document.body.className = theme === 'dark' ? 'dark' : '';
  localStorage.setItem('theme', theme);
}

function changeFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
  localStorage.setItem('fontSize', size);
}

// ------------------------------
// 事件统一绑定
// ------------------------------
function initEventListeners() {
  initSearch();

  // 弹窗
  document.getElementById('addBookmarkBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('bookmarkForm').addEventListener('submit', saveBookmark);

  // 设置面板
  const settingBtn = document.getElementById('settingBtn');
  const closePanel = document.getElementById('closePanel');
  const panel = document.getElementById('settingsPanel');
  settingBtn.addEventListener('click', () => panel.classList.add('show'));
  closePanel.addEventListener('click', () => panel.classList.remove('show'));

  // 主题切换
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toggleTheme(btn.dataset.theme);
    });
  });

  // 字体大小
  document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      changeFontSize(btn.dataset.size);
    });
  });
}