const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const splitRoutes = require('./routes/splitRoutes');
const app = express();
const PORT = process.env.PORT || 3001;
// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SplitPay Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
// API routes
app.use('/api/splits', splitRoutes);
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 SplitPay Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Limpiar datos antiguos cada hora (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const SplitService = require('./services/SplitService');
    SplitService.cleanup();
  }, 60 * 60 * 1000); // 1 hora
}
