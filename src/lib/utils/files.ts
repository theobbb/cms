const get_file_meta = (file: File | string) => ({
	name: typeof file === 'string' ? file : file.name,
	type: typeof file === 'string' ? '' : file.type
});

export const file_is_video = (file: File | string) => {
	const { name, type } = get_file_meta(file);

	return type.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv)$/i.test(name);
};

export const file_is_audio = (file: File | string) => {
	const { name, type } = get_file_meta(file);

	return type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i.test(name);
};

export const file_is_image = (file: File | string) => {
	const { name, type } = get_file_meta(file);

	return (
		type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico|tiff)$/i.test(name)
	);
};
