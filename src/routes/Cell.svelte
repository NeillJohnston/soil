<script lang="ts">
    import type { Data, Cell } from "$lib/api";
    import { expr } from "$lib/expr";
    import { Marked } from 'marked';

    export let cell: Cell;
    export let md: Marked;
    export let data: Data;

    const align = cell.align ?? 'left';
    const invert = !!cell.invert;

    let html = '';
    let bars: { frac: number, color: string }[] = [];
    $: {
        // Reactive block to force re-render when data changes
        data;

        // @ts-ignore: md.parseInline can optionally return a Promise, which we don't use
        html = cell.text ? md.parseInline(cell.text) : '';
        if (cell.bars) {
            const _bars: { frac: number, color: string }[] = [];
            let sum = 0;
            let rem = -1;
            cell.bars.forEach((bar, index) => {
                let frac = 0;
                let color = '';
                if (!bar.fracx) {
                    rem = index;
                }
                else {
                    frac = expr(bar.fracx, data);
                }
                if (bar.color) {
                    if (typeof document !== 'undefined') {
                        if (document.documentElement.style.getPropertyValue(`--theme-${bar.color}`)) {
                            color = `var(--theme-${bar.color})`;
                        }
                    }

                    if (!color) {
                        color = bar.color;
                    }
                }
                
                _bars.push({ frac, color });
                sum += frac;
            });

            if (rem !== -1) {
                _bars[rem].frac = 1 - sum;
            }

            bars = _bars;
        }
    }
</script>

<div class="cell" style:flex={cell.size ?? 1}>
    <div class="bars">
        {#each bars as bar}
        <div class="bar" style:flex={bar.frac} style:background-color={bar.color} />
        {/each}
    </div>
    <div class={`text ${align}`} class:inverted={invert}>
        {@html html}
    </div>
</div>

<style>
    .cell {
        box-sizing: border-box;
        padding: 4px;
        position: relative;
    }

    .bars {
        height: calc(100% - 8px);
        width: calc(100% - 8px);
        box-sizing: border-box;
        display: flex;
        position: absolute;
        z-index: 0;
    }
    
    .bar {
        height: 100%;
    }

    .text {
        width: 100%;
        box-sizing: border-box;
        padding: 4px;
        position: relative;
        z-index: 1;
    }

    .inverted {
        color: var(--theme-bg);
    }
</style>