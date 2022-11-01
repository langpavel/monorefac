import { createURL } from './createURL';

export const getJSON = async <T = unknown>(
	path: string,
	args?: Record<string, string>
): Promise<T> => {
	const response = await fetch(createURL(path, args));
	return (await response.json()) as T;
};

export type FetchDirResponse = {};

export const fetchDir = async (dir: string) => await getJSON<FetchDirResponse>('api/dir', { dir });
