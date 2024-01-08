<script lang="ts">
    import './css/normalize.css';
    import './css/base.css'

    import type { Config, Data } from "$lib/api";
    import { Marked } from 'marked';
    import { expr } from "$lib/expr";
    import { onMount } from "svelte";
    import Content from './Content.svelte';

    export let data: { config: Config, data: Data, yamlError: any, zodError: any };
    const config = data.config;
    let _data = data.data;

    let content = config?.content;
    let contentMobile = config?.['content-mobile'] ?? config?.content;

    let md = new Marked({
        extensions: [{
            // Parse {{ expr }} as an inline JS expression to be eval'd
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

{#if data.yamlError}

<div class="content desktop error">
    Error: could not parse config.
</div>
<div class="content mobile error">
    Error: could not parse config.
</div>

{:else if data.zodError}

<div class="content desktop error">
    Error: invalid config, found issues at:
    {#each data.zodError as error}
    <br/>  - {error.path.join('.')}: {error.msg}
    {/each}
</div>
<div class="content mobile error">
    Error: invalid config, found issues at:
    {#each data.zodError as error}
    <br/>  - {error.path.join('.')}: {error.msg}
    {/each}
</div>

{:else}

<div class="content desktop">
    <Content bind:data={_data} bind:md bind:content />
</div>
<div class="content mobile">
    <Content bind:data={_data} bind:md bind:content={contentMobile} />
</div>

{/if}

<style>
    .error {
        color: red;
    }
</style>