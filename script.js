// API key
const API_KEY = 'da7be22a064e8e36c8e9385be0d67fc4';

// 简易热门城市库（城市名/英名）
const citiesDB = [
  { ja: '東京', en: 'Tokyo' },
  { ja: '大阪', en: 'Osaka' },
  { ja: '京都', en: 'Kyoto' },
  { ja: '札幌', en: 'Sapporo' },
  { ja: '福岡', en: 'Fukuoka' },
  { ja: 'ニューヨーク', en: 'New York' },
  { ja: 'ロンドン', en: 'London' },
  { ja: 'パリ', en: 'Paris' },
  { ja: 'シドニー', en: 'Sydney' },
  { ja: 'バンコク', en: 'Bangkok' },
  { ja: '北京', en: 'Beijing' },
  { ja: '上海', en: 'Shanghai' },
];

// 语言文本配置
const texts = {
  ja: {
    title: '世界の天気',
    placeholder: '都市名を入力',
    search: '検索',
    locate: '現在地を取得',
    favoritesTitle: 'お気に入りの都市',
    back: '戻る',
    errorNotFound: '都市が見つかりません。',
    errorGeo: '位置情報を取得できません。',
    recommendation: (temp) => {
      if (temp >= 30) return '今日はとても暑いです。水分補給を忘れずに！';
      if (temp >= 20) return '快適な天気です。外に出かけましょう！';
      if (temp >= 10) return '少し肌寒いので、羽織るものを持ってください。';
      return '寒いので暖かくしてください。';
    },
  },
  en: {
    title: 'World Weather',
    placeholder: 'Enter city name',
    search: 'Search',
    locate: 'Get Location',
    favoritesTitle: 'Favorite Cities',
    back: 'Back',
    errorNotFound: 'City not found.',
    errorGeo: 'Unable to get location.',
    recommendation: (temp) => {
      if (temp >= 30) return 'It’s very hot today. Stay hydrated!';
      if (temp >= 20) return 'Comfortable weather. Let’s go outside!';
      if (temp >= 10) return 'A bit chilly, bring a jacket.';
      return 'Cold, keep warm!';
    },
  },
};

let currentLang = 'ja';
let favorites = [];

// DOM Elements
const titleEl = document.getElementById('title');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locateBtn = document.getElementById('locate-btn');
const autocompleteList = document.getElementById('autocomplete-list');
const weatherDisplay = document.getElementById('weather-display');
const favoritesList = document.getElementById('favorites-list');
const favoritesTitle = document.getElementById('favorites-title');
const langSelect = document.getElementById('language-select');
const themeToggle = document.getElementById('theme-toggle');

// 初始化本地收藏
function loadFavorites() {
  const data = localStorage.getItem('weatherFavorites');
  if (data) {
    favorites = JSON.parse(data);
  } else {
    favorites = [];
  }
}

// 保存收藏
function saveFavorites() {
  localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

// 切换语言文本
function updateTexts() {
  const t = texts[currentLang];
  titleEl.textContent = t.title;
  cityInput.placeholder = t.placeholder;
  searchBtn.textContent = '🔍';
  locateBtn.textContent = '📍';
  favoritesTitle.textContent = t.favoritesTitle;
  document.querySelectorAll('.back-text').forEach(el => el.textContent = t.back);
}

// 主题切换
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// 格式化时间
function formatTime(timestamp, timezone) {
  const d = new Date((timestamp + timezone) * 1000);
  return d.toUTCString().slice(-12, -7);
}

// 创建天气卡片DOM
function createWeatherCard(data, isFavorite = false) {
  const t = texts[currentLang];
  const template = document.getElementById('weather-card-template');
  const card = template.content.firstElementChild.cloneNode(true);

  card.querySelector('.city-name').textContent = `${data.name}, ${data.sys.country}`;
  card.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
  card.querySelector('.weather-main').textContent = data.weather[0].description;
  card.querySelector('.weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  card.querySelector('.weather-icon').alt = data.weather[0].description;

  card.querySelector('.wind').textContent = data.wind.speed;
  card.querySelector('.humidity').textContent = data.main.humidity;
  card.querySelector('.pressure').textContent = data.main.pressure;
  card.querySelector('.sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
  card.querySelector('.sunset').textContent = formatTime(data.sys.sunset, data.timezone);

  card.querySelector('.recommendation').textContent = t.recommendation(data.main.temp);

  // 收藏按钮状态
  const favBtn = card.querySelector('.fav-btn');
  const isFav = favorites.some(f => f.id === data.id);
  if (isFav) favBtn.classList.add('favorited');

  favBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (favorites.some(f => f.id === data.id)) {
      favorites = favorites.filter(f => f.id !== data.id);
      favBtn.classList
