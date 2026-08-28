import app from "./app";
import { env } from "./config/env";
import pool from "./config/database";

const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});

const SHUTDOWN_TIMEOUT = 10000;

const shutdown = async () => {
    console.log("Shutting down gracefully...");

    const forceExit = setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);
    forceExit.unref();

    server.close(async () => {
        await pool.end();
        clearTimeout(forceExit);
        process.exit(0);
    });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
