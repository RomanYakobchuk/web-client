import {NotificationPage} from "@/components/notifications/index";
import {useUserInfo} from "@/hook";

const UserPage = () => {
    const {user} = useUserInfo();
    return (
        <div style={{
            // height: '100%',
        }}>
            <NotificationPage userId={user?._id}/>
        </div>
    );
};
export default UserPage
