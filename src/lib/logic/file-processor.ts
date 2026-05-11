import { extract_video_frame } from '$lib/utils/video';
import type { MuxUploader, MuxMetaState } from './mux'; // Ajuste le chemin selon ton projet

export type MetaFile = MuxMetaState & {
	caption?: string;
	col_start?: number;
	col_span?: number;
	aspect_ratio?: number;
};

export class FileProcessor {
	#mux_uploader: MuxUploader;
	#prev_files: (string | File)[];

	constructor(mux_uploader: MuxUploader, initial_files: (string | File)[] = []) {
		this.#mux_uploader = mux_uploader;
		// On garde une copie de référence pour comparer lors des prochains changements
		this.#prev_files = [...initial_files];
	}

	/**
	 * Compare les fichiers actuels avec la référence précédente,
	 * gère les suppressions (Mux), mappe les métadonnées et initie les nouveaux uploads.
	 *
	 * Retourne le nouveau tableau de meta_files si un changement a eu lieu, sinon null.
	 */
	sync(
		current_files: (string | File)[],
		current_meta: MetaFile[],
		on_thumbnail_extracted: (index: number, thumbnail: File) => void
	): MetaFile[] | null {
		let order_changed = false;

		// 1. Détection des changements (ordre, ajouts, suppressions)
		if (current_files.length === this.#prev_files.length) {
			order_changed = current_files.some((f, i) => f !== this.#prev_files[i]);
		} else {
			order_changed = true;
		}

		if (!order_changed) return null;

		// 2. Nettoyage des fichiers supprimés
		const removed_files = this.#prev_files.filter((f) => !current_files.includes(f));
		removed_files.forEach((removed_file) => {
			const old_index = this.#prev_files.indexOf(removed_file);
			const old_meta = current_meta[old_index];

			if (old_meta && old_meta.mux_upload_id) {
				this.#mux_uploader.remove(old_meta);
			}
		});

		// 3. Réalignement du tableau des métadonnées (et remplissage des trous)
		const new_meta = current_files
			.map((file) => {
				const old_index = this.#prev_files.indexOf(file);
				return old_index !== -1 ? current_meta[old_index] : null;
			})
			.map((meta) => meta || {}) as MetaFile[];

		// 4. Traitement des nouveaux fichiers médias
		current_files.forEach((file, i) => {
			if (file instanceof File && file.type.startsWith('video/')) {
				// Extraction de la frame
				extract_video_frame(file).then(({ thumbnail, aspect_ratio }) => {
					// Callback pour mettre à jour le tableau réactif dans Svelte
					on_thumbnail_extracted(i, thumbnail);

					if (!new_meta[i]) new_meta[i] = {};
					new_meta[i].aspect_ratio = aspect_ratio;
				});

				// Déclenchement de l'upload Mux
				if (!new_meta[i]) new_meta[i] = {};
				this.#mux_uploader.upload(file, new_meta[i]);
			}
		});

		// 5. Mise à jour de la référence
		this.#prev_files = [...current_files];

		return new_meta;
	}

	/**
	 * Permet de forcer une nouvelle référence (ex: lors de la sauvegarde en base de données)
	 */
	update_baseline(files: (string | File)[]) {
		this.#prev_files = [...files];
	}
}
