import express from 'express';
import { AnalyzeController } from './controllers/analyze.controller';
import { analyizeInputDto } from './dto/analyze-input.dto'; 
import { validateZodSchemaMiddleware } from "./../common/middlewares/schema-validation.middleware";
import { UnsplashService } from './services/unsplash.service';
import { ConfigService } from '../common/services/config.service';
import { GoogleVisionService } from './services/google-vision.service';
import { AnalyzeImageService } from './services/analyze-images.service';
import { LoggerService } from '../common/services/logger.service';

export const router = express.Router();

const configService = ConfigService.fetch();

const googleVisionService = GoogleVisionService.fetch();
const unsplashService = UnsplashService.fetch(configService);
const analyzeImageService = AnalyzeImageService.fetch(
  unsplashService,
  googleVisionService,
  new LoggerService()
);

(async () => {
  const response = await analyzeImageService.analyzeByKeyword('city', ['building', 'man']);
  console.log(response);
})();

const analyzeController = new AnalyzeController(unsplashService);

router.post(
  "/analyze",
  [
    validateZodSchemaMiddleware(analyizeInputDto),
  ],
  analyzeController.analyze.bind(analyzeController)
)
