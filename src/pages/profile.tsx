import {useGetIdentity, useOne} from "@refinedev/core";

import {CustomProfile, Loading} from "../components";
import {IComment, IReviews, ProfileProps, PropertyProps} from "../interfaces/common";


const Profile = () => {
    const {data: user} = useGetIdentity<ProfileProps>();

    const {data, isLoading, isError} = useOne({
        resource: 'users/userInfo',
        id: user?._id
    });

    const myProfile: ProfileProps | any = data?.data ?? [];
    const {data: data_user_comments, isError: isError_user_comments, isLoading: isLoading_user_comments} = useOne({
        resource: 'comment/allByUserId',
        id: myProfile?._id as string
    });
    const {data: data_user_reviews, isError: isError_user_reviews, isLoading: isLoading_user_reviews} = useOne({
        resource: 'review/allByUserId',
        id: myProfile?._id as string
    });
    const {data: data_user_institutions, isError: isError_user_institutions, isLoading: isLoading_user_institutions} = useOne({
        resource: 'institution/allByUserId',
        id: myProfile?._id as string
    });
    const user_reviews: IReviews[] = data_user_reviews?.data?.user_reviews ?? [];
    const user_comments: IComment[] = data_user_comments?.data?.user_comments ?? [];
    const user_institutions: PropertyProps[] = data_user_institutions?.data?.user_institutions ?? [];

    if (isLoading) return <Loading/>;
    if (isError) return <div>error...</div>;

    return (
        <CustomProfile
            status={myProfile?.status}
            dOB={myProfile?.dOB}
            _id={myProfile?._id}
            phone={myProfile?.phone}
            name={myProfile.name}
            user_comments={user_comments}
            email={myProfile.email}
            avatar={myProfile.avatar}
            allInstitutions={myProfile.allInstitutions}
            isActivated={myProfile.isActivated}
            phoneVerify={myProfile.phoneVerify}
            favoritePlaces={myProfile.favoritePlaces}
            myReviews={user_reviews}
        />
    );
};

export default Profile;