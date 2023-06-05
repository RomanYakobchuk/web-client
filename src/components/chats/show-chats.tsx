import {useParams} from "react-router-dom";

const ShowChats = () => {
    const {userId, institutionId} = useParams();

    console.log("userId: ", userId)
    console.log("institutionId: ", institutionId)
    return (
        <div>
            ShowChats
        </div>
    );
};
export default ShowChats
