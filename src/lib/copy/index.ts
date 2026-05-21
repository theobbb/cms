import { getContext, setContext } from 'svelte';

import { copy_fr, type Copy } from './gen/fr';
import { copy_en } from './gen/en';

const langs = { fr: copy_fr, en: copy_en };

const COPY_KEY = Symbol('COPY_KEY');

export function init_copy(lang: 'fr' | 'en' | undefined | null): Copy {
	setContext(COPY_KEY, langs.fr);
	return langs.fr;
}
export function use_copy(): Copy {
	return getContext<Copy>(COPY_KEY);
}
