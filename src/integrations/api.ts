import axios from 'axios';

export const coreApi = () =>
  axios.create({
    baseURL: process.env.CORE_API_URL,
  });

export const mapboxApi = () =>
  axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving/',
  });

export const googleApi = () =>
  axios.create({
    baseURL: 'https://maps.googleapis.com',
  });
