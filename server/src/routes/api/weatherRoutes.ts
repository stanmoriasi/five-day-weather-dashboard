import { Router, type Request, type Response } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const weatherService = new WeatherService();
  const { cityName } = req.body;
  try {
  const weatherData =await weatherService.getWeatherForCity(cityName);  // TODO: save city to search history
  const historyService = new HistoryService();
  historyService.addCity(cityName);
       return res.json(weatherData);
  } catch(err) {
    console.log(err)
    return res.json(err);
  }

});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const historyService = new HistoryService();
  const cities = await historyService.getCities();
  return res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const historyService = new HistoryService();
  await historyService.removeCity(id);
  return res.json({ message: `City removed from history` });
});

export default router;
