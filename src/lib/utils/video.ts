export async function extract_video_frame(file: File): Promise<File> {
	return new Promise((resolve) => {
		const video = document.createElement('video');
		video.preload = 'metadata';
		video.src = URL.createObjectURL(file);
		video.muted = true;
		video.playsInline = true;

		video.onloadedmetadata = () => {
			// Scrub to 1s or half the video if it's super short
			video.currentTime = Math.min(1, video.duration / 2);
		};

		video.onseeked = () => {
			const canvas = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

			canvas.toBlob(
				(blob) => {
					// Swap the extension to .jpg
					const filename = file.name.replace(/\.[^/.]+$/, '.jpg');
					resolve(new File([blob!], filename, { type: 'image/jpeg' }));
					URL.revokeObjectURL(video.src);
				},
				'image/jpeg',
				0.8
			);
		};
	});
}
