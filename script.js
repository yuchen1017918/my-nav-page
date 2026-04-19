// ========== 全局变量 ==========
let currentEngine = "baidu"; // 当前搜索引擎
let bookmarks = []; // 网址列表
const modal = document.getElementById("modal");

// ========== 初始化函数 ==========
window.onload = function() {
    updateDateTime();
    renderWeather();
    loadBookmarks();
    loadSettings();
    initEventListeners();
    setInterval(updateDateTime, 1000); // 每秒更新时间
};

// ========== 1. 日期时间功能 ==========
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
    document.getElementById("datetime").textContent = now.toLocaleDateString("zh-CN", options);
}

// ========== 2. 自动获取定位城市（失败显示未知） ==========
function renderWeather() {
    const weatherEl = document.getElementById("weather");
    weatherEl.innerHTML = `<i class="fas fa-location-arrow"></i><span>获取中...</span>`;

    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            const cityMap = {
                "Hangzhou": "杭州",
                "Beijing": "北京",
                "Shanghai": "上海",
                "Guangzhou": "广州",
                "Shenzhen": "深圳"
            };
            const cityEn = data.city || "未知";
            const cityCn = cityMap[cityEn] || cityEn;
            weatherEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${cityCn} · 正常</span>`;
        })
        .catch(() => {
            weatherEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>未知 · 未知</span>`;
        });
}

// ========== 3. 搜索功能 ==========
function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const engineBtns = document.querySelectorAll(".engine-btn");

    engineBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            engineBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentEngine = btn.dataset.engine;
        });
    });

    function doSearch() {
        const keyword = searchInput.value.trim();
        if (!keyword) return;
        
        let url;
        switch(currentEngine) {
            case "baidu":
                url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
                break;
            case "google":
                url = `https://www.sogou.com/web?query=${encodeURIComponent(keyword)}`;
                break;
            case "bing":
                url = `https://cn.bing.com/search?q=${encodeURIComponent(keyword)}`;
                break;
        }
        window.open(url, "_blank");
        searchInput.value = "";
    }

    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") doSearch();
    });
}

// ========== 4. 网址管理功能 ==========
function loadBookmarks() {
    const localData = localStorage.getItem("myNavFinal");
    if (localData) {
        bookmarks = JSON.parse(localData);
    } else {
        bookmarks = [
            { id: 1, name: "百度", url: "https://www.baidu.com", icon: "fa-search", color: "#409eff" },
            { id: 2, name: "淘宝", url: "https://www.taobao.com", icon: "fa-shopping-bag", color: "#ff5000" },
            { id: 3, name: "抖音", url: "https://www.douyin.com", icon: "fa-music", color: "#000000" },
            { id: 4, name: "知乎", url: "https://www.zhihu.com", icon: "fa-book", color: "#0084ff" },
            { id: 5, name: "B站", url: "https://www.bilibili.com", icon: "fa-play-circle", color: "#fb7299" },
            { id: 6, name: "微信", url: "https://weixin.qq.com/", icon: "fa-weixin", color: "#07c160" },
            { id: 7, name: "古德微", url: "http://gdwrobot.com", icon: "fa-robot", color: "#2196f3" },
            { id: 8, name: "文心", url: "https://yiyan.baidu.com/", icon: "fa-comment-dots", color: "#2980b9" },
            { id: 9, name: "豆包", url: "https://www.doubao.com/", icon: "fa-robot", color: "#1677ff" },
            { id: 10, name: "洛谷", url: "https://www.luogu.com.cn/", icon: "fa-code", color: "#3498db" },
            { id: 11, name: "元宝", url: "https://yuanbao.tencent.com/", icon: "fa-coins", color: "#ffc107" },
            { id: 12, name: "百度百科", url: "https://baike.baidu.com/", icon: "fa-book-open", color: "#2980b9" },
            { id: 13, name: "百度图片", url: "https://image.baidu.com/", icon: "fa-image", color: "#27ae60" },
            { id: 14, name: "千问", url: "https://tongyi.aliyun.com/", icon: "fa-brain", color: "#ff7a45" },
            { id: 15, name: "即梦", url: "https://jimeng.jianying.com/ai-tool/home/", icon: "fa-palette", color: "#9c27b0" },
            { id: 16, name: "GitHub", url: "https://github.com/", icon: "fa-github", color: "#171515" },
            { id: 17, name: "凤凰网", url: "https://www.ifeng.com/", icon: "fa-globe", color: "#d32f2f" },
            { id: 18, name: "央视网", url: "https://www.cctv.com/", icon: "fa-tv", color: "#c8102e" },
            { id: 19, name: "微博", url: "https://weibo.com/", icon: "fa-weibo", color: "#e6162d" },
            { id: 20, name: "腾讯新闻", url: "https://news.qq.com/", icon: "fa-newspaper", color: "#0052d9" },
            { id: 21, name: "网易新闻", url: "https://www.163.com/", icon: "fa-newspaper", color: "#c80020" }
        ];
        saveBookmarksToLocal();
    }
    renderBookmarks();
}

function renderBookmarks() {
    const grid = document.getElementById("bookmarksGrid");
    grid.innerHTML = "";
    
    bookmarks.forEach(item => {
        const card = document.createElement("a");
        card.href = item.url;
        card.target = "_blank";
        card.className = "bookmark-card";
        const bgColor = item.color || "#409eff";
        card.innerHTML = `
            <div class="card-actions">
                <button class="edit-btn" data-id="${item.id}" aria-label="编辑网址">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${item.id}" aria-label="删除网址">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="icon" style="background-color: ${bgColor}">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="name">${item.name}</div>
        `;
        grid.appendChild(card);
    });
    bindCardActions();
}

function bindCardActions() {
    document.querySelectorAll(".card-actions button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            if (btn.classList.contains("edit-btn")) openEditModal(id);
            else if (btn.classList.contains("delete-btn")) deleteBookmark(id);
        });
    });
}

function openModal(isEdit = false, data = null) {
    const modalTitle = document.getElementById("modalTitle");
    const bookmarkForm = document.getElementById("bookmarkForm");
    
    if (isEdit && data) {
        modalTitle.textContent = "编辑网址";
        document.getElementById("bookmarkId").value = data.id;
        document.getElementById("bookmarkName").value = data.name;
        document.getElementById("bookmarkUrl").value = data.url;
        document.getElementById("bookmarkIcon").value = data.icon || "fa-globe";
        document.getElementById("bookmarkColor").value = data.color || "#409eff";
    } else {
        modalTitle.textContent = "添加网址";
        bookmarkForm.reset();
        document.getElementById("bookmarkId").value = "";
        document.getElementById("bookmarkIcon").value = "fa-globe";
        document.getElementById("bookmarkColor").value = "#409eff";
    }
    modal.classList.add("show");
}

function closeModal() { modal.classList.remove("show"); }
function openEditModal(id) { const data = bookmarks.find(item => item.id === id); if (data) openModal(true, data); }

function saveBookmark(e) {
    e.preventDefault();
    const id = document.getElementById("bookmarkId").value;
    const name = document.getElementById("bookmarkName").value.trim();
    let url = document.getElementById("bookmarkUrl").value.trim();
    const icon = document.getElementById("bookmarkIcon").value;
    const color = document.getElementById("bookmarkColor").value;
    if (!url.startsWith("http")) url = "https://" + url;

    if (id) {
        const index = bookmarks.findIndex(item => item.id === parseInt(id));
        bookmarks[index] = { ...bookmarks[index], name, url, icon, color };
    } else {
        bookmarks.push({ id: Date.now(), name, url, icon: icon || "fa-globe", color: color || "#409eff" });
    }
    saveBookmarksToLocal();
    renderBookmarks();
    closeModal();
}

function deleteBookmark(id) {
    if (confirm("确定要删除这个网址吗？")) {
        bookmarks = bookmarks.filter(item => item.id !== id);
        saveBookmarksToLocal();
        renderBookmarks();
    }
}

function saveBookmarksToLocal() {
    localStorage.setItem("myNavFinal", JSON.stringify(bookmarks));
}

// ========== 5. 设置面板功能 ==========
function loadSettings() {
    const theme = localStorage.getItem("theme") || "light";
    document.body.className = theme === "dark" ? "dark" : "";
    document.querySelector(`.theme-btn[data-theme="${theme}"]`).classList.add("active");

    const fontSize = localStorage.getItem("fontSize") || "16";
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.querySelector(`.font-btn[data-size="${fontSize}"]`).classList.add("active");
}

function toggleTheme(theme) {
    document.body.className = theme === "dark" ? "dark" : "";
    localStorage.setItem("theme", theme);
}

function changeFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem("fontSize", size);
}

// ========== 6. 事件监听 ==========
function initEventListeners() {
    initSearch();
    document.getElementById("addBookmarkBtn").addEventListener("click", () => openModal());
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("cancelBtn").addEventListener("click", closeModal);
    document.getElementById("bookmarkForm").addEventListener("submit", saveBookmark);

    const settingBtn = document.getElementById("settingBtn");
    const closePanel = document.getElementById("closePanel");
    const settingsPanel = document.getElementById("settingsPanel");
    settingBtn.addEventListener("click", () => settingsPanel.classList.add("show"));
    closePanel.addEventListener("click", () => settingsPanel.classList.remove("show"));

    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            toggleTheme(btn.dataset.theme);
        });
    });

    document.querySelectorAll(".font-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".font-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            changeFontSize(btn.dataset.size);
        });
    });
}