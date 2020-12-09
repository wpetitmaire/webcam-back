import express from 'express';

export const app = express();
const port: number = 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World 👋');
});

app.listen(port, () => console.log(`Back webcam branchée sur http://localhost:${port}`));

