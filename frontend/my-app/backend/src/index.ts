import express from 'express';
import cors from 'cors';
import componentsRouter from './routes/components';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', componentsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 