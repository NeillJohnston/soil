<script lang="ts">
    import './css/normalize.css';
    import './css/base.css'

    import type { Config, Data, Theme } from "$lib/api";
    import { expr } from "$lib/expr";
    import { theme } from "$lib/theme";
    import { Marked } from 'marked';
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

    const light = config.theme?.light ?? {
        text: '#ffffff',
        bg: '#000000'
    };

    const dark = config.theme?.dark ?? {
        text: '#000000',
        bg: '#ffffff'
    };

    const updateTheme = (name: 'light' | 'dark') => {
        const theme = {
            light: light,
            dark: dark
        }[name];

        for (const key of Object.getOwnPropertyNames(theme)) {
            // @ts-ignore
            document.documentElement.style.setProperty(`--theme-${key}`, theme[key]);
        }
    }

    const getData = async () => {
        const res = await fetch('/api/data');
        _data = await res.json();
    }

    onMount(() => {
        getData();
        setInterval(getData, 1000);

        // @ts-ignore
        $theme = window.localStorage.getItem('theme') ?? 'light';
    });

    $: {
        if (typeof document !== 'undefined') {
            updateTheme($theme);
        }
    }
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