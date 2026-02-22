import config from '../../../config.json' with { type: "json" };

export function comment_embed(username: string, postID: number, commentID: number, comment: string) {
	return {
		"color": "0xff8c00",
		"title": `New comment on post >>${postID}!`,
		"description": `#### ${username}\n${comment}`,
		"url": `${config.serverUrl}/post/view/${postID}#${commentID}`
	}
}
