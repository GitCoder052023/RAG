import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);
  const response = await api.post('/api/docs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const chatWithDocument = (
  message: string,
  onDocs: (docs: any[]) => void,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: any) => void
) => {
  const url = `${API_BASE_URL}/api/chat/stream?message=${encodeURIComponent(message)}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
      eventSource.close();
      onDone();
      return;
    }
    try {
      const data = JSON.parse(event.data);
      if (data.error) {
        eventSource.close();
        onError(new Error(data.error));
        return;
      }
      if (data.docs) {
        onDocs(data.docs);
      }
      if (data.chunk) {
        onChunk(data.chunk);
      }
    } catch (err) {
      console.error('Error parsing SSE event data:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('EventSource failed:', err);
    eventSource.close();
    onError(err);
  };

  return () => eventSource.close();
};
