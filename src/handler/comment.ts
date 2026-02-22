import { Channel } from 'stoat.js';
import { comment_embed } from './embed/comment.js';
import BetterSqlite3 from "better-sqlite3"
import { create_comment, delete_comment, get_message_from_comment_id, get_message_from_post_id } from '../dbfn.js';
import { type Handler, Fields } from '../models/handler.js';

export class CommentHandler implements Handler {
    db: BetterSqlite3.Database;
    channel: Channel;
    constructor(db: BetterSqlite3.Database, channel: Channel) {
        this.db = db;
        this.channel = channel;
    }

    create(fields: Fields): void {
        if (!fields.username || !fields.post_id || !fields.comment_id || !fields.message) {
            return;
        }
        const comment_id = fields.comment_id;
        const post_id = fields.post_id;

        const embed = comment_embed(fields.username, post_id, comment_id, fields.message);
        const res = get_message_from_post_id(this.db, post_id);
        this.channel.sendMessage({ embeds: [embed], replies: (res ? [{ id: res, mention: false }] : null) })
            .then(message => create_comment(this.db, comment_id, post_id, message.id))
            .catch(e => console.error(`error notifying comment creation:\n${e}`));
    }
    edit(fields: Fields): void {
        if (!fields.username || !fields.post_id || !fields.comment_id || !fields.message) {
            return;
        }

        const message_id = get_message_from_comment_id(this.db, fields.comment_id);
        if (!message_id) return

        const embed = comment_embed(fields.username, fields.post_id, fields.comment_id, fields.message);
        this.channel.fetchMessage(message_id)
            .then(message => message.edit({ embeds: [embed] }))
            .catch(e => console.error(`error notifying comment editing:\n${e}`));
    }
    delete(fields: Fields): void {
        if (!fields.comment_id) return;
        const comment_id = fields.comment_id;
        const message_id = get_message_from_comment_id(this.db, comment_id);
        if (!message_id) return
        this.channel.deleteMessages([message_id])
            .then(_ => delete_comment(this.db, comment_id))
            .catch(e => console.error(`error notifying comment deletion:\n${e}`));
    }
}