import {useParams} from "react-router-dom";

const ShowChats = () => {
    const {userId, establishmentId} = useParams();

    console.log("userId: ", userId)
    console.log("establishmentId: ", establishmentId)
    return (
        <div>
            ShowChats
        </div>
    );
};
export default ShowChats
