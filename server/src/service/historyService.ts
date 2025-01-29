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
  private async read() {
    let data: any;
    try{
      data = await fs.promises.readFile('db/searchHistory.json', 'utf-8');
  } catch (error) {
    console.log("Search history file not found");
    return []
  }
  return JSON.parse(data);
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
  async addCity(city: string) {
    if (!city) {
      throw new Error('City name cannot be blank');
    }
    const newCity: City = {name: city, id: uuidv4() };
    const cities = await this.getCities()
    if (cities.find((index: { name: string; }) => index.name === city)) {
    }
    const newList = [...cities, newCity];
    this.write(newList)
  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  
  async removeCity(id: string) {
    const cities = await this.getCities();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities)
  }
}

export default HistoryService;