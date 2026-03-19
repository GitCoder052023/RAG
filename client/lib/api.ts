import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);
  const response = await api.post('/upload/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const chatWithPDF = async (message: string) => {
  const response = await api.get('/chat', {
    params: { message },
  });
  return response.data;
};
