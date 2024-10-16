import express, { json } from 'express';
import { configureRouter as configureAnalyzeRouter } from './analyze/route';
import { configureDI } from './config/di.config';

const app = express();
const diContainer = configureDI();

const configService = diContainer.resolve('configService');
const mainLoggerService = diContainer.resolve('loggerService');
mainLoggerService.setContext("App");

// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(json());

// Attaching the Authentication and User Routes to the app.
app.use("/", configureAnalyzeRouter(diContainer));

const port = configService.get('PORT');
app.listen(port, () => {
  mainLoggerService.info(`Server listening on port: ${port}`);
});
  