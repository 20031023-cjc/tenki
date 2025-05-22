const apiKey = "da7be22a064e8e36c8e9385be0d67fc4";

function getWeatherIcon(iconCode) {
  const iconMap = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "🌤️",
    "02n": "☁️🌙",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️🌙",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️"
  };
  return iconMap[iconCode] || "🌈";
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    resultDiv.innerHTML = '<p class="text-red-500">请输入城市名称！</p>';
    return;
  }

  resultDiv.innerHTML = '<p>查询中...</p>';

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_cn`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      resultDiv.innerHTML = `<p class="text-red-500">${data.message}</p>`;
      return;
    }

    const icon = getWeatherIcon(data.weather[0].icon);
    const weatherHTML = `
      <div class="bg-blue-100 rounded-xl shadow-lg p-4 mt-4 animate-slideIn">
        <h2 class="text-2xl font-bold mb-2">${data.name}, ${data.sys.country}</h2>
        <p class="text-4xl">${icon} ${data.main.temp.toFixed(1)}°C</p>
        <p class="capitalize text-gray-700 mt-1">${data.weather[0].description}</p>
        <p class="text-sm text-gray-500 mt-2">湿度：${data.main.humidity}% | 风速：${data.wind.speed} m/s</p>
      </div>
    `;
    resultDiv.innerHTML = weatherHTML;
  } catch (error) {
    resultDiv.innerHTML = `<p class="text-red-500">查询失败，请稍后重试。</p>`;
  }
}
