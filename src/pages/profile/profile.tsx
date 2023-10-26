import {useGetIdentity, useList, useOne} from "@refinedev/core";

import {CustomProfile, Loading} from "../../components";
import {IComment, IGetIdentity, IReviews, ProfileProps, PropertyProps} from "../../interfaces/common";
import {useEffect, useState} from "react";
import {useUserInfo} from "../../hook";


const Profile = () => {
    const {user} = useUserInfo();

    const [favoritePlaces, setFavoritePlaces] = useState<PropertyProps[]>([] as PropertyProps[]);


    const {data} = useList<PropertyProps>({
        resource: 'users/getUserFavPlaces'
    });

    useEffect(() => {
        if (data?.data as PropertyProps[]) {
            setFavoritePlaces(data?.data as PropertyProps[])
        }
    }, [data?.data]);

    return (
        <CustomProfile
            status={user?.status}
            dOB={user?.dOB}
            _id={user?._id}
            phone={user?.phone}
            name={user?.name}
            email={user?.email}
            avatar={user?.avatar}
            isActivated={user?.isActivated}
            phoneVerify={user?.phoneVerify}
            favoritePlaces={favoritePlaces}
        />
    );
};

export default Profile;