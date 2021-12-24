import express, { Request, Response, Application }  from 'express';
import cors from 'cors';
import exec from 'child_process';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8888;

const app:Application = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}));

app.get("/", (req:Request, res:Response) => {
    res.json({"sdf":"sdf"});
});

app.post('/', (req:Request, res:Response) => {
    if (!req.body.dockerImage) {
        res.json({status: "no image"});
    }
    const img = req.body.dockerImage;
    res.json({status: "processing image"});
});

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});
