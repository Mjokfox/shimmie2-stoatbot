import config from '../../config.json' with { type: "json" };

export function user_embed(username: string) {
	return {
		"color": "0xff8c00",
		"title": `New user "${username}"!`,
		"url": `${config.serverUrl}/user/${username}`
	}
}
