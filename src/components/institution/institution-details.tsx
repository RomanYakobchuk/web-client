import React, {useContext, useState} from "react";
import {
    Box,
    Button,
    IconButton,
    Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useGetIdentity, useOne, useTranslate} from "@refinedev/core";
import {ErrorComponent} from "@refinedev/mui";
import {
    Add,
    Edit,
    MessageOutlined,
    NewspaperOutlined,
    ReviewsOutlined,
    WineBarOutlined
} from "@mui/icons-material";

import {ProfileProps, PropertyProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import DetailsInfo from "./utills/details-info";
import InstitutionNews from "./utills/institution-news";
import Loading from "../loading";
import {CustomDrawer} from "../index";
import InstitutionReviews from "./utills/institution-reviews";
import {useMobile} from "../../utils";
import InstitutionComments from "./utills/institution-comments";


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

const InstitutionDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data: user} = useGetIdentity<ProfileProps>();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {device, width} = useMobile();

    const {data, isLoading, isError} = useOne<PropertyProps | any>({
        resource: 'institution/allInfoById',
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    });

    const institution: PropertyProps = data?.data ?? [];

    const [openDrawer, setOpenDrawer] = useState(false);
    const [dataForDrawer, setDataForDrawer] = useState("reviews");
    const [dataForBody, setDataForBody] = useState("news");

    if (isLoading) return <Loading/>
    if (isError) return <ErrorComponent/>

    return (
        <Box sx={{
            mb: "30px"
        }}>
            <Box sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Typography sx={{
                    fontSize: {xs: '16px', sm: '24px'}
                }} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                    {translate('home.show.title')}
                </Typography>
                {
                    (institution?.createdBy === user?._id) || user?.status === 'admin'
                        ? <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            {
                                device || width < 600
                                    ? <IconButton
                                        size={"large"}
                                        onClick={() => navigate(`/all_institutions/edit/${institution?._id}`)}
                                    >
                                        <Edit fontSize="inherit"/>
                                    </IconButton>
                                    : <Button
                                        variant={"contained"}
                                        startIcon={<Edit sx={{
                                            fontSize: {xs: '18px', sm: '24px'},
                                        }}/>}
                                        onClick={() => navigate(`/all_institutions/edit/${institution?._id}`)}
                                        sx={{
                                            bgcolor: 'blue',
                                        }}
                                    >
                                        {translate('profile.edit.title')}
                                    </Button>
                            }
                            {
                                device || width < 600
                                    ? <IconButton
                                        size={"large"}
                                        onClick={() => navigate(`/news/create?institution_id=${institution._id}`)}
                                    >
                                        <Add fontSize="inherit"/>
                                    </IconButton>
                                    : <Button
                                        onClick={() => navigate(`/news/create?institution_id=${institution._id}`)}
                                        startIcon={<Add/>}
                                        sx={{
                                            bgcolor: '#cfcfcf',
                                            color: '#242539'
                                        }}
                                    >
                                        {translate("home.createNews.title")}
                                    </Button>
                            }
                        </Box>
                        : <Button
                            startIcon={<WineBarOutlined sx={{
                                fontSize: {xs: '18px', sm: '24px'},
                            }}/>}
                            sx={{
                                color: '#fcfcfc',
                                bgcolor: 'blue',
                                p: "10px 15px"
                            }}
                            onClick={() => navigate(`/capl/create?institution=${institution?._id}`)}
                        >
                            Capl
                        </Button>
                }
            </Box>
            <Box sx={{
                display: 'flex',
                width: '100%',
                flexDirection: {xs: "column"},
                justifyContent: {xs: 'center'},
                '@media (min-width: 1260px)': {
                    flexDirection: 'row',
                    justifyContent: 'start'
                },
                gap: 2,
                alignItems: 'start',
                mt: '10px'
            }}>
                <DetailsInfo otherProps={{setDataForDrawer, setOpenDrawer}}
                             rowHeight={device && width < 600 ? 120 : 200}
                             institution={institution}/>
                {
                    device && width < 900
                        ? <CustomDrawer
                            anchor={"bottom"}
                            open={openDrawer}
                            toggleDrawer={setOpenDrawer}
                            title={translate(`home.show.${dataForDrawer}.title`)}
                            button={
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    {
                                        buttons.map(({label, icon}) => (
                                            <IconButton
                                                key={label}
                                                sx={{
                                                    fontSize: '30px',
                                                    transition: '300ms linear',
                                                    p: '5px',
                                                    borderRadius: '5px',
                                                    boxSizing: 'content-box',
                                                    color:
                                                        dataForDrawer === label
                                                            ? 'blue'
                                                            : mode === 'dark'
                                                                ? '#fcfcfc'
                                                                : '#314d63',
                                                    bgcolor: dataForDrawer === label ? 'silver' : 'transparent',
                                                }}
                                                onClick={() => setDataForDrawer(label)}
                                            >
                                                {icon}
                                            </IconButton>
                                        ))
                                    }
                                </Box>
                            }>
                            {openDrawer ?
                                dataForDrawer === "reviews" ?
                                    <InstitutionReviews id={institution?._id}/>
                                    : dataForDrawer === 'news' ?
                                        <InstitutionNews institution={institution}/> :
                                        <InstitutionComments institutionId={institution?._id}/>
                                : ''
                            }
                        </CustomDrawer>
                        : <Box sx={{
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
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <Typography>
                                    {translate(`home.show.${dataForBody}.title`)}
                                </Typography>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}>
                                    {
                                        buttons.map(({label, icon}) => (
                                            <IconButton
                                                key={label}
                                                sx={{
                                                    fontSize: '30px',
                                                    cursor: 'pointer',
                                                    transition: '300ms linear',
                                                    '&:hover': {
                                                        color: 'blue',
                                                        bgcolor: 'silver',
                                                    },
                                                    bgcolor: dataForBody === label ? 'silver' : 'transparent',
                                                    p: '5px',
                                                    borderRadius: '5px',
                                                    boxSizing: 'content-box',
                                                    color:
                                                        dataForBody === label
                                                            ? 'blue'
                                                            : mode === 'dark'
                                                                ? '#fcfcfc'
                                                                : '#314d63',
                                                }}
                                                onClick={() => setDataForBody(label)}
                                            >
                                                {icon}
                                            </IconButton>
                                        ))
                                    }
                                </Box>
                            </Box>
                            <Box sx={{
                                position: 'relative',
                                width: '100%',

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
                }
            </Box>
        </Box>
    );
};

export default InstitutionDetails