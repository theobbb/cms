// src/lib/copy/gen/vite-plugin-yaml-copy.ts
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export default function yaml_copy() {
	const copy_dir = path.resolve('src/lib/copy');
	const gen_dir = path.resolve('src/lib/copy/gen');

	const convert = (yaml_path: string) => {
		const data = yaml.load(fs.readFileSync(yaml_path, 'utf8'));
		const json = JSON.stringify(data, null, 2);
		const name = path.basename(yaml_path, '.yaml');
		const var_name = `copy_${name}`;
		const ts = `// AUTO-GENERATED — do not edit manually\n\nexport const ${var_name} = ${json} as const\n\nexport type Copy = typeof ${var_name}\n`;
		fs.writeFileSync(path.join(gen_dir, `${name}.ts`), ts);
		console.log(`✓ ${path.basename(yaml_path)} → gen/${name}.ts`);
	};

	return {
		name: 'yaml-copy',
		buildStart() {
			fs.mkdirSync(gen_dir, { recursive: true });
			fs.readdirSync(copy_dir)
				.filter((f) => f.endsWith('.yaml'))
				.forEach((f) => convert(path.join(copy_dir, f)));
		},
		configureServer(server: any) {
			server.watcher.add(copy_dir);
			server.watcher.on('change', (file: string) => {
				if (file.endsWith('.yaml') && file.startsWith(copy_dir)) {
					convert(file);
				}
			});
		}
	};
}
