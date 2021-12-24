import express, { Request, Response, Application }  from 'express';
import cors from 'cors';
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
    console.log(req.body.dockerImage);
    // console.log('Got body:', req.body);

});

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});
