export class Pop {
	open = $state(false);

	toggle = () => (this.open = !this.open);
	show = () => (this.open = true);
	close = () => (this.open = false);
}
