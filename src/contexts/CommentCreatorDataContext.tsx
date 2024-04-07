import {createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useState} from "react";

import {useUserInfo} from "@/hook";
import {usePermissions} from "@refinedev/core";
import {IEstablishment} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {localKeyEstablishment, localKeyLeaveCommentAs} from "@/config/const";
import {ESTABLISHMENT} from "@/config/names";

export type TSelectOption = {
    _id: string,
    picture: string,
    title: string,
    type: string
}
export type TPropsCommentCreatorContext = {
    selectedInfo: TSelectOption,
    setSelectedInfo: (value: TSelectOption) => void,
    managerRole: "user" | "establishment",
    setManagerRole: (value: TPropsCommentCreatorContext['managerRole']) => void,
    managerEstablishment: IEstablishment[],
    setManagerEstablishment: Dispatch<SetStateAction<IEstablishment[]>>,
    getData: () => void,
    isLoading: boolean
}
type TLocalData = {
    selectedInfo: TSelectOption,
    managerRole: TPropsCommentCreatorContext['managerRole']
};
export const CommentCreatorDataContext = createContext<TPropsCommentCreatorContext>({} as TPropsCommentCreatorContext)


export const CommentCreatorDataProvider: FC<PropsWithChildren> = ({children}) => {

    const {user} = useUserInfo();
    const {data} = usePermissions();

    const defaultSelectedData = {
        _id: user?._id,
        picture: user?.avatar,
        title: user?.name,
        type: ''
    } as TSelectOption;

    const localData = localStorage.getItem(localKeyLeaveCommentAs);
    const localManagerEstablishment = localStorage.getItem(localKeyEstablishment);

    const parsedManagerEstablishment = localManagerEstablishment ? JSON.parse(localManagerEstablishment) : [];
    const parseLocalData = localData ? JSON.parse(localData) as TLocalData : {selectedInfo: defaultSelectedData, managerRole: "user"} as TLocalData;

    const [selectedInfo, setSelectedInfo] = useState<TSelectOption>(parseLocalData?.selectedInfo);
    const [managerRole, setManagerRole] = useState<TPropsCommentCreatorContext['managerRole']>(parseLocalData?.managerRole);
    const [managerEstablishment, setManagerEstablishment] = useState<IEstablishment[]>(parsedManagerEstablishment);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const getManagerEstablishment = async () => {
        setIsLoading(true);
        const {data} = await axiosInstance.get(`/${ESTABLISHMENT}/userestablishments?_end=${page * pageSize}&_start=${(page - 1) * pageSize}`);
        if (data?.length > 0) {
            setManagerEstablishment(data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (managerEstablishment?.length > 0 && data === 'manager') {
            window.localStorage.setItem(localKeyEstablishment, JSON.stringify(managerEstablishment));
        } else {
            window.localStorage.removeItem(localKeyEstablishment)
        }
    }, [managerEstablishment?.length]);

    useEffect(() => {
        if (data === 'manager' && managerRole && selectedInfo?._id) {
            window.localStorage.setItem(localKeyLeaveCommentAs, JSON.stringify({
                managerRole: managerRole,
                selectedInfo: selectedInfo
            } as TLocalData))
        } else {
            window.localStorage.setItem(localKeyLeaveCommentAs, JSON.stringify({
                managerRole: "user",
                selectedInfo: defaultSelectedData
            } as TLocalData))
        }
    }, [selectedInfo, managerRole, data]);

    const getData = async () => {
        if (data === 'manager' && (managerEstablishment?.length <= 0 || !localManagerEstablishment)) {
            await getManagerEstablishment()
        }
    }

    return (
        <CommentCreatorDataContext.Provider
            value={{
                setManagerRole,
                managerRole,
                setSelectedInfo,
                selectedInfo,
                getData,
                isLoading,
                managerEstablishment,
                setManagerEstablishment
            }}
        >
            {children}
        </CommentCreatorDataContext.Provider>
    )
}
