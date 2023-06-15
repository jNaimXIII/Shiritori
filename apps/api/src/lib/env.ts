const variables = [
    "API_DEPLOYMENT_ENVIRONMENT",
    "API_NEO4J_CONNECTION_URI",
    "API_NEO4J_USERNAME",
    "API_NEO4J_PASSWORD",
];

for (const variable of variables) {
    if (!process.env[variable]) {
        throw new Error(`missing environment variable: ${variable}`);
    }
}

export const API_DEPLOYMENT_ENVIRONMENT = process.env
    .API_DEPLOYMENT_ENVIRONMENT as "production" | "development";
export const API_NEO4J_CONNECTION_URI = process.env
    .API_NEO4J_CONNECTION_URI as string;
export const API_NEO4J_USERNAME = process.env.API_NEO4J_USERNAME as string;
export const API_NEO4J_PASSWORD = process.env.API_NEO4J_PASSWORD as string;
