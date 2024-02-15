import Dexie from "dexie";
import {useLiveQuery} from "dexie-react-hooks"

import {db} from "./indexedDBInit";


interface ITableConfig<T> {
    tableName: string;
    params?: Partial<T>
}
export interface ITable<T> {
    // data: (params?: Partial<T>) => T[] | undefined,
    data: T[] | undefined,
    add: (item: T) => Promise<string>,
    update: (id: string, updatedItem: Partial<T>) => Promise<void>,
    remove: (id: string) => Promise<void>,
    findOne: (query: {[keyPath: string]: any}) => Promise<T | undefined>,
    addMany: (items: T[]) => Promise<string[]>
}

const useTableDb = <T extends {_id: string}>(config: ITableConfig<T>): ITable<T> => {

    db.open();
    // const db = new Dexie('capl-db');
    //
    // const storeConfig: Record<string, string> = {
    //     [config.tableName]: `${String(config.keyPath)}, ${config.fields.join(', ')}`
    // }
    //
    // db.version(1).stores(storeConfig);

    const table = db.table<T, string>(config.tableName);
    const data = useLiveQuery(() => {
        return config?.params ? table.where(config.params).toArray() : table.toArray();
    }, [config?.params])
    // const data = (params?: Partial<T>) => {
    //     return params ? table.where(params).toArray() : table.toArray();
    // };

        // useLiveQuery(() => {
    // }, []);

    const add = (item: T) => table.add(item).then(String);

    const update = async (id: string, updatedItem: Partial<T>) => {
        const count = await table.update(id, updatedItem);
        if (count === 0) {
            throw new Error(`Item with id ${id} not found`);
        }
    };

    const remove = (id: string) => table.delete(id);

    const findOne = async (query: { [keyPath: string]: any }) => table.where(query).first();

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
        findOne
    }
}

export default useTableDb;