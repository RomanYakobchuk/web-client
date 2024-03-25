import useTableDB, {ITable} from "@/indexedDB/useTableDB";
import {db} from "@/indexedDB/indexedDBInit";

const tableName = 'subscribes';
type ISubscribeDb = {
    _id: string,
    establishmentId: string,
}
interface IRes {
    subscribes: ITable<ISubscribeDb>['data'],
    addSubscribe: ITable<ISubscribeDb>['add'],
    updateSubscribe: ITable<ISubscribeDb>['update'],
    deleteSubscribe: ITable<ISubscribeDb>['remove'],
    findSubscribe: ITable<ISubscribeDb>['findOne'],
    addManySubscribe: ITable<ISubscribeDb>['addMany'],
}
const useSubscribes = (): IRes => {
    db.open();

    const {data, add, update, remove, addMany, findOne} = useTableDB<ISubscribeDb>({
        tableName: tableName,
    });

    // const chats = () => data();
    const subscribes = data;
    return {
        subscribes: subscribes,
        addSubscribe: add,
        updateSubscribe: update,
        deleteSubscribe: remove,
        findSubscribe: findOne,
        addManySubscribe: addMany
    }
}

export default useSubscribes;