import {useLiveQuery} from "dexie-react-hooks"
import {liveQuery} from "dexie"

import {db} from "./indexedDBInit";


interface ITableConfig<T> {
    tableName: string;
    params?: T & {} | {}
}
export interface ITable<T> {
    // data: (params?: Partial<T>) => T[] | undefined,
    data: T[] | undefined,
    add: (item: T) => Promise<string>,
    update: (id: string, updatedItem: Partial<T>) => Promise<void>,
    remove: (id: string) => Promise<void>,
    clearTable: () => Promise<void>,
    findOne: (query: {[keyPath: string]: any}) => Promise<T | undefined>,
    addMany: (items: T[]) => Promise<string[]>
}

const useTableDb = <T extends {_id: string}>({tableName, params}: ITableConfig<T>): ITable<T> => {
    db.open();

    const table = db.table<T, string>(tableName);
    const data = useLiveQuery(() => {
        return params ? table.where(params).toArray() : table.toArray();
    }, [])

    const add = (item: T) => table.add(item).then(String);

    const update = async (id: string, updatedItem: Partial<T>) => {
        const count = await table.update(id, updatedItem);
        if (count === 0) {
            throw new Error(`Item with id ${id} not found`);
        }
    };

    const remove = (id: string) => table.delete(id);
    const clearTable = () => table.clear();

    const findOne = async (query: { [keyPath: string]: any }) => table?.where(query)?.first() || undefined;

    const addMany = async (items: T[]) => {
        const addedIds = await table.bulkPut(items, {allKeys: true});
        return addedIds as string[];
    }

    return {
        add,
        data,
        remove,
        update,
        addMany,
        findOne,
        clearTable
    }
}

export default useTableDb;