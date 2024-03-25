import {Table} from "dexie";

type TSubscribeDb = {
    _id: string,
    establishmentId: string,
    createdAt?: Date
}

export type TSubscribeTable = {
    subscribes: Table<TSubscribeDb>
}

export const subscribesSchema = {
    subscribes: '_id, establishmentId, createdAt'
}