export class LoggerService {
  private context: string;
  
  constructor(context?: string) {
    this.context = context || "GLOBAL";
  }

  setContext(context: string) {
    this.context = context;
  }

  getContext() {
    return this.context;
  }

  log(message: string) {
    console.log(`[${this.context}] ${message}`);
  }
}