# Test application for Ramd.am

## Usage instructions

1. Create a copy of the `.env.example` file and fill it with required data
2. Run `npm install` to install all dependencies
3. Run `npm build` to build the application
4. Run `npm start` to start the API

The API listens to a single endpoint only, `/analyze` for POST requests. The correct payload that should be sent looks like this:

```
{
  keyword: string,
  labels: string[]
}
```

## Notes

Besides the requested base functionalities the following things were added:

- A CacheService that is being used by the GoogleVision service, and caches annotated images and their returned labels for 60 minutes. This is only a basic, in-memory cache, so it will be flushed, once you restart the application
- A schema validation Middleware that can be reused for additional endpoints payload validation, using `zod`
- A basic logger service, that can be extended to have proper logging - it was added mainly for debugging purposes
- Implemented basic dependency injection using `awilix`
- Unit tests where written for all the services that the application uses

Additional notes:

- Because of the limitation of the Unsplash-JS Demo app, where only 50 requests can be made to the API in one hour, the system was hardcoded, that for each request, only a maximum of 50 images are requested by Unsplash. If the rate limit is still reached, the system should respond appropiatly with a 429 error code. If you want to remove this limitation, you can do so in the `analyze-image.service.ts` files line 30

## Considerations

The biggest challenge that I found while writing this test, were the ease-of-life improvements that were introduced in NestJS when writing Express based REST APIs. However, I found this challenge interesting to do, but I am not entirely sure if I structured it as it should have been structured in an Express JS API as I am more familiar with structuring code using NestJS module system.