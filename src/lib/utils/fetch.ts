import { createURL } from './createURL';

export const getJSON = async <T = unknown>(
	path: string,
	args?: Record<string, string>
): Promise<T> => {
	const response = await fetch(createURL(path, args));
	return (await response.json()) as T;
};

export type FetchDirResponse = {
	name: string;
	type: 'f' | 'd' | 'l' | 's' | 'b' | 'c' | '?';
	stat: {
		dev: number;
		mode: number;
		nlink: number;
		uid: number;
		gid: number;
		rdev: number;
		blksize: number;
		ino: number;
		size: number;
		blocks: number;
		atimeMs: number;
		mtimeMs: number;
		ctimeMs: number;
		birthtimeMs: number;
		atime: string;
		mtime: string;
		ctime: string;
		birthtime: string;
	};
}[];

export const fetchDir = async (dir: string[]) =>
	await getJSON<FetchDirResponse>(['api', 'dir', ...dir].map(encodeURI).join('/'));
