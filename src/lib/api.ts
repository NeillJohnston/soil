import { z } from 'zod';
import type { SystemData } from './systemData';
export type { SystemData };

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

export interface ServiceData {}

export type Data = SystemData & ServiceData;