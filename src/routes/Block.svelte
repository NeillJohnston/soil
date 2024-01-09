<script lang="ts">
    import type { Data, Block } from "$lib/api";
    import { Marked } from 'marked';

    export let block: Block;
    export let md: Marked;
    export let data: Data;

    const align = block.align ?? 'left';

    let html = '';
    $: {
        data;

        // @ts-ignore: md.parseInline can optionally return a Promise, which we don't use
        html = md.parse(block.block);
    }
</script>

<div class={`block text ${align}`}>
    {@html html}
</div>

<style>
    .block {
        padding: 8px;
    }
</style>