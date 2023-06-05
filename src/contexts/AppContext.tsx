import {createContext, FC, PropsWithChildren} from "react";


type AppContextType = {
    state: string;
    setState: () => void;
};

export const AppContext = createContext<AppContextType>(
    {} as AppContextType
);


const AppContextProvider: FC<PropsWithChildren> = ({children}) => {
    return (
        <div>

        </div>
        // <AppContext.Provider value={{
        //     state,
        //     setState
        // }}>
        //      {children}
        //  </AppContext.Provider>
     );
 };
 export default AppContext
