import useTableDB, {ITable} from "@/indexedDB/useTableDB";
import {IMessage} from "@/interfaces/common";
import {db} from "@/indexedDB/indexedDBInit";

const tableName = 'messages';

interface IRes {
    messages: (chatId: string) =>  Promise<Array<IMessage> | undefined>,
    addMessage: ITable<IMessage>['add'],
    updateMessage: ITable<IMessage>['update'],
    deleteMessage: ITable<IMessage>['remove'],
    findMessage: ITable<IMessage>['findOne'],
    addManyMessages: ITable<IMessage>['addMany'],
    clearMessages: ITable<IMessage>['clearTable'],
}

type TProps = {}
const useMessages = (): IRes => {

    const {add, update, remove, addMany, findOne, clearTable} = useTableDB<IMessage>({
        tableName: tableName,
    });

    const messages = async (chatId: string) => {
        if (chatId) {
            db.open();

            const table = db.table<IMessage, string>(tableName);
            const res = await table.where({conversationId: chatId}).toArray();
            return res;
        }
    }

    return {
        messages: messages,
        addMessage: add,
        updateMessage: update,
        deleteMessage: remove,
        findMessage: findOne,
        addManyMessages: addMany,
        clearMessages: clearTable
    }
}

export default useMessages;