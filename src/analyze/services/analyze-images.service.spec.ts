import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { UnsplashService } from "./unsplash.service";
import { GoogleVisionService } from "./google-vision.service";
import { LoggerService } from "../../common/services/logger.service";
import { AnalyzeImageService } from "./analyze-images.service";

describe("AnalyzeImageService", () => {
  let analyzeImageService: AnalyzeImageService;
  let unsplashService: DeepMocked<UnsplashService> = createMock<UnsplashService>();
  let googleVisionService: DeepMocked<GoogleVisionService> = createMock<GoogleVisionService>();
  let loggerService: DeepMocked<LoggerService> = createMock<LoggerService>();

  beforeAll(() => {
    analyzeImageService = new AnalyzeImageService(unsplashService, googleVisionService, loggerService);
  });

  it('should be able to analyze images based on keywords and labels and return only images that have all the labels present', async () => {
    unsplashService.getPhotoUrlsForKeyword.mockResolvedValueOnce(['url1', 'url2', 'url3']);
    googleVisionService.detectLabels.mockResolvedValueOnce({
      'url1': ['label1', 'label2', 'label3'],
      'url2': ['label1', 'label4'],
      'url3': ['label1', 'label2']
    });

    const analyzeImageResponse = await analyzeImageService.analyzeByKeyword('keyword', ['label1', 'label2']);
    expect(analyzeImageResponse.length).toBeDefined();
    expect(analyzeImageResponse.length).toBe(2);
  
    const validResults = ['url1', 'url3'];
    for (const imageResponse of analyzeImageResponse) {
      expect(validResults.includes(imageResponse.image_url)).toBe(true);
    }
  });
});