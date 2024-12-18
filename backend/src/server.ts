import express, { Application } from 'express';
import dotenv from 'dotenv';
import router from "./routes";
import nodeCron from "node-cron";
import { fetchPrinterHealth } from "./service/printerHealth.service";
import { setupWebSocketServer, broadcast } from "./utils/wsServer";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app: Application = express();

setupWebSocketServer(app);

nodeCron.schedule("*/1 * * * *", async () => {
    const result = await fetchPrinterHealth();
    if (result.updated) {
        broadcast(result.error ? { error: result.error } : { data: result.data, lastUpdated: new Date().toISOString() });
    }
});

// Middleware
app.use(express.json());

app.use('/api', router);

app.listen(PORT,
    () => console.log(`Server is running on http://localhost:${PORT}`)
);
