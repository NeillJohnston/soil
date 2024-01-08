<script lang="ts">
    import type { BlockOrRow, Data } from "$lib/api";
    import type { Marked } from "marked";
    import Row from "./Row.svelte";
    import Block from './Block.svelte';

    export let data: Data;
    export let md: Marked;
    export let content: BlockOrRow[];
</script>

<div>
    {#each content as blockOrRow}
    {#if blockOrRow.block}
    <Block bind:block={blockOrRow} bind:md />
    {:else}
    <Row bind:row={blockOrRow} bind:md bind:data />
    {/if}
    {/each}
</div>
<div class="spacer" />
<div class="footer">
    <em>soil</em>
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