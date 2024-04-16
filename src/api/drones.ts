import axios from "axios";

const API_BASE_URL = "https://interviews-api.beefreeagro.com/api/v1";

export const getAllDrones = () => axios.get(`${API_BASE_URL}/drones`);
export const getDroneById = (id: string) =>
  axios.get(`${API_BASE_URL}/drones/${id}`);
export const getDroneImage = (drone_code: string) =>
  axios.get(`${API_BASE_URL}/drones/${drone_code}/image`, { responseType: 'blob' });
