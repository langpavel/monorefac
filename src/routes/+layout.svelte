<script lang="ts">
	import type { LayoutData } from './$types';
	import { isPendingFetch, pendingFetches } from '$lib/utils/fetch';

	export let data: LayoutData;
</script>

<h1>{data.cwd}</h1>

{#if $isPendingFetch}
	Loading... {$pendingFetches}
{:else}
	Ready
{/if}

<slot />
