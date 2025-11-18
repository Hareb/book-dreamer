import Anthropic from '@anthropic-ai/sdk';
import { SceneDescription, ImageStyle } from '../types';

export class AIService {
  private client: Anthropic | null = null;

  setApiKey(apiKey: string) {
    this.client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  }

  async extractSceneDescription(
    chapterId: string,
    chapterContent: string,
    style: ImageStyle
  ): Promise<SceneDescription> {
    if (!this.client) {
      throw new Error('Anthropic API key not set');
    }

    if (!chapterContent.trim()) {
      return {
        chapterId,
        description: 'Empty chapter',
        imagePrompt: '',
        timestamp: Date.now(),
      };
    }

    // Limit content to first 3000 characters to save tokens
    const truncatedContent = chapterContent.slice(0, 3000);

    const stylePrompts = {
      realistic: 'photorealistic, detailed, cinematic lighting',
      artistic: 'artistic, painterly, impressionistic, vibrant colors',
      minimalist: 'minimalist, simple, clean lines, muted colors',
    };

    const message = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Analyze this chapter from a book and extract the main visual scene that would make the best illustration.

Chapter content:
${truncatedContent}

Provide:
1. A brief description of the main scene (2-3 sentences)
2. A detailed image generation prompt for Stable Diffusion that captures the atmosphere, setting, and key visual elements

The image style should be: ${style} (${stylePrompts[style]})

Format your response as JSON:
{
  "description": "brief scene description",
  "imagePrompt": "detailed Stable Diffusion prompt including style, atmosphere, lighting, composition"
}`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        chapterId,
        description: parsed.description || 'Scene description',
        imagePrompt: parsed.imagePrompt || '',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        chapterId,
        description: 'Could not extract scene',
        imagePrompt: '',
        timestamp: Date.now(),
      };
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}
