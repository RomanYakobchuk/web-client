import React, {FC} from "react";
import {
    Box,
} from "@mui/material";
import {useParams, Link} from "react-router-dom";
import {CanAccess, useGetIdentity, useShow} from "@refinedev/core";
import {ErrorComponent} from "@refinedev/mui";

import {IGetIdentity, ISubscribe, ProfileProps, PropertyProps} from "../../interfaces/common";
import {CustomShow, NearbyEstablishmentBtn} from "../../components";
import {MainEstablishmentInfo} from "../../components/establishment";
import EstablishmentPropertyTabs from "../../components/establishment/establishmentPropertyTabs";


const EstablishmentDetails: FC = () => {
    const {id} = useParams();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;

    const {queryResult} = useShow<{ institution: PropertyProps, subscribe: ISubscribe }>({
        resource: 'institution/infoById',
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    });
    const {data, isLoading, isError} = queryResult;

    const institution: PropertyProps = data?.data?.institution ?? {} as PropertyProps;
    const subscribe: ISubscribe = data?.data?.subscribe ?? {} as ISubscribe;

    if (isError) return <ErrorComponent/>

    return (
        <CustomShow isLoading={isLoading}
                    bgColor={'transparent'}
                    isShowButtons={user?._id === institution?.createdBy || user?.status === 'admin'}
        >
            <Box sx={{
                display: 'flex',
                width: '100%',
                flexDirection: "column",
                justifyContent: 'center',
                gap: 2,
                alignItems: 'start',
                mt: '10px'
            }}>
                <CanAccess
                    action={'add_free_places'}
                    resource={'all_institutions'}
                >
                    <Link
                        to={'add_free_places'}
                    >
                        add_free_places
                    </Link>
                </CanAccess>
                <MainEstablishmentInfo
                    subscribe={subscribe}
                    establishment={institution}/>
                <NearbyEstablishmentBtn
                    establishment={institution}
                    location={institution.location}
                    style={{
                        width: '100%',
                        mb: 0
                    }}
                />
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    // borderRadius: '10px',
                    // p: '10px',
                    // bgcolor: 'modern.modern_1.main'
                }}>
                    <EstablishmentPropertyTabs institution={institution}/>
                </Box>
            </Box>
        </CustomShow>
    );
};
export default EstablishmentDetails;