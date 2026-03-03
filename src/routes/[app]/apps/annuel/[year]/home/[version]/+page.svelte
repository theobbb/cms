<script lang="ts">
	import { page } from '$app/state';
	import { use_pocketbase } from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';
  import { onMount } from 'svelte';

  type Version = RecordModel & {html: string; css: string;}
    type File = RecordModel & {file: string; type: string}
  // --- Config ---
  const POCKETBASE_URL = 'https://your-pocketbase.com'; // TODO: replace
  const COLLECTION = 'landing_pages';
  const MEDIA_COLLECTION = 'landing_media';

  const pocketbase = use_pocketbase()

  let versions: Version[] = $state([])
  let version: Version | null = $state(null);

  let files: File[] = $state([])
  // --- State ---
  let uploadingFiles = false;
  let saving = false;
  let activeTab = 'html';
  let previewOpen = false;
  let saveStatus = ''; // '', 'saved', 'error'

  // --- On mount: load existing record ---
  onMount(async () => {
	if (!page.params.year) return;
    try {
      const record = await pocketbase.collection('splash_versions').getFullList({filter: `year = "${page.params.year}"`, sort: '-updated'})
      await loadMedia();
    } catch (e) {
      console.error('Failed to load', e);
    }
  });

  async function load_files() {
    try {
        const 
      const res = await fetch(`${POCKETBASE_URL}/api/collections/${MEDIA_COLLECTION}/records?perPage=200`);
      const data = await res.json();
      mediaFiles = (data.items || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type, // 'image', 'video', 'font'
        url: `${POCKETBASE_URL}/api/files/${MEDIA_COLLECTION}/${item.id}/${item.file}`,
      }));
    } catch (e) {
      console.error('Failed to load media', e);
    }
  }

  // --- Save HTML + CSS ---
  async function save() {
    saving = true;
    saveStatus = '';
    try {
      const body = { html, css };
      let res;
      if (recordId) {
        res = await fetch(`${POCKETBASE_URL}/api/collections/${COLLECTION}/records/${recordId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${POCKETBASE_URL}/api/collections/${COLLECTION}/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        recordId = data.id;
      }
      saveStatus = res.ok ? 'saved' : 'error';
    } catch (e) {
      saveStatus = 'error';
    }
    saving = false;
    setTimeout(() => saveStatus = '', 3000);
  }

  // --- Upload media files ---
  async function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    uploadingFiles = true;

    for (const file of files) {
      const type = file.type.startsWith('image/') ? 'image'
                 : file.type.startsWith('video/') ? 'video'
                 : file.type.includes('font') || /\.(woff2?|ttf|otf)$/i.test(file.name) ? 'font'
                 : 'other';

      const form = new FormData();
      form.append('file', file);
      form.append('name', file.name);
      form.append('type', type);

      try {
        await fetch(`${POCKETBASE_URL}/api/collections/${MEDIA_COLLECTION}/records`, {
          method: 'POST',
          body: form,
        });
      } catch (e) {
        console.error('Upload failed for', file.name, e);
      }
    }

    await loadMedia();
    uploadingFiles = false;
    e.target.value = '';
  }

  async function deleteMedia(id) {
    if (!confirm('Delete this file?')) return;
    await fetch(`${POCKETBASE_URL}/api/collections/${MEDIA_COLLECTION}/records/${id}`, {
      method: 'DELETE',
    });
    await loadMedia();
  }

  // --- Copy token to clipboard ---
  function copyToken(name) {
    navigator.clipboard.writeText(`@media/${name}`);
  }

  // --- Rendered preview: replace @media/filename with actual URLs ---
  $: previewHTML = buildPreview(html, css, mediaFiles);

  function buildPreview(html, css, files) {
    let resolved = html;
    for (const f of files) {
      resolved = resolved.replaceAll(`@media/${f.name}`, f.url);
    }
    // Scope CSS under .annuel-custom
    const scopedCss = scopeCSS(css);
    return `
      <style>${scopedCss}</style>
      <div class="annuel-custom">${resolved}</div>
    `;
  }

  function scopeCSS(css) {
    // Simple scoping: prepend .annuel-custom to each rule block selector
    // Handles basic cases; not a full parser
    return css.replace(/([^{}]+)\{/g, (match, selector) => {
      const trimmed = selector.trim();
      if (!trimmed || trimmed.startsWith('@')) return match;
      const scoped = trimmed.split(',').map(s => `.annuel-custom ${s.trim()}`).join(', ');
      return `${scoped} {`;
    });
  }

  // --- Tab key in textarea ---
  function handleTab(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target;
    const s = ta.selectionStart;
    const val = ta.value;
    ta.value = val.slice(0, s) + '  ' + val.slice(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = s + 2;
    // Trigger svelte reactivity
    if (activeTab === 'html') html = ta.value;
    else css = ta.value;
  }

  $: images = mediaFiles.filter(f => f.type === 'image');
  $: videos = mediaFiles.filter(f => f.type === 'video');
  $: fonts  = mediaFiles.filter(f => f.type === 'font');
</script>

<!-- ===================== MARKUP ===================== -->

<div class="cms">
	<!-- Header -->
	<header>
		<div class="header-left">
			<span class="logo">L'Annuel</span>
			<span class="subtitle">Landing Page Editor</span>
		</div>
		<div class="header-right">
			{#if saveStatus === 'saved'}
				<span class="status ok">✓ Saved</span>
			{:else if saveStatus === 'error'}
				<span class="status err">✗ Error saving</span>
			{/if}
			<button class="btn-ghost" on:click={() => (previewOpen = !previewOpen)}>
				{previewOpen ? 'Hide Preview' : 'Preview'}
			</button>
			<button class="btn-primary" on:click={save} disabled={saving}>
				{saving ? 'Saving…' : 'Save'}
			</button>
		</div>
	</header>

	<div class="layout" class:with-preview={previewOpen}>
		<!-- Left: Editor panel -->
		<div class="editor-panel">
			<!-- Code editor -->
			<div class="code-editor">
				<div class="tabs">
					<button class:active={activeTab === 'html'} on:click={() => (activeTab = 'html')}>
						index.html
					</button>
					<button class:active={activeTab === 'css'} on:click={() => (activeTab = 'css')}>
						index.css
					</button>
				</div>

				{#if activeTab === 'html'}
					<textarea
						bind:value={html}
						on:keydown={handleTab}
						spellcheck="false"
						placeholder="Write your HTML here. Use @media/filename.jpg to reference uploaded files."
					></textarea>
				{:else}
					<textarea
						bind:value={css}
						on:keydown={handleTab}
						spellcheck="false"
						placeholder="Write your CSS here. Styles are automatically scoped to .annuel-custom."
					></textarea>
				{/if}
			</div>

			<!-- Media panel -->
			<div class="media-panel">
				<div class="media-header">
					<h3>Media</h3>
					<label class="btn-upload" class:loading={uploadingFiles}>
						{uploadingFiles ? 'Uploading…' : '+ Upload'}
						<input
							type="file"
							multiple
							accept="image/*,video/*,.woff,.woff2,.ttf,.otf"
							on:change={handleUpload}
							hidden
						/>
					</label>
				</div>

				<p class="media-hint">
					Reference files in your code with <code>@media/filename.jpg</code>
				</p>

				{#if images.length}
					<div class="media-section">
						<span class="media-label">Images</span>
						<div class="media-grid">
							{#each images as f}
								<div class="media-item">
									<img src={f.url} alt={f.name} />
									<div class="media-item-footer">
										<span class="media-name" title={f.name}>{f.name}</span>
										<div class="media-actions">
											<button on:click={() => copyToken(f.name)} title="Copy token">⎘</button>
											<button on:click={() => deleteMedia(f.id)} title="Delete">✕</button>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if videos.length}
					<div class="media-section">
						<span class="media-label">Videos</span>
						<div class="media-list">
							{#each videos as f}
								<div class="media-row">
									<span class="file-icon">▶</span>
									<span class="media-name">{f.name}</span>
									<button on:click={() => copyToken(f.name)} title="Copy token">⎘</button>
									<button on:click={() => deleteMedia(f.id)} title="Delete">✕</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if fonts.length}
					<div class="media-section">
						<span class="media-label">Fonts</span>
						<div class="media-list">
							{#each fonts as f}
								<div class="media-row">
									<span class="file-icon">Aa</span>
									<span class="media-name">{f.name}</span>
									<button on:click={() => copyToken(f.name)} title="Copy token">⎘</button>
									<button on:click={() => deleteMedia(f.id)} title="Delete">✕</button>
								</div>
							{/each}
						</div>
						<p class="font-hint">
							Use fonts in CSS: <code>src: url('@media/font.woff2')</code>
						</p>
					</div>
				{/if}

				{#if !mediaFiles.length && !uploadingFiles}
					<p class="empty">No media uploaded yet.</p>
				{/if}
			</div>
		</div>

		<!-- Right: Preview iframe -->
		{#if previewOpen}
			<div class="preview-panel">
				<div class="preview-bar">
					<span>Preview</span>
					<span class="preview-hint">Live — unsaved changes reflected</span>
				</div>
				<iframe title="Landing page preview" srcdoc={previewHTML} sandbox="allow-same-origin"
				></iframe>
			</div>
		{/if}
	</div>
</div>

<!-- ===================== STYLES ===================== -->

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	:global(body) {
		background: #1e1e1e;
		color: #d4d4d4;
		font-family: system-ui, sans-serif;
	}

	.cms {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	/* Header */
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		height: 48px;
		background: #252526;
		border-bottom: 1px solid #3c3c3c;
		flex-shrink: 0;
		gap: 12px;
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.logo {
		font-weight: 700;
		font-size: 15px;
		color: #fff;
	}
	.subtitle {
		font-size: 13px;
		color: #858585;
	}
	.header-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.status {
		font-size: 13px;
	}
	.status.ok {
		color: #4ec9b0;
	}
	.status.err {
		color: #f48771;
	}

	.btn-primary {
		background: #0e639c;
		color: #fff;
		border: none;
		padding: 6px 16px;
		border-radius: 4px;
		font-size: 13px;
		cursor: pointer;
	}
	.btn-primary:hover:not(:disabled) {
		background: #1177bb;
	}
	.btn-primary:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.btn-ghost {
		background: transparent;
		color: #ccc;
		border: 1px solid #3c3c3c;
		padding: 5px 14px;
		border-radius: 4px;
		font-size: 13px;
		cursor: pointer;
	}
	.btn-ghost:hover {
		border-color: #888;
		color: #fff;
	}

	/* Layout */
	.layout {
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	.layout.with-preview .editor-panel {
		width: 50%;
	}
	.layout.with-preview .preview-panel {
		flex: 1;
	}

	/* Editor panel */
	.editor-panel {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
		border-right: 1px solid #3c3c3c;
	}

	/* Code editor */
	.code-editor {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.tabs {
		display: flex;
		background: #252526;
		border-bottom: 1px solid #3c3c3c;
		flex-shrink: 0;
	}
	.tabs button {
		background: #2d2d2d;
		color: #969696;
		border: none;
		border-right: 1px solid #3c3c3c;
		border-top: 2px solid transparent;
		padding: 7px 18px;
		font-size: 13px;
		font-family: 'Cascadia Code', 'Fira Code', monospace;
		cursor: pointer;
	}
	.tabs button.active {
		background: #1e1e1e;
		color: #fff;
		border-top-color: #007acc;
	}

	textarea {
		flex: 1;
		background: #1e1e1e;
		color: #d4d4d4;
		border: none;
		padding: 14px 16px;
		font-size: 14px;
		font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
		line-height: 1.6;
		resize: none;
		outline: none;
		caret-color: #aeafad;
		tab-size: 2;
	}

	/* Media panel */
	.media-panel {
		background: #252526;
		border-top: 1px solid #3c3c3c;
		padding: 12px 16px;
		max-height: 280px;
		overflow-y: auto;
		flex-shrink: 0;
	}

	.media-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
	}
	.media-header h3 {
		font-size: 13px;
		font-weight: 600;
		color: #ccc;
	}

	.btn-upload {
		background: #37373d;
		color: #ccc;
		border: 1px solid #3c3c3c;
		padding: 4px 12px;
		border-radius: 4px;
		font-size: 12px;
		cursor: pointer;
	}
	.btn-upload:hover {
		background: #444;
	}
	.btn-upload.loading {
		opacity: 0.6;
		cursor: default;
	}

	.media-hint {
		font-size: 12px;
		color: #666;
		margin-bottom: 10px;
	}
	.media-hint code,
	.font-hint code {
		background: #1e1e1e;
		padding: 1px 5px;
		border-radius: 3px;
		color: #ce9178;
		font-size: 11px;
	}

	.media-section {
		margin-bottom: 12px;
	}
	.media-label {
		display: block;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #666;
		margin-bottom: 6px;
	}

	.media-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.media-item {
		width: 80px;
		background: #1e1e1e;
		border: 1px solid #3c3c3c;
		border-radius: 4px;
		overflow: hidden;
	}
	.media-item img {
		width: 100%;
		height: 56px;
		object-fit: cover;
		display: block;
	}
	.media-item-footer {
		padding: 3px 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.media-actions {
		display: flex;
		gap: 3px;
	}
	.media-actions button,
	.media-row button {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		font-size: 12px;
		padding: 1px 3px;
	}
	.media-actions button:hover,
	.media-row button:hover {
		color: #ccc;
	}

	.media-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.media-row {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #1e1e1e;
		border: 1px solid #3c3c3c;
		border-radius: 4px;
		padding: 5px 8px;
		font-size: 12px;
	}
	.file-icon {
		color: #666;
		font-size: 11px;
		width: 20px;
		text-align: center;
	}
	.media-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
		color: #ccc;
	}
	.font-hint {
		font-size: 11px;
		color: #666;
		margin-top: 6px;
	}
	.empty {
		font-size: 12px;
		color: #555;
		text-align: center;
		padding: 12px 0;
	}

	/* Preview */
	.preview-panel {
		display: flex;
		flex-direction: column;
	}
	.preview-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		height: 36px;
		background: #252526;
		border-bottom: 1px solid #3c3c3c;
		font-size: 13px;
		color: #ccc;
		flex-shrink: 0;
	}
	.preview-hint {
		font-size: 11px;
		color: #666;
	}
	iframe {
		flex: 1;
		border: none;
		background: #fff;
	}
</style>
