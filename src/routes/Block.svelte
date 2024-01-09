<script lang="ts">
    import type { Row, Data, Element, Block } from "$lib/api";
    import { Marked } from 'marked';

    export let block: Block;
    export let md: Marked;
    // export let data: Data;

    const html = md.parse(block.block);
    const align = block.align ?? 'left';
</script>

<div class={`block text ${align}`}>
    {@html html}
</div>

<style>
    .block {
        padding: 8px;
    }
</style>