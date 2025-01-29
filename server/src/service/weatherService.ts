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
  windspeed:number;
  icon: string;
  constructor(city: string, date: string, temperature: number, humidity: number, windspeed: number, icon: string) {
    this.city = city;
    this.date = date;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windspeed = windspeed;
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
    this.baseURL = process.env.WEATHER_API_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    this.cityName = query;
    const geocode = this.buildGeocodeQuery();
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
   private buildGeocodeQuery(): string {
    const query = `${this.baseURL}/data/2.5/forecast?q=${this.cityName}&appid=${this.apiKey}`;
    return query;
   }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    const query = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName);
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
  }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
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
    const { name } = response.city;
    const { temp, humidity } = response.list[0].main;
    const { speed } = response.list[0].wind;
    const { icon } = response.list[0].weather[0];
    const weather = new Weather(name, new Date().toDateString(), temp, humidity, speed, icon);
    return weather;
   }
  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((data: any) => {
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const { icon } = data.weather[0];
      const forecast = new Weather(currentWeather.city, new Date().toDateString(), temp, humidity, speed, icon);
      return forecast;
    });
    return forecastArray;
   }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return { currentWeather, forecastArray };
  }
}

export default WeatherService;
