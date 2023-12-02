import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {
    Box, Button,
} from "@mui/material";
import {useParams, Link, useNavigate} from "react-router-dom";
import {CanAccess, useShow, useTranslate} from "@refinedev/core";
import {ErrorComponent} from "@refinedev/mui";

import {ISubscribe, PropertyProps} from "@/interfaces/common";
import {BookMarkButton, CustomShow, NearbyEstablishmentBtn, SubscribeButton} from "@/components";
import {MainEstablishmentInfo, SimilarEstablishment} from "@/components/establishment";
import EstablishmentPropertyTabs from "@/components/establishment/establishmentPropertyTabs";
import SharedComponent from "@/components/common/shared/sharedComponent";
import {useMobile, useUserInfo} from "@/hook";
import {ColorModeContext} from "@/contexts";
import {SchemaContext} from "@/settings/schema";

import "@/hook/transition.css"

const EstablishmentDetails: FC = () => {
    const translate = useTranslate();
    const {id} = useParams();
    const {schema} = useContext(SchemaContext);
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();
    const navigate = useNavigate();
    const {user} = useUserInfo();

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
                    maxWidth={innerWidth > 1550 ? '1500px' : '1100px'}
        >
            <figcaption style={{
                viewTransitionName: `establishment${institution?._id}`,
                contain: 'paint',
                width: '100%'
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', xl: 'row'},
                        gap: 2,
                        alignItems: {xs: 'start'},
                    }}>
                    <Box sx={{
                        width: {xs: '100%', xl: '250px'},
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 1,
                        position: {xl: 'sticky'},
                        top: schema === 'schema_1' ? '80px' : '10px',
                        alignItems: {xs: 'center'}
                    }}>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/capl/create?establishmentId=${institution?._id}`)
                            }}
                            color={'info'}
                            variant={'contained'}
                            sx={{
                                borderRadius: '7px',
                                textTransform: 'inherit'
                            }}
                        >
                            {translate('capl.title')}
                        </Button>
                        <NearbyEstablishmentBtn
                            establishment={institution}
                            location={institution.location}
                            style={{
                                m: 0,
                                width: 'fit-content',
                                borderRadius: '7px',
                            }}
                            btnColor={'success'}
                        />
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'start',
                            flexDirection: {xs: 'row', xl: 'column'}
                        }}>
                            {
                                (institution?.createdBy !== user?._id
                                    && institution?._id && institution?.sendNotifications) &&
                                <SubscribeButton
                                    createdBy={institution?.createdBy}
                                    showText={width > 350}
                                    subscribe={subscribe}
                                    establishmentId={institution?._id}
                                />
                            }
                            <Box sx={{
                                display: 'flex',
                                alignItems: {xs: 'center', xl: 'start'},
                                gap: 1,
                                flexDirection: {xs: 'row', xl: 'column'},
                            }}>
                                <BookMarkButton
                                    showText={width > 600}
                                    color={'common.white'}
                                    bgColor={'transparent'}
                                    style={{
                                        // borderRadius: '5px',
                                        minWidth: '20px',
                                        // color: '#fff',
                                        // bgcolor: mode === 'dark' ? '#86a8cf' : '#7fbada',
                                        "& svg": {
                                            order: -1
                                        }
                                    }}
                                    type={'institution'} id={institution?._id}
                                />
                                <Box sx={{
                                    // backdropFilter: 'blur(7px)',
                                    // bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.4)',
                                    // borderRadius: '5px'
                                }}>
                                    <SharedComponent
                                        type={'institution'}
                                        color={'common.white'}
                                        url={window.location.href}
                                        isShowSharedText={width > 600}
                                        title={translate('buttons.share')}
                                        isOnlyShared={true}
                                        name={institution?.title}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        width: {xs: '100%', xl: 'calc(100% - 250px)'},
                        flexDirection: "column",
                        justifyContent: 'center',
                        gap: 2,
                        alignItems: 'start',
                        mt: '10px'
                    }}
                    >
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
                            establishment={institution}/>
                        {
                            institution?._id && (
                                <Box sx={{
                                    width: '100%'
                                }}>
                                    <SimilarEstablishment
                                        id={institution?._id}/>
                                </Box>
                            )
                        }
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
                </Box>
            </figcaption>
        </CustomShow>
    );
};
export default EstablishmentDetails;