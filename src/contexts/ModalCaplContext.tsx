import {createContext, FC, PropsWithChildren, ReactNode, useEffect, useState} from "react";

type ModalContextType = {
    modalCaplContext: ReactNode[],
    updateModalCaplContext: (items: ReactNode[]) => void
}
export const ModalContext = createContext<ModalContextType>(
    {} as ModalContextType
);

export const ModalCaplContextProvider: FC<PropsWithChildren> = ({children}) => {

    const items = JSON.parse(localStorage.getItem('modal_list') as string);

    const [modalCaplContext, setModalCaplContext] = useState<ReactNode[]>(items || []);

    useEffect(() => {
        window.localStorage.setItem('modal_list', JSON.stringify(modalCaplContext))
    }, [items]);

    const updateModalCaplContext = (newContent: ReactNode[]) => {
        setModalCaplContext(newContent)
    }

    return (
        <ModalContext.Provider
            value={{
                modalCaplContext,
                updateModalCaplContext
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
