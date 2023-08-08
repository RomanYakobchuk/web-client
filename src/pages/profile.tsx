import {useGetIdentity, useOne} from "@refinedev/core";

import {CustomProfile, Loading} from "../components";
import {IComment, IReviews, ProfileProps, PropertyProps} from "../interfaces/common";


const Profile = () => {
    const {data: user} = useGetIdentity<ProfileProps>();

    // const {data, isLoading, isError} = useOne({
    //     resource: 'users/userInfo',
    //     id: user?._id
    // });

    const myProfile: ProfileProps = user as ProfileProps;

    // if (isLoading) return <Loading/>;
    // if (isError) return <div>error...</div>;

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
            favoritePlaces={myProfile.favoritePlaces}
        />
    );
};

export default Profile;