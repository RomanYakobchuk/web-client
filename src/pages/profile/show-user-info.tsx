import {useOne} from "@refinedev/core";
import {useParams} from "react-router-dom";

import {IComment, IReviews, ProfileProps} from "@/interfaces/common";
import {CustomProfile, CustomShow, Loading} from "@/components";

const ShowUserInfo = () => {

    const {id} = useParams();

    const {data, isLoading, isError} = useOne<ProfileProps>({
        resource: 'users/userInfo',
        id: id as string
    });

    const user: ProfileProps = data?.data ?? {} as ProfileProps;

    if (isError) return <div>error...</div>;

    return (
        <CustomShow
            isLoading={isLoading}
            bgColor={'transparent'}
        >
            <CustomProfile user={user}/>
        </CustomShow>
    );
};
export default ShowUserInfo
