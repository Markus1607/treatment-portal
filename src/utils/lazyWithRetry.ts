import { ComponentType, lazy } from 'react';

/**
 ** After each new release, new chunks are created in the bundle,
 ** if the user hasn't yet refreshed their portal for the new update, some old chunks can fail to fetch when not cached locally,
 ** by default the user refreshing their portal fixes 'failed chunk load issue' as the new version kicks in. 

 ** This snippet below does this automatically for the user without result to error boundary phase (which tells the user to refresh their portal)
 */

type ImportComponent = () => Promise<{ default: ComponentType }>;

export const lazyWithRetry = (importComponent: ImportComponent) =>
  lazy((async () => {
    const isPageHasBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await importComponent();

      localStorage.setItem('page-has-been-force-refreshed', 'false');

      return component;
    } catch (error) {
      if (!isPageHasBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }
      // The page has already been reloaded
      // Assuming that user is already using the latest version of the application.
      // Let's let the application crash and raise the error.
      throw error;
    }
  }) as ImportComponent);
