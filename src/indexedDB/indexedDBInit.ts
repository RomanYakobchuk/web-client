import BaseDexie from "dexie";

import {messagesSchema as chats, TMessageTable} from "./tables/messagesTable"
import {chatsSchema as messages, TChatTable} from "./tables/chatsTable"
import {savedPlaceSchema as savedPlaces, TSavedPlaceTable} from "./tables/savedPlacesTable"


type DexieTables = TMessageTable & TChatTable & TSavedPlaceTable;
export type Dexie<T extends any = DexieTables> = BaseDexie & T;

const DBName = 'capl-db';
export const db = new BaseDexie(DBName) as Dexie;

const schema = Object.assign(
    {},
    chats,
    messages,
    savedPlaces
)

db.version(1).stores(schema);

export const deleteIndexedDB = () => {
    window.indexedDB.deleteDatabase(DBName);
    db.close();
}