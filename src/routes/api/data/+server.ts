import type { ServiceData, SystemData } from '$lib/api';
import { extractSystemData } from '$lib/systemData';
import { json } from '@sveltejs/kit';
import * as si from 'systeminformation';

const getSystemData = async (): Promise<SystemData> => {
    const data = await si.get({
        time: 'current, uptime, timezone',
        system: 'manufacturer, model, version',
        cpu: 'manufacturer, brand, speed, physicalCores',
        cpuTemperature: 'main, max',
        graphics: 'controllers',
        mem: 'total, free, active',
        osInfo: 'platform, distro, release, kernel, arch, hostname',
        currentLoad: 'currentLoad'
    });

    return extractSystemData(data);
};

const getServiceData = async (): Promise<ServiceData> => {
    return {};
}

export const GET = async () => {
    const [systemData, serviceData] = await Promise.all([
        getSystemData(),
        getServiceData()
    ]);

    return json({ ...systemData, ...serviceData });
};