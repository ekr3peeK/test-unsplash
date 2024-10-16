import { createApi } from 'unsplash-js';
import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { UnsplashService } from "./unsplash.service";
import { LoggerService } from "../../common/services/logger.service";
import { ConfigService } from "../../common/services/config.service";
import { uniqueId } from 'lodash';

type UnsplashApi = ReturnType<typeof createApi>;

let searchApiMock: DeepMocked<UnsplashApi['search']>;

jest.mock('unsplash-js', () => ({
  createApi: () => {
    const searchMock = createMock<UnsplashApi['search']>();
    const mock = createMock<ReturnType<typeof createApi>>({
      search: searchMock
    });

    searchApiMock = searchMock;
    return mock;
  }
}));

const createRandomUnsplashResults = (numberOfResults: number) => {
  return Array.from({ length: numberOfResults }, () => ({
    urls: {
      raw: uniqueId()
    }
  }))
}

describe("AnalyzeImageService", () => {
  let unsplashService: UnsplashService;
  let configService: DeepMocked<ConfigService> = createMock<ConfigService>();
  let loggerService: DeepMocked<LoggerService> = createMock<LoggerService>();

  beforeAll(() => {
    unsplashService = new UnsplashService(configService, loggerService);
  });

  beforeEach(() => {
    searchApiMock.getPhotos.mockResolvedValue({
      response: {
        results: createRandomUnsplashResults(10),
        total_pages: 5,
        total: 50,
      }
    } as any);
  });

  afterEach(() => {
    searchApiMock.getPhotos.mockReset();
  })

  it('should throw an error if photo searching throws an exception or the api returns an error', async () => {
    searchApiMock.getPhotos.mockImplementationOnce(() => {
      throw new Error("Rate limited reached");
    });

    expect(unsplashService.getPhotoUrlsForKeyword('test')).rejects.toThrow();

    searchApiMock.getPhotos.mockResolvedValueOnce({
      response: {
        errors: []
      }
    } as any);
    expect(unsplashService.getPhotoUrlsForKeyword('test')).rejects.toThrow();
  });

  it('should paginate requests until hardcoded limit is reached, or while there are new pages to fetch', async () => {
    await unsplashService.getPhotoUrlsForKeyword('test', 25);
    expect(searchApiMock.getPhotos).toHaveBeenCalledTimes(3);

    searchApiMock.getPhotos.mockClear();
    await unsplashService.getPhotoUrlsForKeyword('test');
    expect(searchApiMock.getPhotos).toHaveBeenCalledTimes(5);
  })

  it('should return only the limited amount even if more data was fetched', async () => {
    const response = await unsplashService.getPhotoUrlsForKeyword('test', 5);
    expect(response.length).toBeDefined();
    expect(response.length).toBe(5);
  });

  it('should throw an error if an invalid max results parameter is supplied', async () => {
    expect(unsplashService.getPhotoUrlsForKeyword('test', 0)).rejects.toThrow();
    expect(unsplashService.getPhotoUrlsForKeyword('test', -10)).rejects.toThrow();
  });

  it('should pass the query string as is to the unsplash API', async () => {
    await unsplashService.getPhotoUrlsForKeyword('my query string', 10);
    expect(searchApiMock.getPhotos.mock.calls[0][0].query).toBe('my query string');
  });
});