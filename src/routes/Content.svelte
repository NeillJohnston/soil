<script lang="ts">
    import type { Content, Data } from "$lib/api";
    import type { Marked } from "marked";
    import Row from "./Row.svelte";
    import Block from './Block.svelte';

    export let data: Data;
    export let md: Marked;
    export let content: Content;
</script>

<div>
    {#each content.main as blockOrRow}
    {#if blockOrRow.block}
    <Block block={blockOrRow} bind:md />
    {:else}
    <Row row={blockOrRow} bind:md bind:data />
    {/if}
    {/each}
</div>
<div class="spacer" />
{#if content.footer !== undefined}
<div>
    {#each content.footer as blockOrRow}
    {#if blockOrRow.block}
    <Block block={blockOrRow} bind:md />
    {:else}
    <Row row={blockOrRow} bind:md bind:data />
    {/if}
    {/each}
</div>
{/if}

<style>
    .spacer {
        flex: 1;
        min-height: 4rem;
    }
</style>