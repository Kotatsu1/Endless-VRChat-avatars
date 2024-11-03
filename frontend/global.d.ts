interface Window {
  pywebview: {
    api: {
      get_hello: () => Promise<string>;
    };
  };
}
