export async function load({ params }) {
	return {
		header_links: [
			{
				name: 'Collections',
				icon: 'icon-[ri--folder-2-line]',
				href: `/${params.year}`
			},
			{
				name: 'Années',
				icon: 'icon-[ri--calendar-line]',
				href: `/${params.year}/years`
			}
		]
	};
}
