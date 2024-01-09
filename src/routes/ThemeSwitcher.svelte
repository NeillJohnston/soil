<script lang="ts">
    import { theme } from "$lib/theme";

    const switchLight = () => {
        $theme = 'light';
        window.localStorage.setItem('theme', 'light');
    };

    const switchDark = () => {
        $theme = 'dark';
        window.localStorage.setItem('theme', 'dark');
    };
</script>

<p class="theme-switcher">
    <a href={$theme === 'light' ? null : ''} class="button" on:click={switchLight}>Light</a> |
    <a href={$theme === 'dark' ? null : ''} class="button" on:click={switchDark}>Dark</a>
</p>

<style>
    .theme-switcher {
        text-align: center;
    }

    .button {
        color: var(--theme-text);
        font-weight: bold;
    }
</style>