import BaseDexie from "dexie";

import {messagesSchema as messages, TMessageTable} from "./tables/messagesTable"
import {chatsSchema as chats, TChatTable} from "./tables/chatsTable"
import {savedPlaceSchema as savedPlaces, TSavedPlaceTable} from "./tables/savedPlacesTable"
import {subscribesSchema as subscribes, TSubscribeTable} from "./tables/subscribesTable"


type DexieTables = TMessageTable & TChatTable & TSavedPlaceTable & TSubscribeTable;
export type Dexie<T extends any = DexieTables> = BaseDexie & T;

const DBName = 'capl-db';
export const db = new BaseDexie(DBName) as Dexie;

const schema = Object.assign(
    {},
    chats,
    messages,
    savedPlaces,
    subscribes
)

db.version(1).stores(schema);

export const storageSize = () => {
    const f = async () => {
        const {usage} = await navigator.storage.estimate();
        if (usage) {
            return (usage / (1024 * 1024))?.toFixed(2);
        } else {
            return 0;
        }
    }
    return f();
}

export const deleteIndexedDB = () => {
    window.indexedDB.deleteDatabase(DBName);
    db.close();
}