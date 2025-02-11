import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  temperature: number;
  humidity: number;
  windSpeed:number;
  icon: string;
  constructor(city: string, date: string, temperature: number, humidity: number, windSpeed: number, icon: string) {
    this.city = city;
    this.date = date;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    this.cityName = query;
    const geocode = this.buildGeocodeQuery('weather');
    try {
      const response = await fetch(geocode);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Unable to fetch location data');
    }
   }

   private async fetchLocationForecastData(query: string) {
    this.cityName = query;
    const geocode = this.buildGeocodeQuery('forecast');
    try {
      const response = await fetch(geocode);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Unable to fetch location data');
    }
   }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };

   }
  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(option: string): string {
    const query = `${this.baseURL}/${option}?q=${this.cityName}&appid=${this.apiKey}`;
    return query;
   }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates, option: string): string {
    const { lat, lon } = coordinates;
    const query = `${this.baseURL}/${option}/?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const {coord} = await this.fetchLocationData(this.cityName);
    const coordinates = this.destructureLocationData(coord);
    return coordinates;
  }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates, 'weather');
    try {
      const response = await fetch(weatherQuery);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Unable to fetch weather data');
    }
   }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const { name } = response;
    const { temp, humidity } = response.main;
    const { speed } = response.wind;
    const { icon } = response.weather[0]; 
    const weather = new Weather(name, new Date().toDateString(), temp, humidity, speed, icon);
    return weather;
   }
// TODO: Complete buildForecastArray method
async buildForecast() {
  const forecastedWeather = await this.fetchLocationForecastData(
    this.cityName
  );
  return {
    ...forecastedWeather,
    list: forecastedWeather.list.filter((item: { dt_txt: string }) =>
      item.dt_txt.includes("00:00:00")
    )
  };
}
// TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string) {
  this.cityName = city;
  const coordinates = await this.fetchAndDestructureLocationData();
  const weatherData = await this.fetchWeatherData(coordinates);
  const currentWeather = this.parseCurrentWeather(weatherData);
  const forecastedWeather = await this.buildForecast();

  return { currentWeather, forecastedWeather };
}
}

export default WeatherService;
