import { CacheService } from '../common/services/cache.service';
import { 
  AnalyzeController, 
  AnalyzeImageService, 
  GoogleVisionService, 
  UnsplashService 
} from './../analyze';

import { ConfigService } from './../common/services/config.service';
import { LoggerService } from './../common/services/logger.service';

import { createContainer, InjectionMode, asClass, AwilixContainer } from 'awilix';


export function configureDI(): AwilixContainer<{
  'configService': ConfigService,
  'loggerService': LoggerService,
}> {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  });

  container.register('configService', asClass(ConfigService).singleton());
  container.register('loggerService', asClass(LoggerService).transient());

  container.register('unsplashService', asClass(UnsplashService).singleton());
  container.register('googleVisionService', asClass(GoogleVisionService).singleton());
  container.register('analyzeImageService', asClass(AnalyzeImageService).singleton());

  container.register('analyzeController', asClass(AnalyzeController).singleton());
  container.register('cacheService', asClass(CacheService).transient());

  return container;
}