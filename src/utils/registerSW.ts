const showUpdatePrompt = () => {
  if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
    window.location.reload();
  }
};

// Armazenar o evento de instalação para uso posterior
let deferredPrompt: any = null;

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

  // Interceptar o evento beforeinstallprompt para uso posterior
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que o Chrome mostre automaticamente o prompt
    e.preventDefault();

    // Guardar o evento para uso posterior
    deferredPrompt = e;

    // Podemos disparar um evento personalizado ou atualizar o estado
    // para indicar que o app pode ser instalado
    const installableEvent = new CustomEvent('appInstallable');
    window.dispatchEvent(installableEvent);

    console.log('PWA pode ser instalado! Evento armazenado.');
  });

  // Evento para quando o app é instalado
  window.addEventListener('appinstalled', (e) => {
    // Limpar o prompt salvo
    deferredPrompt = null;

    console.log('PWA foi instalado com sucesso!');

    // Disparar evento de instalação bem-sucedida
    const installedEvent = new CustomEvent('appInstalled');
    window.dispatchEvent(installedEvent);
  });
};

// Função para mostrar o prompt de instalação
export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log('Nenhum evento de instalação disponível');
    return false;
  }

  try {
    // Mostrar o prompt de instalação
    deferredPrompt.prompt();

    // Esperar pela escolha do usuário
    const choiceResult = await deferredPrompt.userChoice;

    // Limpar o prompt salvo após o uso
    deferredPrompt = null;

    // Retornar se o usuário aceitou instalar
    return choiceResult.outcome === 'accepted';
  } catch (error) {
    console.error('Erro ao mostrar prompt de instalação:', error);
    return false;
  }
};

// Função para verificar se o app já está instalado ou está sendo executado em um navegador standalone
export const isAppInstalled = (): boolean => {
  // Verificar se está sendo executado em modo standalone (PWA instalado)
  const isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

  return isInStandaloneMode();
};

// Função para verificar se o app pode ser instalado
export const canInstallPWA = (): boolean => {
  return !!deferredPrompt && !isAppInstalled();
};