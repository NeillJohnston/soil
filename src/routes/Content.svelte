<script lang="ts">
    import type { Content, Data } from "$lib/api";
    import type { Marked } from "marked";
    import Element from "./Element.svelte";

    export let data: Data;
    export let md: Marked;
    export let content: Content;
</script>

<div>
    {#each content.main as element}
    <Element bind:element bind:data bind:md />
    {/each}
</div>
<div class="spacer" />
{#if content.footer !== undefined}
<div>
    {#each content.footer as element}
    <Element bind:element bind:data bind:md />
    {/each}
</div>
{/if}

<style>
    .spacer {
        flex: 1;
        min-height: 4rem;
    }
</style>