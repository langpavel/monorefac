<script lang="ts">
	import Directory from './Directory.svelte';

	export let directory: string[];
	export let entry: any;

	let expandend = true;

	const toggle = () => {
		expandend = !expandend;
	};
</script>

<li on:click={toggle}>
	{entry.type}
	{entry.name}
</li>
{#if entry.type === 'd' && expandend}
	<Directory directory={[...directory, entry.name]} />
{/if}
