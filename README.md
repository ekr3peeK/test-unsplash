# Test application for Ramd.am

## Usage instructions

1. Create a copy of the `.env.example` file and fill it with required data
2. Run `npm install` to install all dependencies
3. Run `npm run build` to build the application
4. Run `npm run start` to start the API

The API listens to a single endpoint only, `/analyze` for POST requests. The correct payload that should be sent looks like this:

```
{
  keyword: string,
  labels: string[],
  max?: number // Introduced to not break the rate limit on the Demo APP provided by Unsplash. If ommited, a maximum of 16 images will be requested from Unsplash
}
```

To run the tests, you can use, `npm run test`.

## Notes

Besides the requested base functionalities the following things were added:

- A CacheService that is being used by the GoogleVision service, and caches annotated images and their returned labels for 60 minutes. This is only a basic, in-memory cache, so it will be flushed, once you restart the application
- A schema validation Middleware that can be reused for additional endpoints payload validation, using `zod`
- A basic logger service, that can be extended to have proper logging - it was added mainly for debugging purposes
- Implemented basic dependency injection using `awilix`
- Unit tests where written for all the services that the application uses

Additional notes:

- Because of the limitation of the Unsplash-JS Demo app, where only 50 requests can be made to the API in one hour, **the "max" parameter was introduced to the API endpoint, to limit the number of images requested by Unsplash**. The default query to unsplash, can return 10 images per page, and pagination occurs which requires an additional request afterwards. If the rate limit is reached, the system should respond appropiatly with a 429 error code. I did not add the CacheService to the UnsplashService, as during my tests, it seems to me that unsplash-js has it's own caching mechanism in place, and does not send the same request again multiple times.
- Only basic sanitization is being performed on the input and output parameters. As Google Vision is returning the labels with uppercase starting characters, every returned label is lowercased before being compared both on the input side and on the output side. Later on, the software should be prepared to handle additional edge cases (ex. like how Google lables have spacing in their names) which were not handled in this naive example, as it would extend the scope of it considerably.
- The slowest part of the API are requests made to the Google Vision service. It is possible, that those batch requests could be paralelized, but without actual information on limits and settings for the provided credentials, I decided to not go with this.

## Considerations

The biggest challenge that I found while writing this test, were the ease-of-life improvements that were introduced in NestJS when writing Express based REST APIs. However, I found this challenge interesting to do, but I am not entirely sure if I structured it as it should have been structured in an Express JS API as I am more familiar with structuring code using NestJS module system.

## Fun facts

Unsplash contains some very very dark images, you should try searching for the keyword `clown` with the labels `fun` ;)