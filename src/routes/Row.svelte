<script lang="ts">
    import type { Row, Data } from "$lib/api";
    import { Marked } from 'marked';
    import Cell from "./Cell.svelte";

    export let row: Row;
    export let md: Marked;
    export let data: Data;
</script>

<div class="row">
    {#each row.row as cell}
    <Cell bind:cell bind:md bind:data />
    {/each}
</div>

<style>
    .row {
        display: flex;
    }
</style>