import { Request, Response } from 'express';
import { AnalyzeImageService } from '../services/analyze-images.service';

import type { AnalyzeInputDto } from '../dto/analyze-input.dto';
export class AnalyzeController {
  constructor(private readonly analyzeImageService: AnalyzeImageService) {}

  async analyze(req: Request<unknown, unknown, AnalyzeInputDto>, res: Response) {
    const analyzeInputDto = req.body;
    const matches = await this.analyzeImageService.analyzeByKeyword(analyzeInputDto);

    res.status(200).send({
      keyword: analyzeInputDto.keyword,
      matches
    });
  }
}