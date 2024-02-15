import {Link, useParams} from "react-router-dom";
import {CustomCreate} from "../../components";
import {useForm, useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";
import {ESTABLISHMENT, SHOW} from "@/config/names";

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
                        to={`/${ESTABLISHMENT}`}>{translate(`${ESTABLISHMENT}.${ESTABLISHMENT}`)}</Link>
                },
                {
                    title: <Link
                        style={{
                            color: 'silver'
                        }}
                        to={`/${ESTABLISHMENT}/${SHOW}/${id}`}>{translate('home.one')}</Link>
                },
                {
                    title: translate(`${ESTABLISHMENT}.freeSeats.create`)
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
