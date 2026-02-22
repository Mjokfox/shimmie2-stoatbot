import { Client } from 'stoat.js';
import BetterSqlite3 from "better-sqlite3"
import { Channel } from 'stoat.js';
import { image_embed } from './embed/image.ts';
import { create_post, delete_post, get_message_from_post_id, get_replies_from_post_id } from "../dbfn.ts";
import { type Handler, Fields } from "../models/handler.ts";

export class PostHandler implements Handler {
    client: Client;
    db: BetterSqlite3.Database;
    channel: Channel;
    constructor(client: Client, db: BetterSqlite3.Database, channel: Channel) {
        this.client = client
        this.db = db;
        this.channel = channel;
    }

    create(fields: Fields): void {
        if (!fields.username || !fields.post_id || !fields.hash || !fields.mime || !fields.size) {
            return;
        }
        const post_id = fields.post_id;
        const embed = image_embed(this.client, fields.username, post_id, fields.hash, fields.mime, fields.size);
        this.channel.sendMessage({ content: embed.icon_url, embeds: [embed] })
            .then(message => create_post(this.db, post_id, message.id))
            .catch(e => console.error(`error notifying post creation:\n${e}`));
    }

    edit(fields: Fields): void {
        if (!fields.username || !fields.post_id || !fields.hash || !fields.mime || !fields.size) {
            return;
        }
        const message_id = get_message_from_post_id(this.db, fields.post_id);
        if (!message_id) return;

        const embed = image_embed(this.client, fields.username, fields.post_id, fields.hash, fields.mime, fields.size);
        this.channel.fetchMessage(message_id)
            .then(message => message.edit({ content: embed.icon_url, embeds: [embed] }))
            .catch(e => console.error(`error notifying post editing:\n${e}`));
    }
    delete(fields: Fields): void {
        if (!fields.post_id) return;
        const post_id = fields.post_id;
        const message_id = get_message_from_post_id(this.db, post_id);
        const replies = get_replies_from_post_id(this.db, post_id);
        if (!message_id) return
        this.channel.deleteMessages([message_id, ...replies])
            .then(_ => delete_post(this.db, post_id))
            .catch(e => console.error(`error notifying post deletion:\n${e}`));
    }
}