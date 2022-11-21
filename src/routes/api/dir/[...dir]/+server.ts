import { join } from 'node:path';
import type { Dirent, Stats } from 'node:fs';
import { readdir, readlink, realpath, lstat } from 'node:fs/promises';

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const cwd = process.cwd();

const getType = (entry: Dirent | Stats) =>
	entry.isSymbolicLink()
		? 'l'
		: entry.isFile()
		? 'f'
		: entry.isDirectory()
		? 'd'
		: entry.isSocket()
		? 's'
		: entry.isBlockDevice()
		? 'b'
		: entry.isCharacterDevice()
		? 'c'
		: '?';

export const GET: RequestHandler = async ({ params }) => {
	const dirArg = params.dir ?? '';

	try {
		const dir = join(cwd, dirArg);
		const entries = await readdir(dir, { withFileTypes: true });
		const result = await Promise.all(
			entries.map(async (entry) => {
				let stat: Stats | { error: string };
				const fullFileName = join(dir, entry.name);
				let realPath: string | undefined = undefined;
				try {
					stat = await lstat(fullFileName);
					realPath = await realpath(fullFileName);
				} catch (err: any) {
					stat = { error: err?.code ?? err?.message };
				}

				let type = getType(entry);
				const isSymLink = entry.isSymbolicLink();

				let symlink: string | undefined = undefined;

				if (isSymLink) {
					try {
						symlink = await readlink(fullFileName);
						if (realPath) {
							stat = await lstat(realPath);
							type = getType(stat);
						}
					} catch (err) {
						console.error(err);
					}
				}

				return {
					...entry,
					type,
					stat,
					symlink,
					realPath
				};
			})
		);
		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		const message = err?.code ?? err?.message;
		console.error(err);
		throw error(400, message);
	}
};
