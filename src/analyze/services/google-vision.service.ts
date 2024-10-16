import { ImageAnnotatorClient, protos } from '@google-cloud/vision';
import { LoggerService } from '../../common/services/logger.service';
import { chunk } from 'lodash';
import { CacheService } from '../../common/services/cache.service';
import { google } from '@google-cloud/vision/build/protos/protos';
import { ApiException } from '../../common/exceptions/api.exception';


type labelResponse = {
  [uri: string]: string[]
}

export class GoogleVisionService {
  /** The maximum number of requests that can be sent as a batch to google vision is 16 according to the documentation */
  public readonly MAX_REQUESTS_PER_BATCH = 16;

  private visionClient: ImageAnnotatorClient;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly cacheService: CacheService<string[]>
  ) {
    this.loggerService.setContext(GoogleVisionService.name);
    this.visionClient = new ImageAnnotatorClient();
  }

  async detectLabels(urls: string | string[]) {
    if (!Array.isArray(urls)) urls = [urls];
    
    this.loggerService.info(`Collecting label information for ${urls.length} images`);

    const labelResponse: labelResponse = {};
    const uncachedUrls = urls.filter(url => {
      const cacheData = this.cacheService.get(url);
      if (!cacheData) return true;
      
      labelResponse[url] = cacheData;
      return false;
    });

    this.loggerService.debug(`Collected label information from cache for ${urls.length - uncachedUrls.length} images`);

    const requests = uncachedUrls.map(url => this.createLabelDetectionRequest(url));
    const chunkedRequests = chunk(requests, this.MAX_REQUESTS_PER_BATCH);
    const annotateImageResponse: google.cloud.vision.v1.IAnnotateImageResponse[] = [];

    for (const requestChunk of chunkedRequests) {
      this.loggerService.debug(`Requesting label information for a chunk of ${requestChunk.length} image uris`);

      const [result] = await this.visionClient.batchAnnotateImages({
        requests: requestChunk
      });

      if (!result.responses) {
        this.loggerService.error(`Invalid response received from google vision API`);
        throw new ApiException("An unexpected error has occured, while trying to communicate with GoogleVision.");
      }

      annotateImageResponse.push(...result.responses);
    }

    for (const responseIndex in annotateImageResponse) {
      const response = annotateImageResponse[responseIndex];
      const responseUri = uncachedUrls[responseIndex];
      const labelStrings = (response.labelAnnotations?.map(label => label.description).filter(Boolean) as string[]) ?? [];

      this.loggerService.debug(`Labels found for ${responseUri}: ${JSON.stringify(labelStrings)}`);
      labelResponse[responseUri] = labelStrings;
      this.cacheService.set(responseUri, labelStrings, 60);
    }

    return labelResponse;
  }

  private createLabelDetectionRequest(url: string): protos.google.cloud.vision.v1.IAnnotateImageRequest {
    return {
      image: { 
        source: { 
          imageUri: url 
        }
      },
      features: [{ type: "LABEL_DETECTION" }]
    }
  }
}