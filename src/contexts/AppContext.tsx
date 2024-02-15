import {createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useState} from "react";
import {localFavPlacesKey, USER_PROPERTY} from "@/config/const";
import { IFavPlaces } from "@/interfaces/types";


type TProperties = {
    notReadNotifications: number,
    isShowUserDontHaveUniqueIndicator: boolean
}
export type AppContextType = {
    properties: TProperties,
    setProperties: Dispatch<SetStateAction<TProperties>>,
    favoritePlaces: IFavPlaces[];
    setFavoritePlaces: (items: IFavPlaces[]) => void;
};

export const AppContext = createContext<AppContextType>(
    {} as AppContextType
);

export const AppContextProvider: FC<PropsWithChildren> = ({children}) => {

    const localFavPlaces = JSON.parse(localStorage.getItem(localFavPlacesKey) as string);
    const userProperties = JSON.parse(localStorage.getItem(USER_PROPERTY) as string);

    const [properties, setProperties] = useState<TProperties>(userProperties || {notReadNotifications: 0, isShowUserDontHaveUniqueIndicator: true} as TProperties);
    const [favoritePlaces, setFavoritePlaces] = useState(localFavPlaces || [])

    useEffect(() => {
        window.localStorage.setItem(localFavPlacesKey, JSON.stringify(favoritePlaces));
    }, [favoritePlaces])
    useEffect(() => {
        window.localStorage.setItem(USER_PROPERTY, JSON.stringify(properties));
    }, [properties])

    return (
        <AppContext.Provider value={{
            favoritePlaces,
            setFavoritePlaces,
            properties,
            setProperties
        }}>
            {children}
        </AppContext.Provider>
    );
};