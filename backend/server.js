const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();  
const connectDB = require('./db/connectDB');

const PORT = process.env.PORT || 5000;

try {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
catch (error) {
  console.error('Error starting the server:', error);
}
