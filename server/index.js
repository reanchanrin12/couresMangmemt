const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");
require('dotenv').config();

// Routers
const instructorRouter = require('./src/routes/instructorRoutes');
const courseRouter = require('./src/routes/courseRoutes');
const studentRouter = require('./src/routes/studentRoutes');
const enrollStudentRouter = require('./src/routes/enrollStudentRoutes');

// const upload = require('./src/middleware/uploadMiddlware');
// const upload = require('./src/middleware/uploadMiddleware');

const app = express();

// Built-in middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// API Routes with unique prefixes
app.use('/api/', instructorRouter);
app.use('/api/', studentRouter);
app.use('/api/', courseRouter);
app.use('/api/', enrollStudentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle Multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: `Upload failed: ${error.message}`,
    });
  } else if (error.message.includes('Only images')) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
