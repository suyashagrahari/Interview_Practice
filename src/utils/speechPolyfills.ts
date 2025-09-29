import SpeechRecognition from 'react-speech-recognition';

export interface PolyfillConfig {
  speechly?: {
    appId: string;
  };
  azure?: {
    subscriptionKey: string;
    region: string;
  };
}

export class SpeechPolyfillManager {
  private static instance: SpeechPolyfillManager;
  private polyfillApplied = false;

  static getInstance(): SpeechPolyfillManager {
    if (!SpeechPolyfillManager.instance) {
      SpeechPolyfillManager.instance = new SpeechPolyfillManager();
    }
    return SpeechPolyfillManager.instance;
  }

  async initializePolyfills(config?: PolyfillConfig): Promise<boolean> {
    if (this.polyfillApplied) return true;

    // Check if native support exists
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      console.log('Native speech recognition available');
      return true;
    }

    try {
      // Try Speechly polyfill first (if configured)
      if (config?.speechly?.appId) {
        // Dynamic import to avoid bundle size issues
        const { createSpeechlySpeechRecognition } = await import('@speechly/speech-recognition-polyfill');
        const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(
          config.speechly.appId
        );
        SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);
        this.polyfillApplied = true;
        console.log('Speechly polyfill applied');
        return true;
      }

      // Fallback to Azure (if configured)
      if (config?.azure?.subscriptionKey && config?.azure?.region) {
        // Dynamic import to avoid bundle size issues
        const createSpeechServicesPonyfill = await import('web-speech-cognitive-services');
        const { SpeechRecognition: AzureSpeechRecognition } = 
          createSpeechServicesPonyfill.default({
            credentials: {
              region: config.azure.region,
              subscriptionKey: config.azure.subscriptionKey,
            },
          });
        SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
        this.polyfillApplied = true;
        console.log('Azure Cognitive Services polyfill applied');
        return true;
      }

      console.warn('No polyfill configuration provided');
      return false;
    } catch (error) {
      console.error('Failed to initialize speech polyfills:', error);
      return false;
    }
  }

  async loadOfflineFallback(): Promise<boolean> {
    try {
      // Dynamic import of Whisper.js for offline functionality
      console.log('Loading offline speech recognition...');
      
      // This is a simplified example - you'll need to implement
      // the full Whisper.js integration based on your needs
      return true;
    } catch (error) {
      console.error('Failed to load offline fallback:', error);
      return false;
    }
  }
}
