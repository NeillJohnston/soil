// Sequestering this into its own file to provide a minimal environment for the
// eval call.
//
// Important note: not minimal in a security sense - only trusted code should be
// run, still.

import type { Data } from "./api";

const fix = (n: number, k: number) => n.toFixed(k);

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export const expr = (expr: string, { time, sys, cpu, gpu, mem, os, pre }: Data) => {
    try {
        return eval(expr).toString();
    }
    catch {
        return `<span style="color: red;">${expr}</span>`
    }
}