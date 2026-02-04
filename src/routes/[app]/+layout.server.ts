export async function load({ locals: { app, pocketbase, user, public_route } }) {
	return { app, user, server_auth: pocketbase.authStore.exportToCookie(), public_route };
}
