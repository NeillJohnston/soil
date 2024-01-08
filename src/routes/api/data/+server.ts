import type { ServiceData, SystemData } from '$lib/api';
import { json } from '@sveltejs/kit';
import * as si from 'systeminformation';

// B -> GiB conversion
const gib = (b: number) => b / 2**30;

const pad = (n: number) => (100 + n).toString().slice(1);

const clock = (n: number) => {
    n = Math.floor(n);
    const s = n % 60;
    n = Math.floor(n / 60);
    const m = n % 60;
    n = Math.floor(n / 60);
    const h = n % 24;
    n = Math.floor(n / 24);
    const d = n;

    let res = `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;

    return res;
}

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

    const raw = {
        time: {
            now: new Date(data.time.current),
            tz: data.time.timezone,
        },

        sys: {
            make: data.system.manufacturer,
            model: data.system.model,
            ver: data.system.version,
            arch: data.osInfo.arch,
            up: data.time.uptime,
            hostname: data.osInfo.hostname,
        },

        cpu: {
            make: data.cpu.manufacturer,
            model: data.cpu.brand,
            ghz: data.cpu.speed,
            cores: data.cpu.physicalCores,
            load: data.currentLoad.currentLoad/100,

            temp: {
                main: data.cpuTemperature.main,
                max: data.cpuTemperature.max
            },
        },

        gpu: data.graphics.controllers.map((controller: any) => ({
            make: controller.vendor,
            model: controller.model,
            bus: controller.bus,
            vram: controller.vram / 2**20
        })),

        mem: {
            total: data.mem.total,
            free: data.mem.free,
            used: data.mem.active,
        },

        os: {
            platform: data.osInfo.platform,
            distro: data.osInfo.distro,
            release: data.osInfo.release,
            kernel: data.osInfo.kernel,
        }
    };

    return {
        ...raw,
        pre: {
            localeTime: `${raw.time.now.toLocaleString()} (${raw.time.tz})`,

            sysName: `${raw.sys.make} ${raw.sys.model} ${raw.sys.ver}`,
            uptimeClock: clock(raw.sys.up),

            cpuName: `${raw.cpu.make} ${raw.cpu.model}`,
            cpuInfo: `${raw.cpu.make} ${raw.cpu.model} (${raw.cpu.cores}) @ ${raw.cpu.ghz}GHz`,

            memTotalGiB: gib(raw.mem.total),
            memFreeGiB: gib(raw.mem.free),
            memUsedGiB: gib(raw.mem.used),
            memUsedFrac: raw.mem.used / raw.mem.total,

            osName: `${raw.os.distro} ${raw.os.release} ${raw.sys.arch}`
        }
    }
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