import express, { json } from 'express';
import { router as AnalyzeRouter } from './analyze/route';
import { ConfigService } from './common/services/config.service';

const app = express();
const configService = ConfigService.fetch();




// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(json());

// Attaching the Authentication and User Routes to the app.
app.use("/", AnalyzeRouter);

app.listen(configService.get('PORT'), () => {
  console.log("Server Listening on PORT:", configService.get('PORT'));
});
  