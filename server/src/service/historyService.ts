import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; 


// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const filePath = 'db/searchHistory.json'; // Define the file path
    try {
      if (!fs.existsSync(filePath)) {
        console.log("Search history file not found. Creating a new one.");
        await fs.promises.writeFile(filePath, JSON.stringify([], null, 2));
      }
 
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }
  
  
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.promises.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'))
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities: City[] = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    if (!city.trim()) {
      throw new Error('City name cannot be blank');
    }
  
    const cities = await this.getCities();
  
    const cityExists = cities.some(existingCity => existingCity.name.toLowerCase() === city.toLowerCase());
  
    if (cityExists) {
      return;
    }
  
    const newCity = new City(city, uuidv4());
    await this.write([...cities, newCity]);
    console.log(`City "${city}" added to search history.`);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  
  async removeCity(id: string) {
    const cities = await this.getCities();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities)
  }
}

export default HistoryService;