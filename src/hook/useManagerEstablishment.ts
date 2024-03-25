import {Dispatch, SetStateAction, useContext} from "react";

import {CommentCreatorDataContext} from "../contexts/CommentCreatorDataContext";
import {IEstablishment} from "../interfaces/common";

type TProps = {
    managerEstablishment: IEstablishment[],
    setManagerEstablishment: Dispatch<SetStateAction<IEstablishment[]>>,
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