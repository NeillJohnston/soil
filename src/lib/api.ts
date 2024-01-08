export interface Config {
    content: BlockOrRow[];
    'content-mobile'?: BlockOrRow[];
    theme?: {
        light?: Theme;
        dark?: Theme;
    };
}

export type BlockOrRow = Block | Row;

export interface Block {
    block: string;
}

export interface Row {
    row: Cell[];
}

export interface Cell {
    text?: string;
    bars?: {
        fracx?: string;
        color?: string;
    }[];
    size?: number;
}

export interface Theme {
    bg: string;
    text: string;
    accent: { [key: string]: string }
}

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

export interface ServiceData {}

export type Data = SystemData & ServiceData;