import {useContext} from "react";
import {ModalContext, ModalContextType} from "../contexts/ModalCaplContext";


export const useModalListLayout = (): ModalContextType => {
    const {modalCaplContext, updateModalCaplContext, setModalCaplContext} = useContext(ModalContext);

    return {
        setModalCaplContext,
        modalCaplContext,
        updateModalCaplContext
    }
}