import React, { useEffect, useState } from "react";
import {fetchPrinterHealthStatus} from "../utill/api";

// interface PrinterStatus {
//   connection: {
//     current: {
//       state: string;
//     };
//   };
//   printer: {
//     state: {
//       flags: {
//         operational: boolean;
//         printing: boolean;
//         paused: boolean;
//         error: boolean;
//       };
//     };
//     temperature: {
//       tool0: { actual: number };
//       bed: { actual: number };
//     };
//   };
// }

// interface HealthUpdate {
//   data?: {
//     connection: PrinterStatus["connection"];
//     printer: PrinterStatus["printer"];
//   };
//   lastUpdated?: string;
//   error?: string;
// }

const PrinterHealth = () => {
  const [status, setStatus] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    // Fetch initial data from the API
    const fetchInitialStatus = async () => {
      try {
        const response = await fetchPrinterHealthStatus()
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError("Failed to fetch initial printer status.");
        console.error(err);
      }
    };

    fetchInitialStatus();

    // Connect to WebSocket
    const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.error) {
        setError(message.error);
      } else {
        setStatus(message);
        setError(null);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection error.");
    };

    ws.onclose = () => {
      setError("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!status) return <div>Loading...</div>;

  const { data, lastUpdated } = status;

  if (data) {
    const { connection, printer } = data;

    return (
        <div>
          <h2>3D Printer Health Check</h2>
          <p><strong>Last Updated:</strong> {new Date(lastUpdated).toLocaleString()}</p>
          <p><strong>Connection State:</strong> {connection.current.state}</p>
          <p><strong>Operational:</strong> {printer.state.flags.operational ? "Yes" : "No"}</p>
          <p><strong>Printing:</strong> {printer.state.flags.printing ? "Yes" : "No"}</p>
          <p><strong>Paused:</strong> {printer.state.flags.paused ? "Yes" : "No"}</p>
          <p><strong>Error:</strong> {printer.state.flags.error ? "Yes" : "No"}</p>
          <p><strong>Tool 0 Temperature:</strong> {printer.temperature.tool0.actual}°C</p>
          <p><strong>Bed Temperature:</strong> {printer.temperature.bed.actual}°C</p>
        </div>
    );
  }

  return <div>Health data not available yet.</div>;
};

export default PrinterHealth;
