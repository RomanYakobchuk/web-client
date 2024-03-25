import {Table} from "dexie";
import {IConversation} from "@/interfaces/common";

export type TChat = IConversation;

export type TChatTable = {
    chats: Table<TChat>
}

export const chatsSchema = {
    chats: '_id, members, lastMessage, depend.item, depend.id, createdAt, updatedAt'
}