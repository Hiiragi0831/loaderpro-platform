export const useApi = () => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig();

  return {
    apiUrl,
    // Можно добавить другие полезные методы
    buildUrl: (endpoint: string) => `${apiUrl}${endpoint}`,
    fetch: (endpoint: string, options?: RequestInit) => fetch(`${apiUrl}${endpoint}`, options),
  };
};
