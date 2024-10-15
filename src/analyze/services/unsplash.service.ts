import { createApi } from 'unsplash-js';
import { ConfigService } from '../../common/services/config.service';

type UnsplashAPIType = ReturnType<typeof createApi>;

type searchPhotosQuery = {
  query: string,
  page?: number,
  perPage?: number
}

export class UnsplashService {
  private static instance: UnsplashService;
  private readonly api: UnsplashAPIType; 

  private constructor(configService: ConfigService) {
    this.api = createApi({
      accessKey: configService.get("UNSPLASH_ACCESSKEY"), 
    });
  }

  async getPhotoUrlsForKeyword(query: string, maxResults: number = Infinity) {
    const photos: string[] = [];

    let page = 1;
    do {
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
    console.log("Searching usplash", queryDto);
    
    const response = await this.api.search.getPhotos({
      ...queryDto,
    });

    if (response.errors) {
      throw new Error(`Failed to get photos from Unsplash: ${response.errors.join(", ")}`);
    }

    return response.response;
  }

  static fetch(configService: ConfigService) {
    if (!this.instance) {
      this.instance = new this(configService);
    }

    return this.instance;
  }
}