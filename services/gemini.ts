
import { GoogleGenAI } from "@google/genai";

export const generateTalkingHeadVideo = async (
  photoBase64: string,
  promptDescription: string,
  settings: {
    gestureIntensity: string;
    facialExpressiveness: string;
    backgroundStyle: string;
  }
) => {
  // Use process.env.API_KEY directly as per guidelines.
  // Initialization happens inside the function to ensure the latest selected key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Refined prompt for Veo based on user settings
  const finalPrompt = `
    A cinematic, ultra-realistic 1080p close-up talking head video. 
    Subject is the person in the provided photo. 
    Mood: Professional and elegant. 
    Motion: ${settings.facialExpressiveness} facial expressions, 
    ${settings.gestureIntensity} hand gestures and head movement, 
    natural blinking and gaze. 
    Context: ${promptDescription}. 
    Background: ${settings.backgroundStyle} setting with soft bokeh.
    The animation must look fluid and lifelike, suitable for a high-end personal brand presentation.
  `.trim();

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: finalPrompt,
      image: {
        imageBytes: photoBase64.split(',')[1],
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      // Polling interval of 10s as recommended in the documentation.
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed to return a URI.");

    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Gemini Video Generation Error:", error);
    throw error;
  }
};
