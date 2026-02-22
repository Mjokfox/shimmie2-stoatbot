export interface Handler {
    create(fields: Fields): void;
    edit(fields: Fields): void;
    delete(fields: Fields): void;
}

export class Fields {
    post_id: number | undefined
    username: string | undefined
    hash: string | undefined
    mime: string | undefined
    size: number | undefined
    comment_id: number | undefined
    message: string | undefined
}

export class ShimmieJson {
    section!: string
    type!: string
    fields!: Fields
}