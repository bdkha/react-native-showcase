import axios from 'axios';

export type LogEntry = {
  id: number;
  timestamp: string;
  type: 'request' | 'response' | 'error';
  message: string;
};

let logId = 0;
const logs: LogEntry[] = [];
const MAX_LOGS = 50;

function addLog(type: LogEntry['type'], message: string) {
  const entry: LogEntry = {
    id: ++logId,
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
  };
  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.pop();
}

export function getRecentLogs(): LogEntry[] {
  return [...logs];
}

export function clearLogs() {
  logs.length = 0;
}

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const method = (config.method ?? 'GET').toUpperCase();
  const url = config.url ?? '';
  addLog('request', `${method} ${url}`);
  const token = process.env.EXPO_PUBLIC_API_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const { status, config } = response;
    const url = config.url ?? '';
    addLog('response', `${status} ${url}`);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      addLog('error', 'Request cancelled');
    } else if (error.code === 'ECONNABORTED') {
      addLog('error', `Timeout: ${error.config?.url ?? ''}`);
    } else {
      const status = error.response?.status ?? 'Network Error';
      addLog('error', `${status} ${error.config?.url ?? ''}`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
