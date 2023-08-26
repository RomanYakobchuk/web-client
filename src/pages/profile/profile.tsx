import {useGetIdentity, useList, useOne} from "@refinedev/core";

import {CustomProfile, Loading} from "../../components";
import {IComment, IGetIdentity, IReviews, ProfileProps, PropertyProps} from "../../interfaces/common";
import {useEffect, useState} from "react";


const Profile = () => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;

    const [favoritePlaces, setFavoritePlaces] = useState<PropertyProps[]>([] as PropertyProps[]);

    const myProfile: ProfileProps = user as ProfileProps;

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
            status={myProfile?.status}
            dOB={myProfile?.dOB}
            _id={myProfile?._id}
            phone={myProfile?.phone}
            name={myProfile.name}
            email={myProfile.email}
            avatar={myProfile.avatar}
            isActivated={myProfile.isActivated}
            phoneVerify={myProfile.phoneVerify}
            favoritePlaces={favoritePlaces}
        />
    );
};

export default Profile;