import { writable } from "svelte/store";

// @ts-ignore
export const theme = writable<'light' | 'dark'>('light');