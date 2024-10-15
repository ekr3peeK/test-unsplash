import { ImageAnnotatorClient, protos } from '@google-cloud/vision';


type labelResponse = {
  [uri: string]: string[]
}

export class GoogleVisionService {
  private static instance: GoogleVisionService;

  private visionClient: ImageAnnotatorClient;

  constructor() {
    this.visionClient = new ImageAnnotatorClient();
  }

  async detectLabels(urls: string | string[]) {
    if (!Array.isArray(urls)) urls = [urls];
    
    const requests = [];
    for (const url of urls) {
      requests.push(this.createLabelDetectionRequest(url));
    }

    const [result] = await this.visionClient.batchAnnotateImages({
      requests
    });
    
    const labelResponse: labelResponse = {};

    if (!result.responses) {
      throw new Error("Invalid response received");
    }

    for (const responseIndex in result.responses) {
      const response = result.responses[responseIndex];
      const responseUri = urls[responseIndex];

      labelResponse[responseUri] = response.labelAnnotations?.map(label => label.description) as string[];
    }
    
    return labelResponse;
  }

  static fetch() {
    if (!this.instance) {
      this.instance = new GoogleVisionService();
    }

    return this.instance;
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