import {createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useState} from "react";

type ModalItem = {
    name: string,
    link: string,
    variant: "outlined" | "contained" | "text",
    color: "info" | "success" | "error" | "warning" | "primary" | "secondary"
}
export type ModalContextType = {
    modalCaplContext: ModalItem[],
    setModalCaplContext: Dispatch<SetStateAction<ModalContextType['modalCaplContext']>>,
    updateModalCaplContext: (items: ModalContextType['modalCaplContext']) => void
}
export const ModalContext = createContext<ModalContextType>(
    {} as ModalContextType
);

export const ModalCaplContextProvider: FC<PropsWithChildren> = ({children}) => {

    const items = JSON.parse(localStorage.getItem('modal_list') as string);

    const [modalCaplContext, setModalCaplContext] = useState<ModalContextType['modalCaplContext']>(items || [] as ModalContextType['modalCaplContext']);

    useEffect(() => {
        window.localStorage.setItem('modal_list', JSON.stringify(modalCaplContext))
    }, [modalCaplContext]);

    const updateModalCaplContext = (newContent: ModalContextType['modalCaplContext']) => {
        setModalCaplContext(newContent)
    }

    return (
        <ModalContext.Provider
            value={{
                modalCaplContext,
                updateModalCaplContext,
                setModalCaplContext
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
