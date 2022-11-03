<script lang="ts">
	import DirectoryEntry from './DirectoryEntry.svelte';
	import { fetchDir } from './utils/fetch';

	export let directory: string[] = [];

	$: entriesPromise = fetchDir(directory);
</script>

<ul>
	{#await entriesPromise}
		Loading...
	{:then entries}
		{#each entries as entry}
			<DirectoryEntry {directory} {entry} />
		{/each}
	{:catch}
		Error
	{/await}
</ul>
