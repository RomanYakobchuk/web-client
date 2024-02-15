import React, {FC, useContext, useState} from "react";
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
import {SchemaContext} from "@/settings/schema";

import "@/hook/transition.css"
import LoadingDetails from "@/components/establishment/whileLoading/loadingDetails";
import {MessageRounded} from "@mui/icons-material";
import {CustomChatShowContainer} from "@/components/chats/customChatShow/customChatShowContainer";
import {ADD_FREE_PLACES, ESTABLISHMENT} from "@/config/names";

const EstablishmentDetails: FC = () => {
    const translate = useTranslate();
    const {id} = useParams();
    const {schema} = useContext(SchemaContext);
    const {width} = useMobile();
    const navigate = useNavigate();
    const {user} = useUserInfo();

    const [isOpenChat, setIsOpenChat] = useState<boolean>(false);

    const {queryResult} = useShow<{ establishment: PropertyProps, subscribe: ISubscribe }>({
        resource: `${ESTABLISHMENT}/infoById`,
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    });
    const {data, isLoading, isError} = queryResult;

    const establishment: PropertyProps = data?.data?.establishment ?? {} as PropertyProps;
    const subscribe: ISubscribe = data?.data?.subscribe ?? {} as ISubscribe;

    if (isError) return <ErrorComponent/>

    return (
        <CustomShow isLoading={false}
                    bgColor={'transparent'}
                    isShowButtons={user?._id === establishment?.createdBy || user?.status === 'admin'}
                    maxWidth={innerWidth > 1550 ? '1500px' : '1100px'}
        >
            {
                isLoading
                    ? <LoadingDetails/>
                    : <figcaption style={{
                        viewTransitionName: `establishment${establishment?._id}`,
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
                                        navigate(`/capl/create?establishmentId=${establishment?._id}`)
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
                                    establishment={establishment}
                                    location={establishment.location}
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
                                        (establishment?.createdBy !== user?._id
                                            && establishment?._id && establishment?.sendNotifications) &&
                                        <SubscribeButton
                                            createdBy={establishment?.createdBy}
                                            showText={width > 350}
                                            subscribe={subscribe}
                                            establishmentId={establishment?._id}
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
                                            type={'establishment'} id={establishment?._id}
                                        />
                                        <Box sx={{
                                            // backdropFilter: 'blur(7px)',
                                            // bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.4)',
                                            // borderRadius: '5px'
                                        }}>
                                            <SharedComponent
                                                type={'establishment'}
                                                color={'common.white'}
                                                url={window.location.href}
                                                isShowSharedText={width > 600}
                                                title={translate('buttons.share')}
                                                isOnlyShared={true}
                                                name={establishment?.title}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                {
                                    user?._id !== establishment?.createdBy && (
                                        <Box>
                                            <Button
                                                onClick={() => setIsOpenChat(true)}
                                                sx={{
                                                    textTransform: 'inherit'
                                                }}
                                                startIcon={
                                                    <MessageRounded
                                                        sx={{
                                                            fontSize: '28px !important'
                                                        }}
                                                    />
                                                }
                                            >
                                                {translate('capl.list.write')}
                                            </Button>
                                            {
                                                isOpenChat && establishment?._id && (
                                                    <CustomChatShowContainer
                                                        chatFieldName={'establishment'}
                                                        chatFieldId={establishment?._id}
                                                        chatType={'oneByOne'}
                                                        isOpen={isOpenChat}
                                                        setIsOpen={setIsOpenChat}
                                                        chatName={''}
                                                        members={[
                                                            {
                                                                user: user?._id,
                                                                role: user?.status,
                                                                connectedAt: new Date(),
                                                                conversationTitle: establishment?.title
                                                            },
                                                            {
                                                                user: establishment?.createdBy,
                                                                role: 'manager',
                                                                connectedAt: new Date(),
                                                                conversationTitle: user?.name
                                                            }
                                                        ]}
                                                    />
                                                )
                                            }
                                        </Box>
                                    )
                                }
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
                                    action={`${ADD_FREE_PLACES}`}
                                    resource={`${ESTABLISHMENT}`}
                                >
                                    <Link
                                        to={`${ADD_FREE_PLACES}`}
                                    >
                                        add_free_places
                                    </Link>
                                </CanAccess>
                                <MainEstablishmentInfo
                                    establishment={establishment}/>
                                {
                                    establishment?._id && (
                                        <Box sx={{
                                            width: '100%'
                                        }}>
                                            <SimilarEstablishment
                                                id={establishment?._id}/>
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
                                    <EstablishmentPropertyTabs establishment={establishment}/>
                                </Box>
                            </Box>
                        </Box>
                    </figcaption>
            }
        </CustomShow>
    );
};
export default EstablishmentDetails;