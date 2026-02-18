<script>
	import File from '$lib/ui/editor/fields/file.svelte';
	import Markdown from '$lib/ui/editor/fields/markdown.svelte';
	import Number from '$lib/ui/editor/fields/number.svelte';
	import Relation from '$lib/ui/editor/fields/relation.svelte';
	import String from '$lib/ui/editor/fields/string.svelte';
	import Text from '$lib/ui/editor/fields/text.svelte';
	import Url from '$lib/ui/editor/fields/url.svelte';
	import DatePicker from '$lib/ui/form/date-picker.svelte';
	import Search from '$lib/ui/form/search.svelte';

	const label = 'label';

	const fields = [
		{ name: 'string', Component: String, value: 'Business-focused optimal migration' },
		{
			name: 'text',
			Component: Text,
			value: `Enjoy material contain life challenge thing ago. Local such range significant but. Name difficult knowledge into single might staff fact. But mention keep evidence see. Sea happen throw certainly. Movie mother head notice else success. Power morning until say provide. Personal south article apply appear indeed. Food choice such.`
		},
		{ name: 'url', Component: Url, value: 'https://annuel.3xw.ca' },
		{
			name: 'markdown',
			Component: Markdown,
			value: `
## Visualisation

Je n'ai pas vraiment fait d'esquisse à la main pour la raison suivante:

Mon concept est directement relié au *game engine* du jeu de la vie que j'ai développé. Mon premier réflexe a donc été d'expérimenter avec le code sur une page web vierge pour premièrement déterminer si l'idée que j'avais en tête était possible.

Le problème avec cette approche - et d'ailleurs le problème de ma vie - c'est que je ne sépare pas le design avec le développement. Où est la limite entre les deux? J'expérimente avec le code pour voir si mon idée "design" est réalisable, et ensuite je *vibe design* sans réellement m'assoeir et me poser les questions architecturales qu'il faut. Je dirais que j'ai plus ou moins prévu le coup cette fois ci. Dès que j'était satisfait du *game engine*, j'ai réussi calmer mes ardeurs: je suis allé dans figma et prendre le temps de comparer différentes options et de désigner pour de vrai.

`
		},
		{ name: 'number', Component: Number, value: 69 },
		{ name: 'date', Component: DatePicker },
		{ name: 'search', Component: Search },
		{ name: 'relation', Component: Relation },
		{ name: 'file', Component: File }
	];
</script>

<div class="w-md space-y-6">
	{#each fields as { name, Component, ...rest }}
		<Component {name} id={name} {...rest} />
	{/each}

	<!-- <String name="label" id="label" />
	<Text name="label" />
	<Url name="url" />
	<DatePicker id="s" name="date" />
	<Search id="s" /> -->
</div>
