import { LoggerService } from "../../common/services/logger.service";
import { GoogleVisionService } from "./google-vision.service";
import { UnsplashService } from "./unsplash.service";

export class AnalyzeImageService {
  private static instance: AnalyzeImageService;

  private readonly unsplashService: UnsplashService;
  private readonly googleVisionService: GoogleVisionService;
  private readonly loggerService: LoggerService;

  private constructor(
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
    this.loggerService.log(`Fetching and analyzing images for "${keyword}"`);

    const imageUris = await this.unsplashService.getPhotoUrlsForKeyword(keyword, 10);
    const annotatedLabels = await this.googleVisionService.detectLabels(imageUris);

    console.log("Labels", annotatedLabels);
    return null;

    const sanitizedCheckLabels = labels.map(label => label.toLowerCase());

    for (const imageUri in annotatedLabels) {
      const sanitizedImageLabels = annotatedLabels[imageUri].map(label => label.toLowerCase());
      if (!this.doLabelsMatch(sanitizedCheckLabels, sanitizedImageLabels)) {
        delete annotatedLabels.imageUri;
      }
    }

    return annotatedLabels;
  }

  private doLabelsMatch(labels: string[], comparandLabels: string[]) {
    return labels.every(label => comparandLabels.includes(label));
  }

  static fetch(
    unsplashService: UnsplashService,
    googleVisionService: GoogleVisionService,
    loggerService: LoggerService,
  ) {
    if (!this.instance) {
      this.instance = new AnalyzeImageService(
        unsplashService,
        googleVisionService,
        loggerService
      );
    }

    return this.instance;
  }
}