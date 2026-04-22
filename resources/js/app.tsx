import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.{[tj]sx,[tj]s}');
        const path = `./Pages/${name}`;
        
        // Try .jsx then .tsx
        if (pages[`${path}.jsx`]) return resolvePageComponent(`${path}.jsx`, pages);
        if (pages[`${path}.tsx`]) return resolvePageComponent(`${path}.tsx`, pages);
        if (pages[`${path}.js`]) return resolvePageComponent(`${path}.js`, pages);
        if (pages[`${path}.ts`]) return resolvePageComponent(`${path}.ts`, pages);

        throw new Error(`Page not found: ${path}`);
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
