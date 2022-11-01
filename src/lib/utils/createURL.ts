import { base } from '$app/paths';

export const createURL = (path: string, args?: Record<string, string>): string => {
	const url = new URL(path, base);
	url.search = args ? new URLSearchParams(args).toString() : '';
	return url.href;
};
