import {useContext} from "react";
import {AppContext, AppContextType} from "@/contexts/AppContext";

type TProps = {
    properties: AppContextType['properties'],
    setProperties: AppContextType['setProperties']
}
export const useUserProperties = (): TProps => {
    const {properties, setProperties} = useContext(AppContext);
    return {
        properties,
        setProperties
    }
};
