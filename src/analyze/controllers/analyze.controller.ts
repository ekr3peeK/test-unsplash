import { Request, Response } from 'express';
import { AnalyzeImageService } from '../services/analyze-images.service';

import type { AnalyzeInputDto } from '../dto/analyze-input.dto';
export class AnalyzeController {
  constructor(private readonly analyzeImageService: AnalyzeImageService) {}

  async analyze(req: Request<unknown, unknown, AnalyzeInputDto>, res: Response) {
    const payload = req.body;
    const matches = await this.analyzeImageService.analyzeByKeyword(payload.keyword, payload.labels);

    res.status(202).send({
      keyword: payload.keyword,
      matches
    });
  }
}