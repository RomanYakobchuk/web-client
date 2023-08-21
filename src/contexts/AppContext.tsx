import {createContext, FC, PropsWithChildren, useEffect, useState} from "react";


type AppContextType = {
    favoritePlaces: string[];
    setFavoritePlaces: (items: string[] | any[]) => void;
};

export const AppContext = createContext<AppContextType>(
    {} as AppContextType
);


export const AppContextProvider: FC<PropsWithChildren> = ({children}) => {

    const favPlaces = JSON.parse(localStorage.getItem('favoritePlaces') as string);

    const [favoritePlaces, setFavoritePlaces] = useState(favPlaces || [])


    useEffect(() => {
        window.localStorage.setItem('favoritePlaces', JSON.stringify(favoritePlaces))
    }, [favPlaces])


    return (
        <AppContext.Provider value={{
            favoritePlaces,
            setFavoritePlaces
        }}>
            {children}
        </AppContext.Provider>
    );
};