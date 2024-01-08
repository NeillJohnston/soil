import fs from 'fs/promises';
import YAML from 'yaml';

export const load = async () => {
    const text = await fs.readFile('./soil.config.yaml', 'utf-8');
    const config = YAML.parse(text);
    return config;
};