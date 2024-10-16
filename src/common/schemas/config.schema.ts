import zod from 'zod';

import { LogLevel } from './../enums/log-level.enum';

const logLevels = Object.keys(LogLevel).filter((key) => isNaN(Number(key))) as [string, ...string[]];

export const configSchema = zod.object({
  PORT: zod.string(),
  GOOGLE_APPLICATION_CREDENTIALS: zod.string(),
  UNSPLASH_ACCESSKEY: zod.string(),
  LOG_LEVEL: zod.enum(logLevels).optional()
});