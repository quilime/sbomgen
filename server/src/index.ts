import express, { Request, Response, Application }  from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
const fs = require('fs');

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8888;

const app:Application = express();
app.use(express.json());
app.use(cors({
    origin: (process.env.NODE_ENV == 'development' ? "*" : [ "https://sbomgen.com", "https://www.sbomgen.com" ]),
    optionsSuccessStatus: 200
}));

app.get("/", (req:Request, res:Response) => {
    res.json({
        server: "api.sbomgen.com",
        status: 200
    });
});

app.post('/', async (req:Request, res:Response) => {

    if (!req.body.dockerImage) {

        res.json({status: "No image"});
        return;

    } else {

        console.log(`processing image ${req.body.dockerImage} ...`);

        const syft = spawn('syft', [
            'packages',
            req.body.dockerImage,
            '--scope',
            'all-layers',
            '-o',
            'cyclonedx'
        ]);

        let scriptOutput = "";

        syft.stdout.setEncoding('utf8');
        syft.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        syft.stderr.setEncoding('utf8');
        syft.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            scriptOutput += data.toString();
        });

        syft.on('close', (code) => {
            console.log('closing code: ' + code);
            if (code == 1) {
                res.json({ error: scriptOutput });
            }
            if (code == 0) {
               res.json({ blob: scriptOutput });
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});
