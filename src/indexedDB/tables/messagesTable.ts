import {Table} from "dexie";
import {IMessage} from "@/interfaces/common";

export type TMessage = IMessage;

export type TMessageTable = {
    chats: Table<TMessage>
}

export const messagesSchema = {
    messages: '_id, conversationId, sender, text, memberType, createdAt, updatedAt, isRead, isSent, isError'
}