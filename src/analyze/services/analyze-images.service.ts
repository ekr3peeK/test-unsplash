import { LoggerService } from "../../common/services/logger.service";
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

  async analyzeByKeyword(keyword: string, labels: string[]) {
    this.loggerService.info(`Fetching and analyzing images for "${keyword}"`);

    const response: Array<{
      image_url: string,
      labels: string[]
    }> = [];

    const imageUris = await this.unsplashService.getPhotoUrlsForKeyword(keyword, 40);
    const annotatedLabels = await this.googleVisionService.detectLabels(imageUris);

    const sanitizedCheckLabels = labels.map(label => label.toLowerCase());
    for (const imageUri in annotatedLabels) {
      const sanitizedImageLabels = annotatedLabels[imageUri].map(label => label.toLowerCase());
      if (this.doLabelsMatch(sanitizedCheckLabels, sanitizedImageLabels)) {
        response.push({
          image_url: imageUri,
          labels: annotatedLabels[imageUri]
        });
      }
    }

    return response;
  }

  private doLabelsMatch(labels: string[], comparandLabels: string[]) {
    return labels.every(label => comparandLabels.includes(label));
  }
}