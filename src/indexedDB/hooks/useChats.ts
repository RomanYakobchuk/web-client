import useTableDB, {ITable} from "@/indexedDB/useTableDB";
import {IConversation} from "@/interfaces/common";
import {db} from "@/indexedDB/indexedDBInit";

const tableName = 'chats';

interface IRes {
    chats: (dependItem?: string) => Promise<Array<IConversation> | undefined>,
    addChat: ITable<IConversation>['add'],
    updateChat: ITable<IConversation>['update'],
    deleteChat: ITable<IConversation>['remove'],
    findChat: ITable<IConversation>['findOne'],
    addManyChats: ITable<IConversation>['addMany'],
    clearChats: ITable<IConversation>['clearTable'],
}

const useChats = (): IRes => {

    const {add, update, clearTable, remove, addMany, findOne} = useTableDB<IConversation>({
        tableName: tableName,
    });

    const chats = async (dependItem?: string) => {
        db.open();
        const table = db.table<IConversation, string>(tableName);
        if (dependItem) {
            return table.where("depend.item").equals(dependItem).toArray();
        } else {
            return table.toArray();
        }
    }

    // const chats = () => data();
    return {
        chats: chats,
        addChat: add,
        updateChat: update,
        deleteChat: remove,
        findChat: findOne,
        addManyChats: addMany,
        clearChats: clearTable
    }
}

export default useChats;