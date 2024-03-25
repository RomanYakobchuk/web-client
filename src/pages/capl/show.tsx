import {useNavigate, useParams} from "react-router-dom";
import {useDelete, useShow, useTranslate} from "@refinedev/core";
import {
    Box, Tooltip, IconButton,
} from "@mui/material";
import {
    AttachMoney, Chat,
    Check,
    Close, Comment,
    DateRange,
    Delete, Event, Info,
    People,
    Person,
    RateReview,
    TextSnippet
} from "@mui/icons-material";
import React, {ReactNode, useContext, useState} from "react";

import {IReserve} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {CustomShow} from "@/components";
import "@/components/capl/reserve_style.css";
import {useMobile, useUserInfo} from "@/hook";
import RenderTag from "@/components/common/statusTagRender";
import {ShowTimeComponent} from "@/components/time";
import LoadingCaplDetails from "@/components/capl/whileLoading/loadingCaplDetails";
import {CaplEstablishmentInfo} from "@/components/capl/details/caplEstablishmentInfo";
import {GoogleMapRouteBtn} from "@/components/google/googleMapRouteBtn";

interface GridItem {
    value: string | ReactNode,
    title: string,
    field?: string,
    icon?: ReactNode
}


const Show = () => {
    const {id} = useParams();
    const {user} = useUserInfo();
    const navigate = useNavigate();
    const {width} = useMobile();
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
            title: translate('capl.create.fullName'),
            icon: <TextSnippet/>
        },
        {
            value: <ShowTimeComponent
                date={reserve?.date as Date}
                style={{
                    alignItems: 'start',
                    fontSize: {xs: '15px', sm: '17px', lg: '19px'}
                }}
                isFirstAgo={false}/>,
            title: translate('capl.create.date'),
            icon: <DateRange/>
        },
        {
            value: reserve?.desiredAmount,
            title: translate('capl.create.desiredAmount'),
            icon: <AttachMoney/>
        },
        {
            value: reserve?.numberPeople,
            title: translate('capl.create.numberPeople'),
            icon: <People/>
        },
        {
            value: reserve?.whoPay,
            title: translate('capl.create.whoPay'),
            icon: <Person/>
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
            title: translate('capl.create.writeMe'),
            icon: <Chat/>
        },
        {
            value: <RenderTag value={reserve?.userStatus?.value}/>,
            title: translate('capl.status.userStatus.title'),
            icon: <Info/>
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
            title: translate('capl.status.establishmentStatus.title'),
            icon: <Info/>
        },
        {
            value: reserve?.eventType,
            title: translate('capl.create.eventType'),
            icon: <Event/>
        },
        {
            value: reserve?.comment,
            title: translate('capl.create.comment'),
            field: 'comment',
            icon: <Comment/>
        },
    ];

    return (
        <CustomShow
            isLoading={false}
            bgColor={'transparent'}
            maxWidth={width < 1536 ? '900px' : '1400px'}
            editButtonVariant={'text'}
            isShowButtons={user?._id === reserve?.user || user?._id === reserve?.manager || user?.status === 'admin'}
        >
            {
                isLoading
                    ? <LoadingCaplDetails/>
                    : isError ? <div>Error</div>
                        : <Box
                            sx={{
                                display: 'grid',
                                transition: '200ms linear',
                                gridTemplateColumns: {xs: '1fr', xl: 'repeat(2, 1fr)'},
                                gap: 2,
                            }}
                        >
                            <Box sx={{
                                width: '100%',
                                order: {xs: 1, xl: 2},
                                display: 'flex',
                                flexDirection: 'column',
                                // gap: 1
                            }}>
                                {
                                    reserve?.establishment?._id ? (
                                        <CaplEstablishmentInfo establishment={reserve?.establishment}/>
                                    ) : <h3>Establishment not found 404</h3>
                                }
                            </Box>
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                order: {xs: 0, xl: 1}
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <GoogleMapRouteBtn
                                        styles={{
                                            borderRadius: '7px',
                                            width: 'fit-content',
                                            backgroundColor: 'transparent',
                                            "&:hover": {}
                                        }}
                                        variant={'text'}
                                        location={reserve?.establishment?.location}/>
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
                                </Box>
                                <Box
                                    sx={{
                                        borderRadius: '10px',
                                        bgcolor: 'modern.modern_1.second',
                                        p: 2,
                                        display: 'grid',
                                        // `calc(${width < 500 ? '100%' : width < 1100 ? '100% / 2 - 16px' : width < 1536 ? '100% / 3 - 16px' : '100% / 2 - 16px'})`
                                        gridTemplateColumns: `repeat(auto-fit, minmax(calc(100%), 1fr))`,
                                        "@media screen and (min-width: 500px)": {
                                            gridTemplateColumns: `repeat(auto-fit, minmax(100% / 2 - 16px, 1fr))`,
                                        },
                                        "@media screen and (min-width: 1100px)": {
                                            gridTemplateColumns: `repeat(auto-fit, minmax(calc(100% / 3 - 16px), 1fr))`,
                                        },
                                        "@media screen and (min-width: 1536px)": {
                                            gridTemplateColumns: `repeat(auto-fit, minmax(calc(100% / 2 - 16px), 1fr))`,
                                        },
                                        columnGap: 2,
                                        rowGap: {xs: 3, xl: 5},
                                        width: '100%',
                                        // gridAutoRows: 'minmax(80px, max-content)',
                                        color: 'common.white'
                                    }}
                                >
                                    {
                                        items.map((item, index) => (
                                                <Box
                                                    key={index + 1}
                                                    sx={{
                                                        width: '100%',
                                                        display: 'grid',
                                                        gridTemplateColumns: '28px 1fr',
                                                        // "&:not(:last-child)": {
                                                        //     borderBottom: '1px solid silver',
                                                        // },
                                                        // display: 'flex',
                                                        // flexDirection: {xs: 'row', sm: 'column'},
                                                        gap: 1.5,
                                                        alignItems: {xs: 'center', sm: 'start'},
                                                        // borderRadius: '10px',
                                                        // borderRadius: index === 0 ? '10px 10px 0px 0px' : (index === items?.length - 1 ? '0px 0px 10px 10px' : 0),
                                                        // bgcolor: index % 2 === 0 ? 'modern.modern_1.main' : 'modern.modern_1.second',
                                                        transition: 'all 0.2s linear',
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        // alignItems: 'center',
                                                        height: '100%',
                                                        "& svg": {
                                                            color: mode === 'dark' ? 'silver' : '#676767'
                                                        }
                                                    }}>
                                                        {item?.icon}
                                                    </Box>
                                                    <Box>
                                                        <Box sx={{
                                                            fontSize: {xs: '16px', sm: '14px'},
                                                            color: mode === 'dark' ? 'silver' : '#676767'
                                                        }}>
                                                            {item?.title}
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                fontSize: {xs: '18px', sm: '16px'},
                                                                fontWeight: 600,
                                                                "& *": {
                                                                    fontSize: {xs: '18px', sm: '16px'},
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
                                                </Box>
                                            )
                                        )
                                    }
                                </Box>
                            </Box>
                        </Box>
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
export default Show
