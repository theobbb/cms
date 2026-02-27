<script>
	const { name } = $props();
</script>

<div class="w-full rounded-xl border-2 border-green-200 bg-green-50 p-6">
	<div class="mb-4 flex items-start">
		<div class="shrink-0">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
				<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
					/>
				</svg>
			</div>
		</div>
		<div class="ml-4 flex-1">
			<h3 class="mb-2 text-lg font-semibold text-green-900">Welcome! You've Been Invited</h3>
			<div class="space-y-2 text-sm text-green-800">
				<p class="flex items-center">
					<svg class="mr-2 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
						/>
					</svg>
					<span class="font-medium">{name}</span>
				</p>
				<p class="flex items-start">
					<svg
						class="mt-0.5 mr-2 h-4 w-4 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span
						>This invitation link works <strong>one time only</strong> to set up your passkey.</span
					>
				</p>
			</div>
		</div>
	</div>

	<div class="mt-4 rounded-lg border border-green-200 bg-white p-4">
		<p class="mb-2 text-sm font-medium text-gray-700">What happens next:</p>
		<ol class="space-y-2 text-sm text-gray-600">
			<li class="flex items-start">
				<span
					class="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700"
					>1</span
				>
				<span>Click "Connect" below</span>
			</li>
			<li class="flex items-start">
				<span
					class="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700"
					>2</span
				>
				<span>Use your fingerprint, face, or PIN to create your passkey</span>
			</li>
			<li class="flex items-start">
				<span
					class="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700"
					>3</span
				>
				<span>You're all set! Future logins will be instant</span>
			</li>
		</ol>
	</div>
</div>
