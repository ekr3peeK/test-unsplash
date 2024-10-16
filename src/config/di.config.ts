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

// type SingletonClassPattern<TInstance> = {
//   fetch: (...args: any) => TInstance
// }

// export function useSingletonPattern(singletonPatternedClass: SingletonClassPattern<any>) {
//   return (...args: any) => {
//     return singletonPatternedClass.fetch(...args);
//   }
// }

// export function configureDI() {
//   const containerBuilder = new ContainerBuilder();

//   containerBuilder.register(ConfigService.name, ConfigService);
//   containerBuilder.register(LoggerService.name, () => new LoggerService());
//   containerBuilder.register(
//     UnsplashService.name, 
//     (ConfigService: ConfigService) => UnsplashService.fetch(ConfigService), 
//     [ConfigService.name]
//   );

//   containerBuilder.register(GoogleVisionService.name, GoogleVisionService);
//   containerBuilder.register(AnalyzeImageService.name, useSingletonPattern(AnalyzeImageService),
//   [
//     LoggerService.name,
//     UnsplashService.name,
//     LoggerService.name
//   ])

//   containerBuilder.register(AnalyzeController.name, AnalyzeController, [UnsplashService.name]);

//   return containerBuilder;
// }