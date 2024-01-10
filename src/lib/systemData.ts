// All of the data that can be accessed from an eval'd expression
export interface SystemData {
    time: {
        now: Date;   // Current system time
        tz:  string; // System timezone (e.g. GMT-0400)
    };

    sys: {
        make:     string; // Machine manufacturer name
        model:    string; // Machine model name
        ver:      string; // Machine version name
        arch:     string; // System architecture
        up:       number; // Uptime, in seconds
        hostname: string; // Hostname
    };

    cpu: {
        make:  string; // CPU manufacturer name
        model: string; // CPU model name
        ghz:   string; // CPU speed, in GHz
        cores: number; // # of physical cores on the CPU
        load:  number; // Current CPU load, as a fraction (0.0 - 1.0)

        temp: {
            main: number; // Main CPU temperature (probably in C, unclear if this is guaranteed)
            max:  number; // Max CPU temperature
        };
    };

    gpu: {
        make:  string; // GPU manufacturer name
        model: string; // GPU model name
        bus:   string; // GPU bus
        vram:  number; // VRAM size, in bytes
    }[];

    mem: {
        total: number; // Total system memory, in bytes
        free:  number; // Amount of free memory, in bytes
        used:  number; // Amount of actively used memory, in bytes
    };

    os: {
        platform: string;  // Platform name (linux, Windows, etc.)
        distro:   string;  // Distro name
        release:  string;  // Distro release name
        kernel:   string;  // Kernel version
    };

    pre: {
        localeTime: string; // Time as a locale string + timezone

        sysName:     string; // System make + model + version
        uptimeClock: string; // Uptime formatted as a clock (e.g. "7d 12:30:01")
        
        cpuName: string; // CPU make + model
        cpuInfo: string; // CPU make + model + cores + speed

        memTotalGiB: number; // Total mem in GiB
        memFreeGiB:  number; // Free mem in GiB
        memUsedGiB:  number; // Used mem in GiB
        memUsedFrac: number; // Used mem / total mem

        osName: string; // OS distro + release + system arch
    }
}

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

export const extractSystemData = (data: any): SystemData => {
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

// Extract the static part of the system data
export const extractStaticSystemData = (data: any) => {
    const raw = {
        sys: {
            make: data.system.manufacturer,
            model: data.system.model,
            ver: data.system.version,
            arch: data.os.arch,
            hostname: data.os.hostname,
        },

        cpu: {
            make: data.cpu.manufacturer,
            model: data.cpu.brand,
            ghz: data.cpu.speed,
            cores: data.cpu.physicalCores
        },

        gpu: data.graphics.controllers.map((controller: any) => ({
            make: controller.vendor,
            model: controller.model,
            bus: controller.bus,
            vram: controller.vram / 2**20
        })),

        os: {
            platform: data.os.platform,
            distro: data.os.distro,
            release: data.os.release,
            kernel: data.os.kernel,
        }
    };

    return {
        ...raw,
        pre: {
            sysName: `${raw.sys.make} ${raw.sys.model} ${raw.sys.ver}`,

            cpuName: `${raw.cpu.make} ${raw.cpu.model}`,
            cpuInfo: `${raw.cpu.make} ${raw.cpu.model} (${raw.cpu.cores}) @ ${raw.cpu.ghz}GHz`,

            osName: `${raw.os.distro} ${raw.os.release} ${raw.sys.arch}`
        }
    }
}