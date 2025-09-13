import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();

// Add CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Initialize LocalLLM instance
let llm = null;

// Dynamic import and initialization
async function initializeLLM() {
  try {
    const { default: LocalLLM } = await import('./agents/LocalLLM.js');
    llm = new LocalLLM('./models/hf_giladgd_gpt-oss-20b.MXFP4.gguf');
    console.log('LocalLLM instance created, initializing model...');
    
    // Call the initialize method to load the model
    await llm.initialize();
    console.log('LocalLLM initialized successfully');
  } catch (error) {
    console.error('Failed to initialize LocalLLM:', error);
  }
}

// Initialize LLM
initializeLLM();

// API endpoint that returns LLM response about option trading
app.get('/', async (req, res) => {
  try {
    if (!llm) {
      return res.status(503).json({ error: 'LLM not initialized yet', details: 'Please wait for the model to load' });
    }
    
    const result = await llm.chat({
      prompt: "what is option trading",
      max_token: 200
    });
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('LLM Error:', error);
    res.status(500).json({ error: 'Failed to get LLM response', details: error.message });
  }
});

app.post('/', async (req, res) => {
  try {
    if (!llm) {
      return res.status(503).json({ error: 'LLM not initialized yet', details: 'Please wait for the model to load' });
    }
    
    const result = await llm.chat({
      prompt: "what is option trading",
      max_token: 200
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('LLM Error:', error);
    res.status(500).json({ error: 'Failed to get LLM response', details: error.message });
  }
});

// Start the server on port 9999, with fallback to other ports
const PORTS = [9999, 9998, 9997, 9996];
let currentPort = 0;

function tryStartServer() {
  if (currentPort >= PORTS.length) {
    console.error('Could not find an available port');
    if (process.send) {
      process.send({ type: 'server-error', error: 'No available ports' });
    }
    return;
  }

  const PORT = PORTS[currentPort];
  const server = app.listen(PORT, 'localhost', () => {
    console.log(`Web server running on http://localhost:${PORT}`);
    
    // Send a message to the parent process that the server is ready
    if (process.send) {
      process.send({ type: 'server-ready', port: PORT });
    }
  });

  // Handle port already in use
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORTS[currentPort]} is in use, trying next port...`);
      currentPort++;
      tryStartServer();
    } else {
      console.error('Server error:', err);
      if (process.send) {
        process.send({ type: 'server-error', error: err.message });
      }
    }
  });

  return server;
}

// Start the server
let server = tryStartServer();

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down server...');
  if (llm) {
    try {
      await llm.dispose();
    } catch (error) {
      console.error('Error disposing LLM:', error);
    }
  }
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down server...');
  if (llm) {
    try {
      await llm.dispose();
    } catch (error) {
      console.error('Error disposing LLM:', error);
    }
  }
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});