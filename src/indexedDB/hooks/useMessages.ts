import useTableDB, {ITable} from "@/indexedDB/useTableDB";
import {IMessage} from "@/interfaces/common";

const tableName = 'messages';

interface IRes {
    messages: ITable<IMessage>['data'],
    addMessage: ITable<IMessage>['add'],
    updateMessage: ITable<IMessage>['update'],
    deleteMessage: ITable<IMessage>['remove'],
    findMessage: ITable<IMessage>['findOne'],
    addManyMessages: ITable<IMessage>['addMany'],
}

type TProps = {
    chatId: string
}
const useMessages = ({chatId}: TProps): IRes => {

    const {data, add, update, remove, addMany, findOne} = useTableDB<IMessage>({
        tableName: tableName,
        params: {
            conversationId: chatId
        }
    });

    // const messages = () => data({
    //     conversationId: chatId
    // });
    const messages = data;
    return {
        messages: messages,
        addMessage: add,
        updateMessage: update,
        deleteMessage: remove,
        findMessage: findOne,
        addManyMessages: addMany
    }
}

export default useMessages;