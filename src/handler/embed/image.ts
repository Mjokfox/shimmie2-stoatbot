import { Client } from 'stoat.js';
import config from '../../../config.json' with { type: "json" };
import mime from 'mime';

export function image_embed(client: Client, username: string, post_id: number, hash: string, post_mime: string, size: number) {
	var path = "thumbs";
	var fext = "jpeg";
	if (post_mime.split("/")[0] != "video") {
		let ext = mime.getExtension(post_mime);
		fext = (ext ? `${ext}` : "jpeg"); // wtf mime-types
		if (size < 10485760 || fext == "gif") {
			path = "images";
		}
	}
	const file = client.proxyFile(`${config.serverUrl}/${path}/${hash}/${post_id}.${fext}`) ?? "aaaa";
	return {
		"color": "0xff8c00",
		"title": `New post! >>${post_id}`,
		"description": `By [${username}](${config.serverUrl}/user/${username})`,
		"url": `${config.serverUrl}/post/view/${post_id}`,
		"icon_url": file
	}

}
