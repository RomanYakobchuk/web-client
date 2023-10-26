import {createContext, FC, PropsWithChildren, useEffect, useState} from "react";
import {localFavPlacesKey} from "../config/const";


type IFavPlaces = {
    type: string,
    item: string
}

type AppContextType = {
    favoritePlaces: IFavPlaces[];
    setFavoritePlaces: (items: IFavPlaces[]) => void;
};

export const AppContext = createContext<AppContextType>(
    {} as AppContextType
);


export const AppContextProvider: FC<PropsWithChildren> = ({children}) => {

    const localFavPlaces = JSON.parse(localStorage.getItem(localFavPlacesKey) as string);

    const [favoritePlaces, setFavoritePlaces] = useState(localFavPlaces || [])

    useEffect(() => {
        window.localStorage.setItem(localFavPlacesKey, JSON.stringify(favoritePlaces));
    }, [favoritePlaces, localStorage.getItem(localFavPlacesKey)])

    return (
        <AppContext.Provider value={{
            favoritePlaces,
            setFavoritePlaces
        }}>
            {children}
        </AppContext.Provider>
    );
};