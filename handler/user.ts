import { Channel } from 'stoat.js';
import BetterSqlite3 from "better-sqlite3"
import { type Handler, Fields } from '../models/handler.ts';
import { user_embed } from './embed/user.ts';

export class UserHandler implements Handler {
    db: BetterSqlite3.Database;
    channel: Channel;
    constructor(db: BetterSqlite3.Database, channel: Channel) {
        this.db = db;
        this.channel = channel;
    }

    create(fields: Fields): void {
        if (!fields.username) {
            return;
        }
        const embed = user_embed(fields.username);
        this.channel.sendMessage({ embeds: [embed] })
            .catch(e => console.error(`error notifying user creation:\n${e}`));
    }
    edit(): void {
        // doesnt exist
    }
    delete(fields: Fields): void {
        if (!fields.username) return;
        this.channel.sendMessage(`User deleted: "${fields.username}"`)
            .catch(e => console.error(`error notifying user deletion:\n${e}`));
    }
}