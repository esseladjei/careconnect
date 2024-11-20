import app from './app.js';
import { AppDataSource } from './config/db.js';

const startServer = () => {
   return new Promise<string>((resolve, reject) => {
      app.listen(5000, '0.0.0.0', () => {
         resolve('CareConnect API is running on port 5000');
      }).on('error', (error) => {
         reject(error);
      });
   });
};
(async () => {
   try {
      const response = await AppDataSource.initialize();
      if (response.isInitialized) {
         const serverResponse = await startServer();
         console.log(serverResponse);
      } else {
         console.error('Database connection was not initialize:');
      }
   } catch (error) {
      console.error('Database connection failed:', error);
   }
})();
