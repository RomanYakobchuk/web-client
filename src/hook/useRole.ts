import {useEffect, useState} from "react";
import {parseJwt} from "@/utils";
import {ProfileProps, PropertyProps} from "@/interfaces/common";

export const useRole = () => {
    const [role, setRole] = useState<"admin" | "manager" | 'user' | string>("");
    const [user, setUser] = useState<ProfileProps>({} as ProfileProps);
    // const [establishment, setestablishment] = useState<PropertyProps[]>([]);
    // useEffect(() => {
    //     if (user?._id && user?.status === 'manager') {
    //         const x = async () => {
    //             const data = await axiosInstance.get(`/establishment/userestablishments`);
    //             if (data?.data) {
    //                 setestablishment(data?.data)
    //             }
    //         }
    //         x().catch((reason) => console.log(reason));
    //     } else {
    //         setestablishment([]);
    //     }
    // }, [user])
    const data: ProfileProps | any = localStorage.getItem("user")
    useEffect(() => {
        if (!role) {
            if (data) {
                const res = parseJwt(data);
                if (res?._doc?.status) {
                    setRole(res?._doc?.status)
                    setUser(res?._doc)
                } else if (res?.status) {
                    setRole(res?.status)
                    setUser(res)
                } else {
                    setRole("user")
                }
            } else {
                setRole('')
            }
        }
    }, [data])

    if (role) {
        return {
            role,
            userId: user?._id,
            // establishment: establishment
        }
    } else if (!data) {
        return {
            role: '',
            userId: '',
            // establishment: []
        }
    } else {
        return {
            role: 'notRole',
            userId: '',
            // establishment: []
        }
    }
}

