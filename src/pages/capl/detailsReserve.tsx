import {useNavigate, useParams} from "react-router-dom";
import {useDelete, useShow, useTranslate} from "@refinedev/core";
import {
    Box,
    Button,
    CardContent,
    CardHeader,
    Grid, Tooltip, IconButton, Divider,
} from "@mui/material";
import dayjs from "dayjs";
import {Check, Close, Delete, EastOutlined, Place, RateReview} from "@mui/icons-material";
import {Image, Typography} from "antd";
import React, {ReactNode, useContext, useState} from "react";

import {IReserve} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {CustomShow} from "@/components";
import "@/components/capl/reserve_style.css";
import {useMobile, useUserInfo} from "@/hook";
import RenderTag from "@/components/common/statusTagRender";
import {ShowTimeComponent} from "@/components/time";
import LoadingCaplDetails from "@/components/capl/whileLoading/loadingCaplDetails";
import {ESTABLISHMENT} from "@/config/names";

const {Title, Text} = Typography;

interface GridItem {
    value: string | ReactNode,
    title: string,
    field?: string
}


const DetailsReserve = () => {
    const {id} = useParams();
    const {user} = useUserInfo();
    const navigate = useNavigate();
    const {width, device} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const {queryResult} = useShow<IReserve>({
        resource: 'capl/findOne',
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    });
    const {data, isLoading, isError} = queryResult;

    const reserve = data?.data as IReserve;

    const isRejectedTextByRejected = reserve?.establishmentStatus?.value === 'rejected' && reserve?.establishmentStatus?.reasonRefusal && reserve?.establishmentStatus?.reasonRefusal?.length > 5;
    const isFreeDateByRejected = reserve?.establishmentStatus?.value === 'rejected' && reserve?.establishmentStatus?.freeDateFor && reserve?.establishmentStatus?.freeDateFor?.length > 0;

    const items: GridItem[] = [
        {
            value: reserve?.fullName,
            title: translate('capl.create.fullName')
        },
        {
            // value: dayjs(reserve?.date).format('DD/MM/YYYY HH:mm') + ' ' + dayjs(reserve?.date)?.fromNow(),
            value: <ShowTimeComponent
                date={reserve?.date as Date}
                style={{
                    alignItems: 'start',
                    fontSize: {xs: '15px', sm: '17px', lg: '19px'}
                }}
                isFirstAgo={false}/>,
            title: translate('capl.create.date')
        },
        {
            value: reserve?.desiredAmount,
            title: translate('capl.create.desiredAmount')
        },
        {
            value: reserve?.numberPeople,
            title: translate('capl.create.numberPeople')
        },
        {
            value: reserve?.whoPay,
            title: translate('capl.create.whoPay')
        },
        {
            value: <span
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px'
                }}
            >
                {
                    translate(`${reserve?.writeMe ? 'text.yes' : 'text.no'}`)
                }
                <IconButton
                    disabled={!reserve?.writeMe}
                    sx={{
                        // m: 'auto'
                    }}
                    color={'inherit'}
                    onClick={() => navigate(`/chats/show/${reserve?.user}/${reserve?.establishment?._id}`)}
                >
                    <RateReview/>
                </IconButton>
            </span>,
            title: translate('capl.create.writeMe')
        },
        {
            value: <RenderTag value={reserve?.userStatus?.value}/>,
            title: translate('capl.status.userStatus')
        },
        {
            value: <Box
                className={'establishmentRejected'}
            >
                <RenderTag value={reserve?.establishmentStatus?.value}/>
                {
                    (isFreeDateByRejected || isRejectedTextByRejected) && (
                        <Box
                            sx={{
                                my: '5px'
                            }}
                            className={'establishmentRejected'}
                        >
                            {
                                isRejectedTextByRejected && (
                                    <div
                                        className={'establishmentRejected'}
                                    >
                                        {reserve?.establishmentStatus?.reasonRefusal}
                                    </div>
                                )
                            }
                            {
                                isFreeDateByRejected && (
                                    <div
                                        className={'establishmentRejected'}
                                    >
                                        {
                                            reserve?.establishmentStatus?.freeDateFor?.map((value, index) => (
                                                <div
                                                    className={'establishmentRejected'}
                                                    key={index}>
                                                    <ShowTimeComponent

                                                        style={{
                                                            fontSize: '14px',
                                                            p: '0 !important'
                                                        }}
                                                        date={value as Date} isFirstAgo={false}/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </Box>
                    )
                }
            </Box>,
            title: translate('capl.status.establishmentStatus')
        },
        {
            value: reserve?.eventType,
            title: translate('capl.create.eventType')
        },
        {
            value: reserve?.comment,
            title: translate('capl.create.comment'),
            field: 'comment'
        },
    ];

    const gridItemWidth = `calc(${(width < 500 || (width >= 900 && width < 1100)) ? '100% / 2 - 8px' : (width < 900 || (width > 1100 && width <= 1300)) ? 'calc(100% / 3)' : 'calc(100% / 5)'})`

    if (isError) return <div>Error</div>
    return (
        <CustomShow
            isLoading={false}
            bgColor={'transparent'}
            maxWidth={'800px'}
            isShowButtons={user?._id === reserve?.user || user?._id === reserve?.manager || user?.status === 'admin'}
        >
            {
                isLoading
                    ? <LoadingCaplDetails/>
                    : <>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'end'
                            }}>
                                <Box sx={{
                                    p: '8px 16px',
                                    bgcolor: reserve?.isActive ? '#00be65' : '#ff6464',
                                    color: '#010101',
                                    borderRadius: '10px',
                                    fontSize: {xs: '16px', sm: '18px'},
                                    width: 'fit-content'
                                }}>
                                    {translate(`capl.status.valid.${reserve?.isActive ? 'active' : 'inactive'}`)}
                                </Box>
                            </div>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // borderRadius: '10px',
                                    // bgcolor: 'modern.modern_1.second',
                                    gap: 1,
                                    // display: 'grid',
                                    // gridTemplateColumns: `repeat(auto-fit, minmax(${gridItemWidth}, 1fr))`,
                                    // width: '100%',
                                    // gridAutoRows: 'minmax(80px, max-content)',
                                    "& *": {
                                        color: 'common.white'
                                    }
                                }}
                            >
                                {
                                    items.map((item, index) => (
                                            <Box
                                                key={index + 1}
                                                sx={{
                                                    width: '100%',
                                                    display: 'grid',
                                                    gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: '1fr 3fr'},
                                                    // "&:not(:last-child)": {
                                                    //     borderBottom: '1px solid silver',
                                                    // },
                                                    // display: 'flex',
                                                    // flexDirection: {xs: 'row', sm: 'column'},
                                                    gap: 0.5,
                                                    p: 2,
                                                    alignItems: {xs: 'center', sm: 'start'},
                                                    borderRadius: '10px',
                                                    // borderRadius: index === 0 ? '10px 10px 0px 0px' : (index === items?.length - 1 ? '0px 0px 10px 10px' : 0),
                                                    bgcolor: index % 2 === 0 ? 'modern.modern_1.main' : 'modern.modern_1.second',
                                                    transition: 'all 0.2s linear',
                                                    "&:hover": {
                                                        transform: device ? 'unset' : 'scale(1.1)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    fontSize: {xs: '13px', sm: '15px', lg: '17px'}
                                                }}>
                                                    {item?.title}:
                                                </Box>
                                                <Box
                                                    sx={{
                                                        ml: {xs: 2, sm: 0},
                                                        fontSize: {xs: '15px', sm: '17px', lg: '19px'},
                                                        fontWeight: 600,
                                                        "& *": {
                                                            fontSize: {xs: '15px', sm: '17px', lg: '19px'},
                                                            fontWeight: 600
                                                        }
                                                    }}>
                                                    {item?.value ? item?.value : <span style={{
                                                        fontWeight: 400,
                                                        fontSize: '15px',
                                                        color: 'silver'
                                                    }}>{translate('text.nothing')}</span>}
                                                </Box>
                                            </Box>
                                            // <Box
                                            //     key={index + 1}
                                            //     // onClick={() => handleClick(index)}
                                            //     sx={{
                                            //         width: '100%',
                                            //         gridColumn: (item?.field === 'comment' && typeof item?.value === 'string' && item?.value?.length > 10) ? 'span 2' : 'span 1',
                                            //         gridRow: (item?.field === 'comment' && typeof item?.value === 'string' && item?.value?.length > 10) ? 'span 2' : 'span 1',
                                            //         height: 'auto',
                                            //         bgcolor: mode === 'dark' ? "#252525" : '#016AB9',
                                            //         borderRadius: '15px',
                                            //         // p: 2,
                                            //         display: 'flex',
                                            //         flexDirection: 'column',
                                            //         gap: 1,
                                            //         justifyContent: 'start',
                                            //         alignItems: 'start',
                                            //         "& div:not(.establishmentRejected)": {
                                            //             p: '8px 16px'
                                            //         }
                                            //     }}
                                            // >
                                            //     <Box sx={{
                                            //         fontSize: {xs: '14px', sm: '16px'},
                                            //         fontWeight: 400,
                                            //         height: {xs: '45px', sm: '35px'},
                                            //         display: 'flex',
                                            //         alignItems: 'center'
                                            //     }}>
                                            //         {item?.title}
                                            //     </Box>
                                            //     <Divider sx={{
                                            //         bgcolor: 'silver',
                                            //         width: '100%'
                                            //     }}/>
                                            //     <Box sx={{
                                            //         fontSize: {xs: '15px', sm: '17px'},
                                            //         fontWeight: 600,
                                            //         height: 'fit-content',
                                            //         whiteSpace: typeof item?.value === 'string' ? 'break-space' : 'unset'
                                            //     }}>
                                            //         {item?.value ? item?.value : <span style={{
                                            //             fontWeight: 400,
                                            //             fontSize: '15px',
                                            //             color: 'silver'
                                            //         }}>{translate('text.nothing')}</span>}
                                            //     </Box>
                                            // </Box>
                                        )
                                    )
                                }
                            </Box>
                        </Box>
                        <Grid
                            sx={{
                                "& *, & *.ant-typography": {
                                    color: 'common.white'
                                },
                                mt: 4,
                                maxWidth: '500px'
                            }}
                            container spacing={2}>
                            <Grid sx={{width: '100%'}} item xs={12} p={4}>
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}>
                                    <CardHeader
                                        title={translate('home.one')}/>
                                    <Button
                                        sx={{
                                            fontSize: {xs: '14px', sm: '16px'},
                                            width: 'fit-content',
                                            textTransform: 'inherit'
                                        }}
                                        onClick={() => navigate(`/${ESTABLISHMENT}/show/${reserve?.establishment?._id}`)}
                                        color={"secondary"}
                                        endIcon={<EastOutlined/>}
                                        variant={"outlined"}>
                                        {translate("buttons.details")}
                                    </Button>
                                </Box>
                                <CardContent sx={{
                                    width: '100%',
                                    p: '16px 0 16px 16px',
                                    "& div.ant-image": {
                                        width: '100%'
                                    }
                                }}>
                                    <Image
                                        width={'100%'}
                                        src={reserve?.establishment?.pictures[0].url}
                                        alt={reserve?.establishment?.title}
                                        style={{
                                            width: '100%',
                                            // maxWidth: '400px',
                                            height: '250px',
                                            borderRadius: '10px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <Title level={4}>{reserve?.establishment?.title}</Title>
                                    <Text>{translate(`home.sortByType.${reserve?.establishment?.type}`)}</Text>
                                    {
                                        reserve?.establishment?.place?.city && (
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 1,
                                                my: 0.5
                                            }}>
                                                <Place/>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                        <span>
                                            {reserve?.establishment?.place?.city}
                                        </span>
                                                    <span>
                                            {reserve?.establishment?.place?.address}
                                        </span>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                </CardContent>
                            </Grid>
                        </Grid>
                    </>
            }
        </CustomShow>
    );
};

interface IDelete {
    resource: string,
    id: string,
    value?: string
}

const DeleteButton = ({resource, id, value}: IDelete) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const {mutate} = useDelete();
    const [openDelete, setOpenDelete] = useState(false);
    const deleteestablishment = async (id: string) => {
        mutate(
            {
                resource,
                id: id as string,
                errorNotification: (data: any) => {
                    return {
                        type: 'error',
                        message: data?.response?.data?.error
                    }
                },
                successNotification: (data: any) => {
                    return {
                        type: "success",
                        message: data?.data?.message
                    }
                }
            }
        )
        setOpenDelete(false);
    }

    return (
        <Box sx={{
            position: 'relative',
        }}>
            <Tooltip
                title={translate('actions.delete')}
                arrow
                placement={'top'}
            >
                <IconButton
                    color={'error'}
                    onClick={() => setOpenDelete(true)}
                >
                    <Delete/>
                </IconButton>
            </Tooltip>
            {
                openDelete && <Box
                    sx={{
                        position: 'fixed',
                        zIndex: 1000,
                        top: '20%',
                        left: '30%',
                        bgcolor: (theme) => theme.palette.background.default,
                        width: '250px',
                        height: '180px',
                        p: '20px',
                        borderRadius: '10px',
                        display: 'grid',
                        gridTemplateRows: '1fr 1fr',
                        gap: 2
                    }}
                >
                    <Box sx={{
                        whiteSpace: 'break-spaces',
                        fontSize: '18px'
                    }}>
                        {translate('actions.confirmDelete', {"value": value})}
                    </Box>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 1
                        }}
                    >
                        <IconButton
                            color={'error'}
                            onClick={() => setOpenDelete(false)}
                        >
                            <Close/>
                        </IconButton>
                        <IconButton
                            color={'info'}
                            onClick={() => deleteestablishment(id)}
                        >
                            <Check/>
                        </IconButton>
                    </Box>
                </Box>
            }
        </Box>
    )
}
export default DetailsReserve
