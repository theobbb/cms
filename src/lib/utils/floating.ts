import type { Attachment } from 'svelte/attachments';

// floating.ts
type Align = 'top' | 'bottom' | 'left' | 'right';
type Options = {
	anchor?: HTMLElement;
	align?: Align;
	offset?: number;
};
export const floating = (node: HTMLElement, options: Options) => {
	const anchor = options.anchor || node.parentElement;
	const align = options.align || 'top';
	const offset = options.offset || 4;

	function updatePosition() {
		console.log('update pos', anchor, node);
		if (!anchor || !node) return;
		console.log(anchor, node);
		// If hidden by CSS, stop calculation to save resources
		if (node.offsetParent === null) return;

		const anchorRect = anchor.getBoundingClientRect();
		const nodeRect = node.getBoundingClientRect();

		// --- Same "Flip" and "Center" logic as before ---

		// 1. Calculate available space
		const spaceAbove = anchorRect.top;
		const spaceBelow = window.innerHeight - anchorRect.bottom;

		// 2. Flip Logic
		let actualPlacement = align;
		if (align === 'bottom' && spaceBelow < nodeRect.height && spaceAbove > nodeRect.height) {
			actualPlacement = 'top';
		} else if (align === 'top' && spaceAbove < nodeRect.height && spaceBelow > nodeRect.height) {
			actualPlacement = 'bottom';
		}

		// 3. Coordinate Logic
		let top = 0;
		let left = 0;
		const horizontalCenter = anchorRect.left + anchorRect.width / 2 - nodeRect.width / 2;
		const verticalCenter = anchorRect.top + anchorRect.height / 2 - nodeRect.height / 2;

		switch (actualPlacement) {
			case 'top':
				top = anchorRect.top - nodeRect.height - offset;
				left = horizontalCenter;
				break;
			case 'bottom':
				top = anchorRect.bottom + offset;
				left = horizontalCenter;
				break;
			case 'left':
				top = verticalCenter;
				left = anchorRect.left - nodeRect.width - offset;
				break;
			case 'right':
				top = verticalCenter;
				left = anchorRect.right + offset;
				break;
		}

		// 4. Clamping (Safety)
		left = Math.max(8, Math.min(left, window.innerWidth - nodeRect.width - 8));

		// 5. Apply
		Object.assign(node.style, {
			position: 'fixed',
			top: `${top}px`,
			left: `${left}px`,
			margin: '0',
			zIndex: '9999'
		});
	}

	// --- Triggers ---

	// 1. ResizeObserver: Detects when display:none becomes display:block
	const resizeObserver = new ResizeObserver(() => updatePosition());
	resizeObserver.observe(node);

	// 2. Scroll/Resize: Update while open
	window.addEventListener('scroll', updatePosition, true);
	window.addEventListener('resize', updatePosition);

	return {
		// update(newOptions: () => Options) {
		// 	const opts = newOptions();
		// 	anchor = opts.anchor;
		// 	align = opts.align || 'bottom';
		// 	offset = opts.offset || 8;
		// 	updatePosition();
		// },
		destroy() {
			resizeObserver.disconnect();
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
		}
	};
};
