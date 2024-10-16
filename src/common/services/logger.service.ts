import { LogLevel } from './../enums/log-level.enum';
import { ConfigService } from './config.service';

export class LoggerService {
  private context: string = 'GLOBAL';
  private logLevel: number;
  
  constructor(private readonly configService: ConfigService) {
    this.logLevel = LogLevel[this.configService.get("LOG_LEVEL") as keyof typeof LogLevel ?? 'INFO'];
  }

  setContext(context: string) {
    this.context = context;
    return this;
  }

  getContext() {
    return this.context;
  }

  debug(message: string) {
    return this.log(message, LogLevel['DEBUG']);
  }

  warn(message: string) {
    return this.log(message, LogLevel['WARN']);
  }

  error(message: string) {
    return this.log(message, LogLevel['ERROR']);
  }

  info(message: string) {
    return this.log(message, LogLevel['INFO']);
  }

  private log(message: string, level: number) {
    if (this.logLevel > level) return false;

    console.log(`[${this.context}::${LogLevel[level] ?? "UNKNOWN"}] ${message}`);
    return true;
  }
}