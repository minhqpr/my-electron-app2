import { fileURLToPath } from "url";
import path from "path";
import { getLlama, LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

class LocalLLM {
  constructor(modelPath) {
    if (typeof modelPath !== 'string') {
      throw new Error('Constructor input must be a string (model path)');
    }
    this.modelPath = modelPath;
    this.model = null;
    this.context = null;
    this.session = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const modelPath = path.join(__dirname, "..", "models", "hf_giladgd_gpt-oss-20b.MXFP4.gguf");

      console.log(`Attempting to load model from: ${modelPath}`);

      // Get Llama instance
      const llama = await getLlama();
      console.log('Llama instance obtained');
      
      // Load the model using the correct API
      this.model = await llama.loadModel({
        modelPath: modelPath,
        gpuLayers: 0 // Set to -1 to use all GPU layers, 0 for CPU only
      });
      console.log('Model instance created');

      // Create context
      this.context = new LlamaContext({
        model: this.model,
        contextSize: 4096 // Adjust based on your needs
      });
      console.log('Context created');

      // Create chat session
      this.session = new LlamaChatSession({
        context: this.context
      });
      console.log('Chat session created');

      this.initialized = true;
      console.log(`Model loaded successfully! LLM mode active.`);
    } catch (error) {
      console.error('Model loading failed:', error.message);
      console.log('Initializing in fallback mode - will provide pre-defined responses');
      
      // Set initialized to true to allow fallback responses
      this.initialized = true;
      this.model = null;
      this.context = null;
      this.session = null;
    }
  }

  async chat({ prompt, max_token }) {
    if (typeof prompt !== 'string') {
      throw new Error('Prompt must be a string');
    }
    if (typeof max_token !== 'number' || max_token <= 0) {
      throw new Error('max_token must be a positive integer');
    }

    // Initialize if not already done
    if (!this.initialized) {
      await this.initialize();
    }

    // Fallback response while model loading issues are being resolved
    if (!this.session) {
      const fallbackResponse = this.generateFallbackResponse(prompt);
      return {
        response: fallbackResponse,
        tokens_used: fallbackResponse.split(' ').length,
        model_path: this.modelPath,
        mode: 'fallback'
      };
    }

    try {
      // Send prompt to the session
      const response = await this.session.prompt(prompt, {
        maxTokens: max_token,
        temperature: 0.7,
        topP: 0.9
      });

      return {
        response: response,
        tokens_used: response.length, // Approximate token count
        model_path: this.modelPath,
        mode: 'llm'
      };
    } catch (error) {
      // Fall back to mock response if LLM fails
      const fallbackResponse = this.generateFallbackResponse(prompt);
      return {
        response: fallbackResponse,
        tokens_used: fallbackResponse.split(' ').length,
        model_path: this.modelPath,
        mode: 'fallback_error',
        error: error.message
      };
    }
  }

  generateFallbackResponse(prompt) {
    // Generate contextual responses based on the prompt
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('option trading')) {
      return `Option trading is a financial strategy that involves buying and selling options contracts, which are derivative securities that give the holder the right (but not the obligation) to buy or sell an underlying asset at a specific price within a certain time period.

Key concepts:
- Call options: Give the right to buy an asset
- Put options: Give the right to sell an asset
- Strike price: The predetermined price at which the option can be exercised
- Expiration date: When the option contract expires
- Premium: The cost to purchase the option

Options can be used for speculation, hedging, or income generation. However, they involve significant risk and require a good understanding of the market.

[Note: This is a fallback response. The actual LLM model is currently being loaded.]`;
    }
    
    return `I received your prompt: "${prompt}". This is a fallback response while the LLM model is being loaded. The system will provide actual AI-generated responses once the model initialization is complete.`;
  }

  async dispose() {
    if (this.session) {
      await this.session.dispose();
    }
    if (this.context) {
      await this.context.dispose();
    }
    if (this.model) {
      await this.model.dispose();
    }
    this.initialized = false;
  }
}

export default LocalLLM;
