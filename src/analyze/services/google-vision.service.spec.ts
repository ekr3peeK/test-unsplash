import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { LoggerService } from "../../common/services/logger.service";
import { GoogleVisionService } from './google-vision.service';
import { CacheService } from '../../common/services/cache.service';
import { ImageAnnotatorClient, protos } from '@google-cloud/vision';
import { uniqueId } from 'lodash';


let imageAnnotatorClient: DeepMocked<ImageAnnotatorClient>;

jest.mock('@google-cloud/vision', () => ({
  ImageAnnotatorClient: jest.fn().mockImplementation(() => {
    const imageAnnotatorClientMock = createMock<ImageAnnotatorClient>();
    imageAnnotatorClient = imageAnnotatorClientMock;
    return imageAnnotatorClientMock;
  })
}));


describe("GoogleVisionService", () => {
  let googleVisionService: GoogleVisionService;
  let cacheService: DeepMocked<CacheService<string[]>> = createMock<CacheService<string[]>>();
  let loggerService: DeepMocked<LoggerService> = createMock<LoggerService>();

  beforeAll(() => {
    googleVisionService = new GoogleVisionService(loggerService, cacheService);
  });

  beforeEach(() => {
    imageAnnotatorClient.batchAnnotateImages.mockImplementation(async (_request) => {
      return [{
        responses: []
      }]
    });

    cacheService.get.mockReturnValue(undefined);
  });

  afterEach(() => {
    imageAnnotatorClient.batchAnnotateImages.mockReset();
    cacheService.get.mockReset();
  })

  it('should throw an error if no responses were received', async () => {
    imageAnnotatorClient.batchAnnotateImages.mockImplementationOnce(async (_request) => {
      return [{
        responses: undefined
      }]
    });

    expect(googleVisionService.detectLabels(['url1', 'url2'])).rejects.toThrow();
  });

  it('should return an object with each supplied url as a property, and each value being an array of labels found by the vision service', async () => {
    imageAnnotatorClient.batchAnnotateImages.mockImplementation(async (data) => {
      const responses: protos.google.cloud.vision.v1.IAnnotateImageResponse[] = [];

      for (const _request of data.requests!) {
        responses.push({
          labelAnnotations: [{
            description: uniqueId('label-')
          }]
        })
      }

      return [{
        responses
      }]
    });

    const requests = ['url1', 'url2', 'url3', 'url4'];
    const response = await googleVisionService.detectLabels(requests);

    for (const requestUrl of requests) {
      expect(response[requestUrl]).toBeDefined();
      expect(response[requestUrl].length).toBeDefined();
    }
  });

  it('should batch requests based on the internal batch value', async () => {
    const requests = Array.from({ length: 2.5 * googleVisionService.MAX_REQUESTS_PER_BATCH }, () => uniqueId());
    await googleVisionService.detectLabels(requests);

    expect(imageAnnotatorClient.batchAnnotateImages).toHaveBeenCalledTimes(3);
  });

  it('should only call the vision service for uncached urls', async () => {
    const cachedUrls = ['url1', 'url2'];
    const uncachedUrls = ['url3', 'url4', 'url5'];

    cacheService.get.mockImplementation((key) => {
      if (cachedUrls.includes(key)) {
        return ['cached-label'];
      } else {
        return undefined;
      } 
    });

    
    await googleVisionService.detectLabels([...cachedUrls, ...uncachedUrls]);
    const callParam = imageAnnotatorClient.batchAnnotateImages.mock.calls[0][0];
    expect(callParam.requests).toBeDefined();
    expect(callParam.requests?.length).toBeDefined();
    expect(callParam.requests?.length).toBe(3);
  });
});