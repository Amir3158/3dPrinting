// src/cron/printerHealth.route.ts
import axios from "axios";

let cachedHealthData: any = null;
let lastUpdated: Date | null = null;

export const fetchPrinterHealth = async () => {
    try {
        const connectionResponse = await axios.get(`${process.env.OCTOPRINT_PATH_PREFIX}/api/connection`, {
            headers: { "X-Api-Key": process.env.OCTOPRINT_API_KEY },
        });
        const printerResponse = await axios.get(`${process.env.OCTOPRINT_PATH_PREFIX}/api/printer`, {
            headers: { "X-Api-Key": process.env.OCTOPRINT_API_KEY },
        });

        const newHealthData = {
            connection: connectionResponse.data,
            printer: printerResponse.data,
        };

        // Check for changes in data
        if (JSON.stringify(newHealthData) !== JSON.stringify(cachedHealthData)) {
            cachedHealthData = newHealthData;
            lastUpdated = new Date();
            console.log(`[Health Check] Updated at ${lastUpdated.toISOString()}`);
            return { updated: true, data: cachedHealthData };
        }

        return { updated: false };
    } catch (error) {
        console.error("Failed to fetch printer health data:", error);
        cachedHealthData = { error: "Failed to fetch printer health data" };
        return { updated: true, error: "Printer health check failed" };
    }
};

export const getCachedHealthData = () => {
    return { data: cachedHealthData, lastUpdated };
};
