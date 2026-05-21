import EXIF from 'exifr'; // npm install exifr

export async function process_image(
	file: File,
	max_size_mb: number = 3
): Promise<{ file: File; aspect_ratio: number }> {
	if (!file.type.startsWith('image/') || file.type === 'image/gif')
		return { file, aspect_ratio: 1 };

	const EXIF_SUPPORTED = ['image/jpeg', 'image/jpg', 'image/tiff', 'image/heic', 'image/heif'];
	const orientation: number = EXIF_SUPPORTED.includes(file.type)
		? ((await EXIF.parse(file, ['Orientation']))?.Orientation ?? 1)
		: 1;

	const is_rotated_90 = [5, 6, 7, 8].includes(orientation);

	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(img.src);

			// Swap width/height for 90°/270° rotations — same as ImageOps.exif_transpose
			const natural_width = is_rotated_90 ? img.height : img.width;
			const natural_height = is_rotated_90 ? img.width : img.height;
			const aspect_ratio = Math.round((natural_width / natural_height) * 1000) / 1000;

			const is_too_large = file.size > max_size_mb * 1024 * 1024;
			const MAX_DIM = 1920;
			const needs_resizing = natural_width > MAX_DIM || natural_height > MAX_DIM;

			if (!is_too_large && !needs_resizing) {
				return resolve({ file, aspect_ratio });
			}

			let width = natural_width;
			let height = natural_height;
			if (needs_resizing) {
				const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
				width = Math.round(width * ratio);
				height = Math.round(height * ratio);
			}

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) return resolve({ file, aspect_ratio });

			// Apply EXIF orientation transform before drawing
			apply_exif_orientation(ctx, orientation, width, height);
			// For rotated images, draw with swapped dimensions
			if (is_rotated_90) {
				ctx.drawImage(img, 0, 0, height, width);
			} else {
				ctx.drawImage(img, 0, 0, width, height);
			}

			let quality = 0.82;
			const attempt_compression = () => {
				canvas.toBlob(
					(blob) => {
						if (!blob) return resolve({ file, aspect_ratio });
						if (blob.size <= max_size_mb * 1024 * 1024 || quality <= 0.3) {
							const new_name = file.name.replace(/\.[^/.]+$/, '') + '.webp';
							const compressed_file = new File([blob], new_name, {
								type: 'image/webp',
								lastModified: Date.now()
							});
							resolve({ file: compressed_file, aspect_ratio });
						} else {
							quality -= 0.08;
							attempt_compression();
						}
					},
					'image/webp',
					quality
				);
			};
			attempt_compression();
		};
		img.onerror = () => {
			URL.revokeObjectURL(img.src);
			resolve({ file, aspect_ratio: 1 });
		};
		img.src = URL.createObjectURL(file);
	});
}

function apply_exif_orientation(
	ctx: CanvasRenderingContext2D,
	orientation: number,
	width: number,
	height: number
) {
	// Mirrors exactly what ImageOps.exif_transpose does for each orientation value
	switch (orientation) {
		case 2:
			ctx.transform(-1, 0, 0, 1, width, 0);
			break; // flip horizontal
		case 3:
			ctx.transform(-1, 0, 0, -1, width, height);
			break; // rotate 180
		case 4:
			ctx.transform(1, 0, 0, -1, 0, height);
			break; // flip vertical
		case 5:
			ctx.transform(0, 1, 1, 0, 0, 0);
			break; // transpose
		case 6:
			ctx.transform(0, 1, -1, 0, height, 0);
			break; // rotate 90 CW
		case 7:
			ctx.transform(0, -1, -1, 0, height, width);
			break; // transverse
		case 8:
			ctx.transform(0, -1, 1, 0, 0, width);
			break; // rotate 90 CCW
		default:
			break; // orientation 1 = normal, no transform needed
	}
}
