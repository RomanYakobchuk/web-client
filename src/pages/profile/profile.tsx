
import {CustomProfile} from "@/components";
import {useUserInfo} from "@/hook";


const Profile = () => {
    const {user} = useUserInfo();

    return (
        <CustomProfile user={user}/>
    );
};

export default Profile;