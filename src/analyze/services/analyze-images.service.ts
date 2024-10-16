import { LoggerService } from "../../common/services/logger.service";
import { AnalyzeInputDto } from "../dto/analyze-input.dto";
import { GoogleVisionService } from "./google-vision.service";
import { UnsplashService } from "./unsplash.service";

export class AnalyzeImageService {
  private readonly unsplashService: UnsplashService;
  private readonly googleVisionService: GoogleVisionService;
  private readonly loggerService: LoggerService;

  constructor(
    unsplashService: UnsplashService,
    googleVisionService: GoogleVisionService,
    loggerService: LoggerService,
  ) {
    this.unsplashService = unsplashService;
    this.googleVisionService = googleVisionService;
    this.loggerService = loggerService;

    this.loggerService.setContext(AnalyzeImageService.name);
  }

  async analyzeByKeyword(analyzeInputDto: AnalyzeInputDto) {
    this.loggerService.info(`Fetching and analyzing images for "${analyzeInputDto.keyword}"`);

    const response: Array<{
      image_url: string,
      labels: string[]
    }> = [];

    const imageUris = await this.unsplashService.getPhotoUrlsForKeyword(analyzeInputDto.keyword, analyzeInputDto.max ?? 16);
    const annotatedLabels = await this.googleVisionService.detectLabels(imageUris);

    const sanitizedCheckLabels = analyzeInputDto.labels.map(label => label.toLowerCase());
    for (const imageUri in annotatedLabels) {
      const sanitizedImageLabels = annotatedLabels[imageUri].map(label => label.toLowerCase());
      if (this.doLabelsMatch(sanitizedCheckLabels, sanitizedImageLabels)) {
        response.push({
          image_url: imageUri,
          labels: annotatedLabels[imageUri]
        });
      }
    }

    this.loggerService.info(`Found ${response.length} images with matching labels`);
    return response;
  }

  private doLabelsMatch(labels: string[], comparandLabels: string[]) {
    return labels.every(label => comparandLabels.includes(label));
  }
}