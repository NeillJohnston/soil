<script lang="ts">
    import './css/normalize.css';
    import './css/base.css'

    import type { Config, Data } from "$lib/api";
    import { Marked } from 'marked';
    import Row from "./Row.svelte";
    import Block from './Block.svelte';
    import { expr } from "$lib/expr";
    import { onMount } from "svelte";

    export let data: Config;
    const config = data;

    let sysdata: Data | undefined = undefined;

    let md = new Marked({
        extensions: [{
            name: 'jsExpr',
            level: 'inline',
            start: (src: string) => src.indexOf('{{'),
            tokenizer: (src: string) => {
                const match = /^\{\{(.+?)\}\}/.exec(src);
                if (match) {
                    return {
                        type: 'jsExpr',
                        raw: match[0],
                        expr: match[1]
                    };
                }
            },
            renderer: (token: any) => expr(token.expr, sysdata!)
        }]
    });

    const getData = async () => {
        const res = await fetch('/api/data');
        sysdata = await res.json();
    }

    onMount(() => {
        getData();

        setInterval(getData, 1000);
    });
</script>

{#if !sysdata}
<div class="content">
    Loading
</div>
{:else}
<div class="content">
    <div>
        {#each config.content as blockOrRow}
        {#if blockOrRow.block}
        <Block bind:block={blockOrRow} bind:md />
        {:else}
        <Row bind:row={blockOrRow} bind:md bind:data={sysdata} />
        {/if}
        {/each}
    </div>
    <div class="spacer" />
    <div class="footer">
        <em>soil</em>
    </div>
</div>
{/if}

<style>
    .spacer {
        flex: 1;
        min-height: 4rem;
    }

    .footer {
        text-align: center;
    }
</style>