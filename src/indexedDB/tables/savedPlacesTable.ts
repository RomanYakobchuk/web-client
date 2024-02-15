import {Table} from "dexie";

export type TSavedPlace = {
    _id?: string,
    item: string,
    type: string
};

export type TSavedPlaceTable = {
    chats: Table<TSavedPlace>
}

export const savedPlaceSchema = {
    savedPlaces: '_id, item, type'
}