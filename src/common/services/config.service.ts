import dotenv from 'dotenv';
import zod from 'zod';
import { configSchema } from './../schemas/config.schema';

type configType = zod.infer<typeof configSchema>;

export class ConfigService {
  private static instance: ConfigService;
  
  private readonly config: configType;
  
  private constructor() {
    const configEnv = dotenv.config();
    const parsedEnv = configSchema.safeParse(configEnv.parsed);

    if (!parsedEnv.success) {
      throw new Error(`The provided .env file is missing some variables: ${parsedEnv.error.toString()}`);
    }

    this.config = parsedEnv.data;
  }

  get<TKey extends keyof configType>(key: TKey): configType[TKey] {
    return this.config[key];
  }

  static fetch() {
    if (!this.instance) {
      this.instance = new ConfigService();
    }

    return this.instance;
  }
}