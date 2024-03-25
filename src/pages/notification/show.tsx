import {useParams} from "react-router-dom";
import {CustomShow} from "@/components";
import {Box} from "@mui/material";
import {NotificationDetails} from "@/components/notifications";

const Show = () => {
    const {id} = useParams();
    return (
        <Box>
            {
                id &&
                <NotificationDetails id={id}/>
            }
        </Box>
    );
};
export default Show
