import useTableDB, {ITable} from "@/indexedDB/useTableDB";
import {IConversation} from "@/interfaces/common";

const tableName = 'chats';
interface IRes {
    chats: ITable<IConversation>['data'],
    addChat: ITable<IConversation>['add'],
    updateChat: ITable<IConversation>['update'],
    deleteChat: ITable<IConversation>['remove'],
    findChat: ITable<IConversation>['findOne'],
    addManyChats: ITable<IConversation>['addMany'],
}
const useChats = (): IRes => {
    const {data, add, update, remove, addMany, findOne} = useTableDB<IConversation>({
        tableName: tableName,
    });

    // const chats = () => data();
    const chats = data;
    return {
        chats: chats,
        addChat: add,
        updateChat: update,
        deleteChat: remove,
        findChat: findOne,
        addManyChats: addMany
    }
}

export default useChats;