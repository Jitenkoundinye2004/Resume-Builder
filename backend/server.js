import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import imageKit from './configs/imageKit.js';




const app = express();
const PORT = process.env.PORT || 5000;



//DB Connection
await connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());



//first route home route
app.get('/', (req, res) => 
res.send('Server is running'));

app.use('/api/users',userRoutes);

app.use('/api/resumes', resumeRouter);
app.use('/api/ai',aiRouter)


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


