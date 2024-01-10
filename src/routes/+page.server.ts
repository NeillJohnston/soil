import { zConfig } from '$lib/api.js';
import fs from 'fs/promises';
import YAML from 'yaml';
import { extractStaticSystemData } from '$lib/systemData.js';
import { env } from '$env/dynamic/private';

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
                path: err.path,
                msg: err.message
            });
        }
    }

    const data = await dataRes.json();

    let res = { config, data, yamlError, zodError, staticData: {} };
    if (env.CONTAINER) {
        try {
            const staticDataText = await fs.readFile('./staticData.json', 'utf-8');
            const staticData = JSON.parse(staticDataText);
    
            res.staticData = extractStaticSystemData(staticData);
        }
        catch (err) {
            console.error(err);
        }
    }

    return res;
};