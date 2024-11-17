import app from './app.ts';
import { AppDataSource } from './config/db.ts';

AppDataSource.initialize()
   .then((db) => {
      console.log('database connected', db.isInitialized);
   })
   .catch((error) => console.error('Database connection failed:', error));
app.listen(5000, '0.0.0.0', () => {
   console.log('CareConnect API is running on port 5000');
});
