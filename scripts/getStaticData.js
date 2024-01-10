import * as si from 'systeminformation';
import * as fs from 'fs/promises';

const main = async () => {
    const data = await si.getStaticData();
    await fs.writeFile('./staticData.json', JSON.stringify(data));
};

main();