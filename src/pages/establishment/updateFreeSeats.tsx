import {useParams} from "react-router-dom";
import {CustomEdit} from "../../components";

const UpdateFreeSeats = () => {

    const {id} = useParams();



    return (
       <CustomEdit isLoading={false}>

       </CustomEdit>
    );
};
export default UpdateFreeSeats;
