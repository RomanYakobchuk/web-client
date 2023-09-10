import {useOne} from "@refinedev/core";
import {IComment, IReviews, ProfileProps} from "../../interfaces/common";
import {CustomProfile, CustomShow, Loading} from "../../components";
import {useParams} from "react-router-dom";

const ShowUserInfo = () => {

    const {id} = useParams();

    const {data, isLoading, isError} = useOne({
        resource: 'users/userInfo',
        id: id as string
    });

    const myProfile: ProfileProps | any = data?.data ?? [];

    const {data: data_user_comments, isError: isError_user_comments, isLoading: isLoading_user_comments} = useOne({
        resource: 'comment/allByUserId',
        id: myProfile?._id as string
    })
    const {data: data_user_reviews, isError: isError_user_reviews, isLoading: isLoading_user_reviews} = useOne({
        resource: 'review/allByUserId',
        id: myProfile?._id as string
    })
    const user_reviews: IReviews[] = data_user_reviews?.data?.user_reviews ?? [];
    const user_comments: IComment[] = data_user_comments?.data?.user_comments ?? [];

    if (isLoading) return <Loading/>;
    if (isError) return <div>error...</div>;

    return (
        <CustomShow
            isLoading={isLoading}
            bgColor={'transparent'}
        >
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
        </CustomShow>
    );
};
export default ShowUserInfo
