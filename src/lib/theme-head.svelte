<svelte:head>
	<script>
		(function () {
			const t = document.cookie.match(/theme=([^;]+)/)?.[1] ?? 'system';
			const dark =
				t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
			if (dark) document.documentElement.classList.add('dark');
		})();
	</script>
</svelte:head>
