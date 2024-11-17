import app from './app.ts';
import { AppDataSource } from './config/db.ts';

AppDataSource.initialize()
   .then((db) => {
      console.log('database connected', db.isInitialized);
      app.listen(5000, () => {
         console.log('CareConnect API is running on port 5000');
      });
   })
   .catch((error) => console.error('Database connection failed:', error));
