<script lang="ts">
    import type { Row, Data, BlockOrRow, Block } from "$lib/api";
    import { Marked } from 'marked';

    export let block: Block;
    export let md: Marked;
    // export let data: Data;

    const html = md.parse(block.block);
</script>

<div class="block">
    {@html html}
</div>

<style>
    .block {
        padding: 8px;
    }
</style>