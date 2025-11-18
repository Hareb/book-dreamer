import Replicate from 'replicate';
import { GeneratedImage, ImageStyle } from '../types';

export class ImageService {
  private client: Replicate | null = null;

  setApiKey(apiKey: string) {
    this.client = new Replicate({ auth: apiKey });
  }

  async generateImage(
    chapterId: string,
    prompt: string,
    style: ImageStyle
  ): Promise<GeneratedImage> {
    if (!this.client) {
      throw new Error('Replicate API key not set');
    }

    if (!prompt.trim()) {
      throw new Error('Empty prompt provided');
    }

    try {
      // Using Stable Diffusion XL for better quality and lower cost
      const output = await this.client.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt,
            negative_prompt: "ugly, distorted, low quality, blurry, text, watermark, signature",
            num_outputs: 1,
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: 1024,
            height: 768,
          },
        }
      ) as string[];

      if (!output || output.length === 0) {
        throw new Error('No image generated');
      }

      return {
        chapterId,
        url: output[0],
        prompt,
        style,
        timestamp: Date.now(),
        cached: false,
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}
