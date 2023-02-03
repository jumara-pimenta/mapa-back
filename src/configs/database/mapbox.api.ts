import axios from 'axios';

export const mapboxApi = axios.create({
  baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving/',
});
