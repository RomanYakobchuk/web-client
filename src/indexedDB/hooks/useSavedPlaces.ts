import {IFavPlaces} from "@/interfaces/types";
import useTableDB, {ITable} from "@/indexedDB/useTableDB";

type ISaved = IFavPlaces & {
    _id: string
}
interface IRes {
    places: ITable<ISaved>['data'],
    addPlace: ITable<ISaved>['add'],
    updatePlace: ITable<ISaved>['update'],
    deletePlace: ITable<ISaved>['remove'],
    findPlace: ITable<ISaved>['findOne'],
    addManyPlaces: ITable<ISaved>['addMany'],
}

const tableName = 'savedPlaces';
const useSavedPlaces = (): IRes => {
    const {data, add, update, remove, addMany, findOne} = useTableDB<ISaved>({
        tableName,
    });

    // const places = () => data();
    const places = data;
    return {
        places: places,
        addPlace: add,
        updatePlace: update,
        deletePlace: remove,
        findPlace: findOne,
        addManyPlaces: addMany
    }
}

export default useSavedPlaces;