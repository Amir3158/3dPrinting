import { Router } from "express";
import {getCachedHealthData} from "../service/printerHealth.service";

const router = Router();

router.get('/health',(req, res) => {
    const healthData = getCachedHealthData();
    if(!healthData.data) {
        res.status(503).json({ error: "Health data not available yet"})
    }
    res.json(healthData.data);
})

export default router;