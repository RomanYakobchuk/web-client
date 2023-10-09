import {Link, useParams} from "react-router-dom";
import {CustomCreate} from "../../components";
import {useForm, useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";

const AddFreeSeats = () => {
    const {id} = useParams();
    const translate = useTranslate();

    const {onFinish,} = useForm({
        resource: 'establishmentPlaces/create',
        id: id as string,
        action: 'create',
        redirect: false,
    });

    const onFinishHandler = async () => {
        await onFinish({})
    }

    return (
        <CustomCreate
            isLoading={false}
            bgColor={'transparent'}
            onClick={onFinishHandler}
            breadCrumbItems={[
                {
                    title: <Link
                        style={{
                            color: 'silver'
                        }}
                        to={'/all_institutions'}>{translate('all_institutions.all_institutions')}</Link>
                },
                {
                    title: <Link
                        style={{
                            color: 'silver'
                        }}
                        to={`/all_institutions/show/${id}`}>{translate('home.one')}</Link>
                },
                {
                    title: translate('all_institutions.freeSeats.create')
                }
            ]}
        >
            <Box>
                Add free places
            </Box>
        </CustomCreate>
    );
};
export default AddFreeSeats
