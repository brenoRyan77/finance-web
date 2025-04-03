
// Prompt para atualização
const showUpdatePrompt = () => {
  if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
    window.location.reload();
  }
};

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
          updateViaCache: 'none', // Não usar cache do navegador para atualizações do SW
        });
        console.log('ServiceWorker registrado com sucesso:', registration);

        // Verificar se há atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('Service Worker update found!');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Nova versão disponível; por favor atualize.');
                showUpdatePrompt();
              }
            });
          }
        });

        // Verificar atualizações a cada 1 hora
        setInterval(() => {
          registration.update();
          console.log('Verificando atualizações do Service Worker...');
        }, 60 * 60 * 1000);
      } catch (error) {
        console.error('Erro ao registrar ServiceWorker:', error);
      }
    });

    // Lidando com atualizações do service worker
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  } else {
    console.warn('Service workers não são suportados neste navegador.');
  }

  // Adicionar evento para instalação do app
  window.addEventListener('beforeinstallprompt', (e) => {
    // Guardar o evento para usar depois
    console.log('PWA pode ser instalado!');
    // Você pode mostrar um botão para instalar o aplicativo aqui
    const promptEvent = e;
    // Aqui você pode armazenar o evento para uso posterior em um botão de instalação
  });

  // Evento para quando o app é instalado
  window.addEventListener('appinstalled', (e) => {
    console.log('PWA foi instalado com sucesso!');
  });
};