import React, {useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate, useParams} from "react-router-dom";

import {CustomEdit} from "../../components";
import {ProfileProps} from "../../interfaces/common";
import ProfileDataForm, { INewUserData } from "../../components/profile/utills/profileDataForm";
import {useUserInfo} from "../../hook";

const EditUserInfo = () => {
    const {id: _id} = useParams();
    const navigate = useNavigate();
    const {user} = useUserInfo();

    const [userDataInfo, setUserDataInfo] = useState<INewUserData>({} as INewUserData);

    useEffect(() => {
        if (user?.status !== 'admin' && _id !== user?._id) {
            navigate('/profile')
        }
    }, [user?._id, user?.status, _id])

    const {
        refineCore: {onFinish, formLoading, queryResult},
    } = useForm({
        refineCoreProps: {
            resource: `users/userInfo`,
            id: _id as string,
            successNotification: (data: any) => {
                return {
                    type: "success",
                    message: data?.data?.message
                }
            }
        },
    },);

    const { isError} = queryResult!;

    useEffect(() => {
        if (queryResult?.data?.data) {
            const getUserData = queryResult?.data?.data as ProfileProps;
            setUserDataInfo({
                avatar: getUserData?.avatar,
                changeAva: undefined,
                currentId: getUserData?._id,
                dOB: getUserData?.dOB ? getUserData?.dOB : new Date()?.toISOString()?.split('T')[0],
                name: getUserData?.name,
                phone: getUserData?.phone
            })
        }
    }, [queryResult?.data?.data])


    const onFinishHandler = async () => {

        // if ((new Date(userNewDOB)?.getFullYear() || new Date(user?.dOB)?.getFullYear()) > (new Date().getFullYear() - 18)) {
        //     return alert(translate("profile.edit.alert"))
        // }
        const formData = new FormData();
        formData.append("avatar", userDataInfo?.avatar as File ?? userDataInfo?.avatar);
        formData.append("changeAva", JSON.stringify(!!userDataInfo?.avatar));
        formData.append("name", userDataInfo?.name);
        formData.append("phone", JSON.stringify(userDataInfo?.phone));
        formData.append("dOB", JSON.stringify(userDataInfo?.dOB));
        formData.append("currentId", userDataInfo?.currentId);

        const {data}: any = await onFinish(formData);
        if (_id === user?._id) {
            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data?.user)
                );
            } else if (data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );
            }
        }
        navigate(`/profile`)
    }

    if (isError) return <div>Error</div>


    return (
        <CustomEdit
            isLoading={formLoading}
            bgColor={'transparent'}
            style={{
                maxWidth: '700px',
                margin: '0 auto'
            }}
            onClick={onFinishHandler}
        >
           <ProfileDataForm
               userInfo={userDataInfo}
               setUserInfo={setUserDataInfo}
           />
        </CustomEdit>
    );
};


export default EditUserInfo;