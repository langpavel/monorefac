import { join } from 'node:path';
import type { Stats } from 'node:fs';
import { readdir, stat as fileStat } from 'node:fs/promises';

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const cwd = process.cwd();

export const GET: RequestHandler = async ({ params }) => {
	const dirArg = params.dir ?? '';
	if (dirArg.startsWith('/') || dirArg.startsWith('.') || dirArg.startsWith('\\'))
		throw error(403, 'FORBIDDEN');

	try {
		const dir = join(cwd, dirArg);
		const entries = await readdir(dir, { withFileTypes: true, encoding: 'utf-8' });
		const result = await Promise.all(
			entries.map(async (entry) => {
				let stat: Stats | { error: string };
				try {
					stat = await fileStat(join(dir, entry.name));
				} catch (err: any) {
					stat = { error: err?.code ?? err?.message };
				}
				const type = entry.isFile()
					? 'f'
					: entry.isDirectory()
					? 'd'
					: entry.isSymbolicLink()
					? 'l'
					: entry.isSocket()
					? 's'
					: entry.isBlockDevice()
					? 'b'
					: entry.isCharacterDevice()
					? 'c'
					: '?';
				return {
					...entry,
					type,
					stat
				};
			})
		);
		return new Response(JSON.stringify(result));
	} catch (err: any) {
		const message = err?.code ?? err?.message;
		throw error(400, message);
	}
};
