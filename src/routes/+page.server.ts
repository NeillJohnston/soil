import { zConfig } from '$lib/api.js';
import fs from 'fs/promises';
import YAML from 'yaml';

export const load = async ({ fetch }) => {
    const [configText, dataRes] = await Promise.all([
        fs.readFile('./soil.config.yaml', 'utf-8'),
        fetch('/api/data')
    ]);

    let config;
    let yamlError;
    try {
        config = YAML.parse(configText);
    }
    catch (error) {
        yamlError = true;
    }

    let zodError;
    try {
        zConfig.parse(config);   
    }
    catch (error: any) {
        zodError = [];
        for (const err of error.issues) {
            zodError.push({
                path: err.path
            });
        }
    }

    const data = await dataRes.json();

    return { config, data, yamlError, zodError };
};