import { Request, Response } from 'express';

import type { analyzeInputDtoType } from '../dto/analyze-input.dto';
import { UnsplashService } from '../services/unsplash.service';

export class AnalyzeController {
  private readonly unsplashService: UnsplashService;

  constructor(unsplashService: UnsplashService) {
    this.unsplashService = unsplashService;
  }

  async analyze(req: Request<unknown, unknown, analyzeInputDtoType>, res: Response) {
    const payload = req.body;

    const response = await this.unsplashService.getPhotoUrlsForKeyword(payload.keyword);
    console.log("RESPONSE IS", response[0]);

    res.status(202).send({
      payload: payload,
      adam: 'adam'
    });

    return;
  }
}