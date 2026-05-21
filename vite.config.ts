import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import yaml_copy from './src/lib/copy/gen/vite-plugin-yaml-copy';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [tailwindcss(), sveltekit(), yaml_copy()] });
