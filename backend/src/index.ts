import express from 'express';
import routes from './routes';
import { connectToDatabase } from './database';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

connectToDatabase().then(() => {
    console.log('Database is ready');

    app.use('/', routes);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to initialize application due to database issues', err);
});
