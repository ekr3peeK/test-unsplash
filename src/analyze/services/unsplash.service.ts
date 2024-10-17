import { createApi } from 'unsplash-js';
import { ConfigService } from '../../common/services/config.service';
import { LoggerService } from '../../common/services/logger.service';
import { ApiException } from '../../common/exceptions/api.exception';
import { BadRequestException } from '../../common/exceptions/bad-request.exception';

type UnsplashAPIType = ReturnType<typeof createApi>;

type searchPhotosQuery = {
  query: string,
  page?: number,
  perPage?: number
}

export class UnsplashService {
  private readonly api: UnsplashAPIType; 

  constructor(
    private readonly configService: ConfigService, 
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext(UnsplashService.name);

    this.api = createApi({
      accessKey: this.configService.get("UNSPLASH_ACCESSKEY"), 
    });
  }

  async getPhotoUrlsForKeyword(query: string, maxResults: number = Infinity) {
    if (maxResults < 1) {
      throw new BadRequestException("The max results, if specified, should be a positive number");
    }

    this.loggerService.info(`Searching for photos based on the keyword: ${query}. Maximum results to look for is: ${maxResults}`);

    let page = 1;
    const photos: string[] = [];

    do {
      this.loggerService.debug(`Performing paginated search on page ${page}`);

      const response = await this.searchPhotos({
        query,
        page,
        perPage: 10
      });

      photos.push(...response.results.map(result => result.urls.raw));

      if (response.total_pages > page && photos.length < maxResults) page++;
      else break;
    } while (true);

    return photos.slice(0, maxResults);
  }

  private async searchPhotos(queryDto: searchPhotosQuery) {
    this.loggerService.debug(`Performing search on unsplash api for: ${JSON.stringify(queryDto)}`);
    
    try {
      const response = await this.api.search.getPhotos({
        ...queryDto,
      });

      if (response.errors) {
        this.loggerService.error(`Search failed for: ${JSON.stringify(queryDto)}`);
        throw new Error(`Failed to get photos from Unsplash: ${response.errors.join(", ")}`);
      }
  
      return response.response;
    } catch {
      throw new ApiException("Failed to fetch photos from unsplash - it is possible that rate limit has been reached, please try again later", 429);
    }
  }
}