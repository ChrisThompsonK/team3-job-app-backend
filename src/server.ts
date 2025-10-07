import app from './index.js';
import 'dotenv/config';

const PORT = process.env['PORT'] || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});