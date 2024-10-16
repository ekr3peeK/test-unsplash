import express from 'express';
import { analyizeInputDtoZod } from './dto/analyze-input.dto'; 
import { validateZodSchemaMiddleware } from "./../common/middlewares/schema-validation.middleware";
import { AnalyzeController } from './controllers/analyze.controller';
import { AwilixContainer } from 'awilix';
import { errorHandlerMiddleware } from '../common/middlewares/error-handler.middleware';
import { asyncHandler } from '../common/utils/async-handler.util';

export function configureRouter(diContainer: AwilixContainer) {
  const router = express.Router();
  const analyzeController = diContainer.resolve<AnalyzeController>('analyzeController');

  router.post(
    "/analyze",
    [
      validateZodSchemaMiddleware(analyizeInputDtoZod),
    ],
    asyncHandler(analyzeController.analyze.bind(analyzeController)),
    errorHandlerMiddleware
  )

  return router;
}


