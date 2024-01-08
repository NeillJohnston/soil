<script lang="ts">
    import './css/normalize.css';
    import './css/base.css'

    import type { Config, Data } from "$lib/api";
    import { Marked } from 'marked';
    import Row from "./Row.svelte";
    import Block from './Block.svelte';
    import { expr } from "$lib/expr";
    import { onMount } from "svelte";

    export let data: { config: Config, data: Data };
    const config = data.config;
    let _data = data.data;

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
            renderer: (token: any) => expr(token.expr, _data)
        }]
    });

    const getData = async () => {
        const res = await fetch('/api/data');
        _data = await res.json();
    }

    onMount(() => {
        getData();
        setInterval(getData, 1000);
    });
</script>

<div class="content">
    <div>
        {#each config.content as blockOrRow}
        {#if blockOrRow.block}
        <Block bind:block={blockOrRow} bind:md />
        {:else}
        <Row bind:row={blockOrRow} bind:md bind:data={_data} />
        {/if}
        {/each}
    </div>
    <div class="spacer" />
    <div class="footer">
        <em>soil</em>
    </div>
</div>

<style>
    .spacer {
        flex: 1;
        min-height: 4rem;
    }

    .footer {
        text-align: center;
    }
</style>