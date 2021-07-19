export const appDomain = 'letterchefs.com';
export const apiOrigin = 'https://api.' + appDomain;
export const appPrefix = 'lttrchfs_';

export const devHostName = 'local-web.letterchefs.com';

export const hasLocalStorage = window && 'localStorage' in window;

export const userKey = 'letterchefs_user_details';
export const readingEventStoreName = 'letterchefs_event_create';

export const isProduction = process.env.REACT_APP_MODE === 'production';

export const stripePubKey = process.env.REACT_APP_STRIPE_PUB_KEY;
