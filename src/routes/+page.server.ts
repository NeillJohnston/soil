import fs from 'fs/promises';
import YAML from 'yaml';

export const load = async ({ fetch }) => {
    const [configText, dataRes] = await Promise.all([
        fs.readFile('./soil.config.yaml', 'utf-8'),
        fetch('/api/data')
    ]);

    const config = YAML.parse(configText);
    const data = await dataRes.json();

    return { config, data };
};