<script>
	import Box from '$lib/components/box.svelte';

	const currentDomain = '';
</script>

<div class="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/70">
				<div class="icon-[ri--key-line] text-3xl text-white"></div>
			</div>
			<h1 class="mb-2 text-4xl font-semibold">
				Authentification par <span class="italic">passkey</span>
			</h1>
			<p class="text-xl text-gray-600">
				Une alternative sécurisée aux mots de passe — et aux emails
			</p>
		</div>

		<!-- Pourquoi pas les emails ? -->
		<Box color="blue" class="px-6 py-5">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">Pas de emails ?</h2>
			<p class="mb-4 text-gray-700">
				La plupart des systèmes envoient des liens de connexion ou des codes par email. C'est
				pratique en apparence, mais c'est une mauvaise idée en pratique :
			</p>
			<ul class="space-y-2 text-gray-700">
				<li>
					📬 <strong>Les emails ne sont pas sécurisés</strong> — ils transitent en clair sur des serveurs
					tiers, peuvent être interceptés ou transférés sans votre accord.
				</li>
				<li>
					🎣 <strong>Vecteur de phishing n°1</strong> — la majorité des attaques commencent par un email
					frauduleux imitant un lien de connexion légitime.
				</li>
				<li>
					⏳ <strong>Lents et peu fiables</strong> — les emails arrivent en retard, tombent dans les spams,
					ou ne arrivent tout simplement pas.
				</li>
				<li>
					🔑 <strong>Votre boîte mail devient un point de défaillance unique</strong> — si quelqu'un accède
					à vos emails, il accède à tout.
				</li>
			</ul>
			<div class="mt-4 border border-red-300 bg-red-100 p-4">
				<p class="text-sm text-red-900">
					<strong>Notre choix :</strong> on a supprimé les emails du processus d'authentification. Vous
					n'avez pas besoin d'une boîte mail pour vous connecter — seulement de votre appareil et de vos
					empreintes digitales (ou votre visage, ou votre code PIN).
				</p>
			</div>
		</Box>
		<div class="mb-6 border border-red-200 bg-red-50 p-8">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">Pourquoi on n'utilise pas les emails ?</h2>
			<p class="mb-4 text-gray-700">
				La plupart des systèmes envoient des liens de connexion ou des codes par email. C'est
				pratique en apparence, mais c'est une mauvaise idée en pratique :
			</p>
			<ul class="space-y-2 text-gray-700">
				<li>
					📬 <strong>Les emails ne sont pas sécurisés</strong> — ils transitent en clair sur des serveurs
					tiers, peuvent être interceptés ou transférés sans votre accord.
				</li>
				<li>
					🎣 <strong>Vecteur de phishing n°1</strong> — la majorité des attaques commencent par un email
					frauduleux imitant un lien de connexion légitime.
				</li>
				<li>
					⏳ <strong>Lents et peu fiables</strong> — les emails arrivent en retard, tombent dans les spams,
					ou ne arrivent tout simplement pas.
				</li>
				<li>
					🔑 <strong>Votre boîte mail devient un point de défaillance unique</strong> — si quelqu'un accède
					à vos emails, il accède à tout.
				</li>
			</ul>
			<div class="mt-4 border border-red-300 bg-red-100 p-4">
				<p class="text-sm text-red-900">
					<strong>Notre choix :</strong> on a supprimé les emails du processus d'authentification. Vous
					n'avez pas besoin d'une boîte mail pour vous connecter — seulement de votre appareil et de vos
					empreintes digitales (ou votre visage, ou votre code PIN).
				</p>
			</div>
		</div>

		<!-- Qu'est-ce qu'une clé d'accès ? -->
		<div class=" shadow-lg- mb-6 bg-white p-8">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">Qu'est-ce qu'une clé d'accès ?</h2>
			<p class="mb-4 text-gray-700">
				Les clés d'accès (passkeys) sont une méthode moderne et sécurisée pour se connecter sans mot
				de passe. Elles utilisent la sécurité intégrée de votre appareil — empreinte digitale,
				reconnaissance faciale ou code PIN — pour vérifier votre identité.
			</p>
			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="flex flex-col items-center bg-green-50 p-4 text-center">
					<div class="mb-2 icon-[ri--shield-check-line] text-4xl text-green-600"></div>
					<h3 class="mb-1 font-semibold text-gray-900">Plus sécurisé</h3>
					<p class="text-sm text-gray-600">Résistant au phishing, unique par site</p>
				</div>
				<div class="flex flex-col items-center bg-blue-50 p-4 text-center">
					<svg
						class="mb-2 h-12 w-12 text-blue-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					<h3 class="mb-1 font-semibold text-gray-900">Connexion rapide</h3>
					<p class="text-sm text-gray-600">Aucun mot de passe à retenir ou à saisir</p>
				</div>
				<div class="flex flex-col items-center bg-purple-50 p-4 text-center">
					<svg
						class="mb-2 h-12 w-12 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
					<h3 class="mb-1 font-semibold text-gray-900">Lié à l'appareil</h3>
					<p class="text-sm text-gray-600">Utilise la sécurité de votre téléphone ou ordinateur</p>
				</div>
			</div>
		</div>

		<!-- Comment inviter des utilisateurs -->
		<div class="mb-6 bg-white p-8 shadow-lg">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white"
				>
					1
				</div>
				<h2 class="text-2xl font-bold text-gray-900">Comment inviter des utilisateurs</h2>
			</div>

			<div class="space-y-6">
				<div class="flex">
					<div
						class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
					>
						a
					</div>
					<div class="ml-4">
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Créer le compte utilisateur</h3>
						<p class="mb-3 text-gray-700">
							En tant qu'administrateur, rendez-vous dans la section Utilisateurs et créez un
							nouveau compte. Renseignez l'adresse email et les informations de base.
						</p>
						<div class=" border border-gray-200 bg-gray-50 p-4">
							<code class="text-sm text-gray-800"
								>Utilisateurs → Ajouter un utilisateur → Saisir l'email et les informations</code
							>
						</div>
					</div>
				</div>

				<div class="flex">
					<div
						class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
					>
						b
					</div>
					<div class="ml-4">
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Générer un lien d'inscription</h3>
						<p class="mb-3 text-gray-700">
							Copiez le lien d'inscription unique généré pour le nouvel utilisateur. Ce lien
							contient son identifiant pour configurer sa clé d'accès.
						</p>
						<div class=" border border-blue-200 bg-blue-50 p-4">
							<p class="font-mono text-sm break-all text-blue-900">
								https://{currentDomain}/auth?register=abc123xyz
							</p>
						</div>
					</div>
				</div>

				<div class="flex">
					<div
						class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
					>
						c
					</div>
					<div class="ml-4">
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Envoyer à l'utilisateur</h3>
						<p class="mb-3 text-gray-700">
							Partagez le lien d'inscription avec l'utilisateur par email ou messagerie sécurisée.
							Il n'a qu'à cliquer dessus pour configurer sa clé d'accès.
						</p>
						<div class=" border border-green-200 bg-green-50 p-4">
							<p class="text-sm text-green-900">
								💡 <strong>Astuce :</strong> Le lien est à usage unique pour la configuration initiale.
								Une fois la clé d'accès enregistrée, l'utilisateur peut se connecter normalement — sans
								email.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Se connecter depuis un autre appareil -->
		<div class="mb-6 bg-white p-8 shadow-lg">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white"
				>
					2
				</div>
				<h2 class="text-2xl font-bold text-gray-900">Se connecter depuis un autre appareil</h2>
			</div>

			<p class="mb-6 text-gray-700">
				Une fois votre clé d'accès enregistrée sur un appareil, vous avez plusieurs options pour
				accéder à l'application depuis d'autres appareils :
			</p>

			<div class="space-y-6">
				<!-- Option 1 -->
				<div class=" border-2 border-indigo-200 p-6">
					<div class="mb-3 flex items-start">
						<div class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center bg-indigo-100">
							<svg
								class="h-6 w-6 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-900">
								Option 1 : Clé d'accès propre à l'appareil
							</h3>
							<p class="mb-2 text-sm font-medium text-indigo-600">
								Recommandé pour une sécurité maximale
							</p>
						</div>
					</div>
					<ol class="ml-16 list-inside list-decimal space-y-2 text-gray-700">
						<li>
							Visitez <span class=" bg-gray-100 px-2 py-1 font-mono text-sm"
								>https://{currentDomain}</span
							> sur votre nouvel appareil
						</li>
						<li>Demandez un nouveau lien d'inscription à un administrateur</li>
						<li>Cliquez sur le lien et enregistrez une clé d'accès sur cet appareil</li>
						<li>Chaque appareil aura sa propre clé pour une sécurité maximale</li>
					</ol>
					<div class="mt-4 ml-16 border border-green-200 bg-green-50 p-3">
						<p class="text-sm text-green-800">
							<strong>✓ Plus sécurisé :</strong> chaque appareil possède sa propre clé d'accès unique
						</p>
					</div>
				</div>

				<!-- Option 2 -->
				<div class=" border-2 border-blue-200 p-6">
					<div class="mb-3 flex items-start">
						<div class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center bg-blue-100">
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-900">
								Option 2 : Utiliser son téléphone pour se connecter sur un ordinateur
							</h3>
							<p class="mb-2 text-sm font-medium text-blue-600">
								Pratique pour les appareils de confiance
							</p>
						</div>
					</div>
					<ol class="ml-16 list-inside list-decimal space-y-2 text-gray-700">
						<li>
							Visitez <span class=" bg-gray-100 px-2 py-1 font-mono text-sm"
								>https://{currentDomain}</span
							> sur votre ordinateur
						</li>
						<li>Cliquez sur « Se connecter avec une clé d'accès »</li>
						<li>Choisissez « Utiliser un téléphone, une tablette ou une clé de sécurité »</li>
						<li>Scannez le QR code avec votre téléphone</li>
						<li>Approuvez la connexion avec votre biométrie</li>
					</ol>
					<div class="mt-4 ml-16 border border-blue-200 bg-blue-50 p-3">
						<p class="text-sm text-blue-800">
							<strong>✓ Pratique :</strong> utilisez la clé de votre téléphone pour vous connecter sur
							d'autres appareils
						</p>
					</div>
				</div>

				<!-- Option 3 -->
				<div class=" border-2 border-purple-200 p-6">
					<div class="mb-3 flex items-start">
						<div class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center bg-purple-100">
							<svg
								class="h-6 w-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-900">
								Option 3 : Clés synchronisées (Apple / Google)
							</h3>
							<p class="mb-2 text-sm font-medium text-purple-600">
								Automatique si vous utilisez iCloud Keychain ou Google Password Manager
							</p>
						</div>
					</div>
					<div class="ml-16 space-y-3">
						<p class="text-gray-700">
							Si vous avez enregistré une clé d'accès sur un iPhone/Mac ou un appareil Android avec
							la synchronisation activée, votre clé se synchronise automatiquement sur tous vos
							appareils connectés au même compte :
						</p>
						<ul class="list-inside list-disc space-y-1 text-gray-700">
							<li>
								<strong>Apple :</strong> synchronisation via iCloud Keychain sur iPhone, iPad et Mac
							</li>
							<li>
								<strong>Google :</strong> synchronisation via Google Password Manager sur Android et Chrome
							</li>
						</ul>
						<div class=" border border-purple-200 bg-purple-50 p-3">
							<p class="text-sm text-purple-800">
								<strong>✓ Transparent :</strong> connectez-vous sur n'importe lequel de vos appareils
								synchronisés sans configuration supplémentaire
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Questions fréquentes -->
		<div class="mb-6 bg-white p-8 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Questions fréquentes</h2>

			<div class="space-y-6">
				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900"
							>Que se passe-t-il si je perds mon appareil ?</span
						>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						En cas de perte, contactez un administrateur pour obtenir un nouveau lien d'inscription.
						Vous pourrez alors enregistrer une clé d'accès sur votre nouvel appareil. Si vos clés
						étaient synchronisées via iCloud ou Google, elles seront automatiquement disponibles sur
						vos autres appareils.
					</div>
				</details>

				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900"
							>Puis-je avoir plusieurs clés d'accès pour la même application ?</span
						>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						Oui ! Vous pouvez enregistrer plusieurs clés d'accès pour la même application — une pour
						votre téléphone, une pour votre ordinateur portable, etc. Chaque lien d'inscription
						ajoutera une nouvelle clé à votre compte. Lors de la connexion, vous pourrez choisir
						laquelle utiliser.
					</div>
				</details>

				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900"
							>Est-ce plus sécurisé que les mots de passe ?</span
						>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						Oui ! Les clés d'accès résistent au phishing, ne peuvent pas être devinées ni volées
						lors de fuites de données, et nécessitent un accès physique à votre appareil ainsi
						qu'une vérification biométrique. Elles reposent sur une cryptographie standard et sont
						considérées comme la méthode d'authentification la plus sécurisée disponible
						aujourd'hui.
					</div>
				</details>

				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900"
							>Quels navigateurs et appareils prennent en charge les clés d'accès ?</span
						>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						Les clés d'accès fonctionnent sur les navigateurs modernes : Chrome, Safari, Edge et
						Firefox, sur iOS 16+, macOS 13+, Android 9+ et Windows 10+. La plupart des appareils
						récents les prennent en charge.
					</div>
				</details>
			</div>
		</div>

		<!-- Référence rapide -->
		<div class=" bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
			<h2 class="mb-4 text-2xl font-bold">Référence rapide</h2>
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<h3 class="mb-2 flex items-center font-semibold">
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							/>
						</svg>
						Pour les administrateurs
					</h3>
					<ul class="space-y-1 text-indigo-100">
						<li>• Créer le compte utilisateur</li>
						<li>• Générer un lien d'inscription</li>
						<li>• Envoyer le lien de manière sécurisée</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-2 flex items-center font-semibold">
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						Pour les utilisateurs
					</h3>
					<ul class="space-y-1 text-indigo-100">
						<li>• Cliquer sur le lien d'inscription</li>
						<li>• Configurer la clé d'accès avec votre biométrie</li>
						<li>• Se connecter depuis d'autres appareils si besoin</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Bouton retour -->
		<div class="mt-8 text-center">
			<a
				href="/"
				class="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800"
			>
				<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Retour au tableau de bord
			</a>
		</div>
	</div>
</div>
