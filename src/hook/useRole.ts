import {useEffect, useState} from "react";
import {parseJwt} from "../utils";
import {ProfileProps, PropertyProps} from "../interfaces/common";
import {axiosInstance} from "../authProvider";

export const useRole = () => {
    const [role, setRole] = useState<"admin" | "manager" | 'user' | string>("");
    const [user, setUser] = useState<ProfileProps>({} as ProfileProps);
    // const [institution, setInstitution] = useState<PropertyProps[]>([]);
    // useEffect(() => {
    //     if (user?._id && user?.status === 'manager') {
    //         const x = async () => {
    //             const data = await axiosInstance.get(`/institution/userInstitutions`);
    //             if (data?.data) {
    //                 setInstitution(data?.data)
    //             }
    //         }
    //         x().catch((reason) => console.log(reason));
    //     } else {
    //         setInstitution([]);
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
            // institution: institution
        }
    } else if (!data) {
        return {
            role: '',
            userId: '',
            // institution: []
        }
    } else {
        return {
            role: 'notRole',
            userId: '',
            // institution: []
        }
    }
}

