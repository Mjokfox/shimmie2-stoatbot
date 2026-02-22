import { Client } from 'stoat.js';
import { createSocket } from 'node:dgram';
import Database from "better-sqlite3"
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';

import { CommentHandler } from './handler/comment.js';
import { PostHandler } from './handler/image.js';

import config from '../config.json' with { type: "json" };
import { type Handler, ShimmieJson } from './models/handler.js';
import { UserHandler } from './handler/user.js';

const db = new Database("db/sqlite.db");

db.exec(`
CREATE TABLE IF NOT EXISTS comments (
  comment_id INTEGER NOT NULL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  message_id TEXT NOT NULL
)`);

db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  post_id INTEGER NOT NULL PRIMARY KEY,
  message_id TEXT NOT NULL
)`);

// stoat bot
const client = new Client();

client.on("ready", async () => {
  console.info(`Logged in as ${client.user?.username}!`);
  const channel = client.channels.get(config.logchannelID);
  if (!channel) throw new Error("log channel not found");
  channel.sendMessage(":01KHGRM101AN2XSN2421RZZQZM: I'm back!");
});

client.loginBot(config.token);

// udp client
const server = createSocket('udp4');
server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', async (msg, rinfo) => {
  const objectmsg: ShimmieJson = plainToClass(ShimmieJson, JSON.parse(msg.toString()));
  if (objectmsg && client.ready()) {
    const channel = client.channels.get(config.channelID);
    const logchannel = client.channels.get(config.logchannelID);
    if (channel && logchannel) {
      let handler: Handler;
      switch (objectmsg.section) {
        case "comment": handler = new CommentHandler(db, channel); break;
        case "post": handler = new PostHandler(client, db, channel); break;
        case "user": handler = new UserHandler(db, logchannel); break;
        default: throw new Error("malformed notification section");
      }
      switch (objectmsg.type) {
        case "create": handler.create(objectmsg.fields); break;
        case "edit": handler.edit(objectmsg.fields); break;
        case "delete": handler.delete(objectmsg.fields); break;
        default: throw new Error("malformed notification type");
      }
    }
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(config.udpPort);

