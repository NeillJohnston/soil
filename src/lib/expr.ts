// Sequestering this into its own file to provide a minimal environment for the
// eval call.
//
// Important note: not minimal in a security sense - only trusted code should be
// run, still.

import type { Data } from "./api";

export const fix = (n: number, k: number) => n.toFixed(k);
export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

// Hacky fix to ensure that these values don't get tree shook. I believe the
// logic here is just slightly too complex for the shaker to prove that it never
// does anything, so the expression (and therefore the values) get left in.
const protect = (f: any[]) => { !f && console.log(); };
protect([fix, clamp]);

export const expr = (expr: string, { time, sys, cpu, gpu, mem, os, pre }: Data) => {
    try {
        return eval(expr).toString();
    }
    catch {
        return `<span class="error">${expr}</span>`
    }
};
