

const checkApiReady = async (): Promise<boolean> => {
  if ((window as any).pywebview && (window as any).pywebview.api) {
    return true;
  } else {
    return new Promise(resolve => setTimeout(() => resolve(checkApiReady()), 100));
  }
};


export const invoke = async (method: string, ...args: any[]) => {
  await checkApiReady()

  const methodParts = method.split('.');
  let apiMethod = (window as any).pywebview.api;

  try {
      for (const part of methodParts) {
          if (!(part in apiMethod)) {
              throw new Error(`Method ${method} not found`);
          }
          apiMethod = apiMethod[part];
      }

      return await apiMethod(...args);
  } catch (error) {
      console.error(`Error calling ${method}:`, error);
      throw error;
  }
};

