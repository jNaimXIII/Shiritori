import {
    API_NEO4J_CONNECTION_URI,
    API_NEO4J_PASSWORD,
    API_NEO4J_USERNAME,
} from "@lib/env";
import neo4j from "neo4j-driver";

export const driver = neo4j.driver(
    API_NEO4J_CONNECTION_URI,
    neo4j.auth.basic(API_NEO4J_USERNAME, API_NEO4J_PASSWORD)
);

export const session = driver.session();

process.on("beforeExit", async () => {
    await session.close();
    await driver.close();
});
