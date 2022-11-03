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
	<code>
		{entry.type}
		{entry.name}
	</code>
</li>
{#if entry.type === 'd' && expandend}
	<Directory directory={[...directory, entry.name]} />
{/if}
