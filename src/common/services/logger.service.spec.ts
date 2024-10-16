import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from "./logger.service";
import { ConfigService } from './config.service';

describe('logger service', () => {
  let loggerService: LoggerService;
  
  beforeAll(() => {
    const configService = createMock<ConfigService>();
    configService.get.mockImplementation((key) => {
      if (key === 'LOG_LEVEL') return 'ERROR';
    });

    loggerService = new LoggerService(configService);
  });

  it('should use the default context of GLOBAL', () => {
    expect(loggerService.getContext()).toBe('GLOBAL');
  });

  it('should allow the switching of contexts', () => {
    loggerService.setContext('MyContext');
    expect(loggerService.getContext()).toBe("MyContext");
  });

  it('should log based on the provided log level', () => {
    expect(loggerService.info('Do not log this')).toBe(false);
    expect(loggerService.debug('Do not log this')).toBe(false);
    expect(loggerService.warn('Do not log this')).toBe(false);
    expect(loggerService.error('Log this')).toBe(true);
  });
});