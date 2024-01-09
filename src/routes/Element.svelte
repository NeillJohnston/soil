<script lang="ts">
    import type { Data, Element } from "$lib/api";
    import type { Marked } from "marked";
    import Row from "./Row.svelte";
    import Block from './Block.svelte';
    import ThemeSwitcher from "./ThemeSwitcher.svelte";

    export let data: Data;
    export let md: Marked;
    export let element: Element;
</script>

{#if element.block}
<Block block={element} bind:md bind:data />
{:else if element.widget === 'theme-switcher'}
<ThemeSwitcher />
{:else}
<Row row={element} bind:md bind:data />
{/if}