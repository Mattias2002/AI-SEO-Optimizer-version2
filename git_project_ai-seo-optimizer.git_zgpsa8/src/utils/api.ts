import type { SEOResult } from '../types';

export async function analyzeImage(imageFile: File, customPrompt?: string): Promise<SEOResult> {
  try {
    // Convert image to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    const defaultPrompt = 'Generate a JSON response with the following fields for this image:\n{\n  "title": "SEO-optimized title (max 60 chars)",\n  "description": "Compelling product description (150-160 chars)",\n  "tags": ["array", "of", "relevant", "keywords"]\n}';
    
    const prompt = customPrompt 
      ? `${customPrompt}\n\nFormat the response as JSON with the following structure:\n{\n  "title": "string (max 60 chars)",\n  "description": "string (150-160 chars)",\n  "tags": ["array", "of", "strings"]\n}`
      : defaultPrompt;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to analyze image');
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API Response:', data);
      throw new Error('Invalid response format from API');
    }

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      
      // Validate the response structure
      if (!parsedContent.title || typeof parsedContent.title !== 'string') {
        throw new Error('Invalid response: missing or invalid title');
      }
      if (!parsedContent.description || typeof parsedContent.description !== 'string') {
        throw new Error('Invalid response: missing or invalid description');
      }
      if (!Array.isArray(parsedContent.tags) || !parsedContent.tags.every(tag => typeof tag === 'string')) {
        throw new Error('Invalid response: missing or invalid tags array');
      }

      return {
        title: parsedContent.title,
        description: parsedContent.description,
        tags: parsedContent.tags
      };
    } catch (parseError) {
      console.error('Parse Error:', parseError, '\nAPI Response:', data.choices[0].message.content);
      throw new Error('Failed to parse API response');
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze image');
  }
}
