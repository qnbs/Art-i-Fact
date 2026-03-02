/**
 * Service Worker Registration for PWA support.
 * Registers the service worker for offline capabilities.
 */
export const registerServiceWorker = async (): Promise<void> => {
  if (!("serviceWorker" in navigator)) {
    console.log("[SW] Service workers not supported");
    return;
  }

  // Determine the correct SW path based on base URL
  const basePath = (import.meta as any).env?.BASE_URL || "/";
  const swPath = `${basePath}service-worker.js`;

  try {
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: basePath,
    });

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "activated") {
            console.log("[SW] New service worker activated");
          }
        });
      }
    });

    console.log("[SW] Service worker registered:", registration.scope);
  } catch (error) {
    console.error("[SW] Service worker registration failed:", error);
  }
};
