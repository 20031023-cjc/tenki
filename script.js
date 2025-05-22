const apiKey = '5e383028b875f72d2864f0d492d3dce2';

const cityInput = document.getElementById('cityInput');
const suggestions = document.getElementById('suggestions');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const cityNameEl = document.getElementById('cityName');
const weatherDescEl = document.getElementById('weatherDesc');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const weatherIconEl = document.getElementById('weatherIcon');

// 简单中文模糊搜索
cityInput.addEventListener('input', () => {
  const val = cityInput.value.trim().toLowerCase();
  if (!val) {
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
    return;
  }
  const matched = cities.filter(c => c.name.includes(val) || c.name.toLowerCase().includes(val));
  if (matched.length === 0) {
    suggestions.innerHTML = '<li class="p-2">无匹配城市</li>';
    suggestions.style.display = 'block';
    return;
  }
  suggestions.innerHTML = matched.map(c => `<li class="p-2 cursor-pointer hover:bg-gray-300" data-name="${c.name}">${c.name} (${c.country})</li>`).join('');
  suggestions.style.display = 'block';
});

// 点击选中建议
suggestions.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li' && e.target.dataset.name) {
    cityInput.value = e.target.dataset.name;
    suggestions.style.display = 'none';
  }
});

// 根据天气代码返回对应的Emoji和背景色（简易版）
function getWeatherTheme(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return { icon: '⛈️', bg: 'linear-gradient(135deg, #373B44, #4286f4)' }; // 雷暴雨
  if (weatherId >= 300 && weatherId < 600) return { icon: '🌧️', bg: 'linear-gradient(135deg, #3a7bd5, #00d2ff)' }; // 雨
  if (weatherId >= 600 && weatherId < 700) return { icon: '❄️', bg: 'linear-gradient(135deg, #83a4d4, #b6fbff)' }; // 雪
  if (weatherId >= 700 && weatherId < 800) return { icon: '🌫️', bg: 'linear-gradient(135deg, #757f9a, #d7dde8)' }; // 雾
  if (weatherId === 800) return { icon: '☀️', bg: 'linear-gradient(135deg, #f6d365, #fda085)' }; // 晴
  if (weatherId > 800) return { icon: '☁️', bg: 'linear-gradient(135deg, #bdc3c7, #2c3e50)' }; // 多云
  return { icon: '❓', bg: 'linear-gradient(135deg, #232526, #1c1c1c)' };
}

// 查询天气
async function fetchWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=zh_cn`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('请求失败，可能城市不存在或API限制');
    const data = await res.json();
    return data;
  } catch (err) {
    alert(err.message);
    throw err;
  }
}

// 更新界面
function updateWeatherUI(data) {
  const weatherId = data.weather[0].id;
  const { icon, bg } = getWeatherTheme(weatherId);

  document.body.style.background = bg;
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescEl.textContent = data.weather[0].description;
  tempEl.textContent = data.main.temp.toFixed(1);
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
  weatherIconEl.textContent = icon;

  weatherCard.style.display = 'block';
}

// 点击查询按钮事件
searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert('请输入城市名称');
    return;
  }
  try {
    const data = await fetchWeather(city);
    updateWeatherUI(data);
  } catch (err) {
    weatherCard.style.display = 'none';
  }
});
