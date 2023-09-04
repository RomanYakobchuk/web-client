import React, {FC, useContext, useState} from "react";
import {
    Box,
    Button,
} from "@mui/material";
import {useParams} from "react-router-dom";
import {useGetIdentity, useShow, useTranslate} from "@refinedev/core";
import {ErrorComponent} from "@refinedev/mui";
import {
    MessageOutlined,
    NewspaperOutlined,
    ReviewsOutlined,
} from "@mui/icons-material";

import {IGetIdentity, ISubscribe, ProfileProps, PropertyProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import MainEstablishmentInfo from "../../components/establishment/main-establishment-info";
import InstitutionNews from "../../components/establishment/institution-news";
import {CustomShow} from "../../components";
import InstitutionReviews from "../../components/establishment/institution-reviews";
import {useMobile} from "../../utils";
import InstitutionComments from "../../components/establishment/institution-comments";


const buttons = [
    {
        label: 'reviews',
        icon: <ReviewsOutlined/>,
    },
    {
        label: 'news',
        icon: <NewspaperOutlined/>,
    },
    {
        label: 'comments',
        icon: <MessageOutlined/>,
    },
]

const EstablishmentDetails: FC = () => {
    const {id} = useParams();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {device, width} = useMobile();

    const {queryResult} = useShow<{institution: PropertyProps, subscribe: ISubscribe }>({
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

    const [dataForBody, setDataForBody] = useState("news");

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
                <MainEstablishmentInfo
                    rowHeight={device && width < 600 ? 120 : 200}
                    subscribe={subscribe}
                    establishment={institution}/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'start',
                    justifyContent: 'start',
                    width: '100%',
                    flex: {xs: 1, lg: 3},
                    mb: {xs: '85px', md: 0},
                    bgcolor: mode === "dark" ? "#2e424d" : "#fcfcfc",
                    borderRadius: '15px',
                    p: '10px',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        {/*<Typography sx={{*/}
                        {/*    color: 'common.white'*/}
                        {/*}}>*/}
                        {/*    {translate(`home.show.${dataForBody}.title`)}*/}
                        {/*</Typography>*/}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            alignItems: 'center',
                            gap: 2.5,
                            width: '100%',
                            maxWidth: '550px',
                        }}>
                            {
                                buttons.map(({label, icon}) => (
                                    <Button
                                        key={label}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            transition: '300ms linear',
                                            '&:hover': {
                                                color: 'white',
                                                bgcolor: '#c01624',
                                            },
                                            bgcolor: dataForBody === label ? '#c01624' : '#b2adad',
                                            p: '5px',
                                            borderRadius: '20px',
                                            textTransform: 'capitalize',
                                            boxSizing: 'content-box',
                                            color:
                                                dataForBody === label
                                                    ? 'white'
                                                    : '#000',
                                        }}
                                        onClick={() => setDataForBody(label)}
                                        // endIcon={icon}
                                    >
                                        {translate(`home.show.${label}.title`)}
                                    </Button>
                                ))
                            }
                        </Box>
                    </Box>
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        height: 'fit-content'
                    }}>
                        {
                            dataForBody === "reviews" ?
                                <InstitutionReviews id={institution?._id}/>
                                : dataForBody === 'news' ?
                                    <InstitutionNews institution={institution}/> :
                                    <InstitutionComments institutionId={institution?._id}/>
                        }
                    </Box>
                </Box>
                {/*}*/}
            </Box>
        </CustomShow>
    );
};
export default EstablishmentDetails;