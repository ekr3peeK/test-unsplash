import zod from 'zod';

export const configSchema = zod.object({
  PORT: zod.string(),
  GOOGLE_APPLICATION_CREDENTIALS: zod.string(),
  UNSPLASH_ACCESSKEY: zod.string(),
});