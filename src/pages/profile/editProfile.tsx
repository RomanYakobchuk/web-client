import {useNavigate} from "react-router-dom";
import {useUserInfo} from "../../hook";
import React, {useEffect, useState} from "react";
import ProfileDataForm, {INewUserData} from "../../components/profile/utills/profileDataForm";
import {useForm} from "@refinedev/react-hook-form";
import {CustomEdit} from "../../components";

const EditProfile = () => {
    const navigate = useNavigate();
    const {user} = useUserInfo();

    const [userDataInfo, setUserDataInfo] = useState<INewUserData>({} as INewUserData);

    const {
        refineCore: {onFinish, formLoading},
    } = useForm({
        refineCoreProps: {
            resource: `users/userInfo`,
            action: 'edit',
            id: user?._id as string,
            successNotification: (data: any) => {
                return {
                    type: "success",
                    message: data?.data?.message
                }
            }
        },
    },);

    useEffect(() => {
        if (user) {
            setUserDataInfo({
                avatar: user?.avatar,
                changeAva: undefined,
                currentId: user?._id,
                dOB: user?.dOB ? user?.dOB : '',
                name: user?.name,
                phone: user?.phone
            })
        }
    }, [user])


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
        setTimeout(() => {
            navigate(`/profile`)
        }, 500)
    }

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
export default EditProfile
