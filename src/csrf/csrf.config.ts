import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

/**
 * Shared CSRF configuration
 * This configuration is used both in main.ts and csrf.service.ts
 */
export const csrfConfig: DoubleCsrfConfigOptions = {
  getSecret: () => process.env.CSRF_SECRET || 'your-secret-key-change-this-in-production',
  cookieName: 'x-cookie-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getSessionIdentifier: (req) => (req as any).session?.id || 'anonymous',
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
};

export const createCsrfUtilities = () => doubleCsrf(csrfConfig);
