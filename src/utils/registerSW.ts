
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso:', registration);
        })
        .catch(error => {
          console.error('Erro ao registrar ServiceWorker:', error);
        });
    });
  }
};
