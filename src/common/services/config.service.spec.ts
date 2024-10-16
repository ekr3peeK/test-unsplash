import zod from 'zod';
import { ConfigService } from './config.service';

let returnedConfig = {};

jest.mock('dotenv', () => ({
  config: () => {
    return {
      parsed: returnedConfig
    }
  }
}));

jest.mock('./../schemas/config.schema', () => ({
  configSchema: zod.object({
    customField: zod.string(),
    numericField: zod.number(),
  })
}));

describe('ConfigService', () => {
  it('should throw if a value is missing or misconfigured based on the schema', () => {
    returnedConfig = {
      customField: 'test'
    }

    expect(() => {
      new ConfigService();
    }).toThrow();

    returnedConfig = {
      customField: 'test',
      numericField: 'test2'
    }

    expect(() => {
      new ConfigService();
    }).toThrow();

    returnedConfig = {
      customField: 'test',
      numericField: 12
    }

    expect(() => {
      new ConfigService();
    }).not.toThrow();
  });
});