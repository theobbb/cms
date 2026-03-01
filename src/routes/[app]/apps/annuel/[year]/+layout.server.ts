export async function load({ params }) {
	return {
		header_links: [
			{
				name: 'Data',
				icon: 'icon-[ri--folder-2-line]',
				href: `/${params.year}`
			},
			{
				name: params.year,
				icon: 'icon-[ri--calendar-line]',
				href: `/${params.year}/years`
			}
		]
	};
}
