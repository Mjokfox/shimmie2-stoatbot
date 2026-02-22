import BetterSqlite3 from "better-sqlite3"

export function create_post(db: BetterSqlite3.Database, post_id: number, message_id: string) {
    db.prepare("INSERT INTO posts VALUES (?, ?)")
        .run(post_id, message_id);
}

export function create_comment(db: BetterSqlite3.Database, comment_id: number, post_id: number, message_id: string) {
    db.prepare("INSERT INTO comments VALUES (?, ?, ?)")
        .run(comment_id, post_id, message_id);
}

export function get_message_from_post_id(db: BetterSqlite3.Database, post_id: any): string | undefined {
    const res = db.prepare<string, { message_id: string }>("SELECT message_id FROM posts WHERE post_id = ?").get(post_id);
    return res ? res.message_id : undefined;
}

export function get_replies_from_post_id(db: BetterSqlite3.Database, post_id: any): string[] {
    return db.prepare<string, { message_id: string }>("SELECT message_id FROM comments WHERE post_id = ?")
        .all(post_id)
        .map(r => r.message_id);
}

export function get_message_from_comment_id(db: BetterSqlite3.Database, comment_id: any): string | undefined {
    const res = db.prepare<string, { message_id: string }>("SELECT message_id FROM comments WHERE comment_id = ?").get(comment_id);
    return res ? res.message_id : undefined;
}

export function delete_post(db: BetterSqlite3.Database, post_id: any): void {
    db.prepare("DELETE FROM posts WHERE post_id = ?")
        .run(post_id);
    db.prepare("DELETE FROM comments WHERE post_id = ?")
        .run(post_id);
}

export function delete_comment(db: BetterSqlite3.Database, comment_id: any): void {
    db.prepare("DELETE FROM comments WHERE comment_id = ?")
        .run(comment_id);
}

