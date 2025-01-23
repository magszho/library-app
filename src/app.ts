import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../static')));
app.get("/test", (req: Request, res: Response) => {
    res.send("here's a silly message");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'website.html'));
});


app.listen(port, () => {
console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;