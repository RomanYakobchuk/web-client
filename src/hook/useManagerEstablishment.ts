import {Dispatch, SetStateAction, useContext} from "react";

import {CommentCreatorDataContext} from "../contexts/CommentCreatorDataContext";
import {PropertyProps} from "../interfaces/common";

type TProps = {
    managerEstablishment: PropertyProps[],
    setManagerEstablishment: Dispatch<SetStateAction<PropertyProps[]>>,
    getData: () => void,
    isLoading: boolean
}
export const useManagerEstablishment = (): TProps => {
    const {setManagerEstablishment, managerEstablishment, isLoading, getData} = useContext(CommentCreatorDataContext);

    return {
        managerEstablishment,
        setManagerEstablishment,
        getData,
        isLoading
    }
}