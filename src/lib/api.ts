import { z } from 'zod';

export type TextAlign = 'left' | 'center' | 'right';
const zTextAlign = z.string().regex(/left|center|right/);

export interface Cell {
    text?: string;
    invert?: boolean;
    bars?: {
        fracx?: string;
        color?: string;
    }[];
    size?: number;
    align?: TextAlign;
}
const zCell = z.object({
    text: z.string().optional(),
    invert: z.boolean().optional(),
    bars: z.array(z.object({
        fracx: z.string().optional(),
        color: z.string().optional()
    })).optional(),
    size: z.number().optional(),
    align: zTextAlign.optional()
});

export interface Block {
    block: string;
    align?: TextAlign;
}
const zBlock = z.object({
    block: z.string(),
    align: zTextAlign.optional()
})

export interface Row {
    row: Cell[];
}
const zRow = z.object({
    row: z.array(zCell)
});

export interface Widget {
    widget: 'theme-switcher'
};
const zWidget = z.object({
    widget: z.literal('theme-switcher')
});

export type Element = Block | Row | Widget;
const zBlockOrRow = z.union([zBlock, zRow, zWidget]);

export interface Content {
    main: Element[];
    footer?: Element[];
}
const zContent = z.object({
    main: z.array(zBlockOrRow),
    footer: z.array(zBlockOrRow).optional()
});

export interface Theme {
    bg: string;
    text: string;
}
const zTheme = z.object({
    bg: z.string(),
    text: z.string()
});

export interface Config {
    content: Content;
    'content-mobile'?: Content;
    theme?: {
        light?: Theme;
        dark?: Theme;
    };
}
export const zConfig = z.object({
    content: zContent,
    'content-mobile': zContent.optional(),
    theme: z.object({
        light: zTheme.optional(),
        dark: zTheme.optional(),
    }).optional()
});

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