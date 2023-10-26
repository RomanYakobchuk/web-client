import React, {useContext, useEffect, useState} from "react";
import {LayoutProps, useNotification, useTranslate} from "@refinedev/core";
import {Box, Button, Tooltip} from "@mui/material";
import {Article} from "@mui/icons-material";
import {Outlet, useNavigate} from "react-router-dom";

import {Sider as DefaultSider} from "../sider";
import {Header as DefaultHeader} from "../header";
import {Footer as DefaultFooter} from "../footer";
import {useMobile, useModalListLayout, useScrollRestoration, useUserInfo} from "../../hook";
import {useSchema} from "../../settings";
import {SchemaContext} from "../../settings/schema";
import {ModalShowContent} from "../../components";

export const Layout: React.FC<LayoutProps> = ({
                                                  Sider,
                                                  Header,
                                                  Footer,
                                                  OffLayoutArea,
                                              }) => {
    const SiderToRender = Sider ?? DefaultSider;
    const HeaderToRender = Header ?? DefaultHeader;
    const FooterToRender = Footer ?? DefaultFooter;
    const {schema} = useContext(SchemaContext);
    const {device, width} = useMobile();
    const {styles} = useSchema();
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {modalCaplContext, setModalCaplContext} = useModalListLayout();
    const {open, close} = useNotification();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState<boolean>(false);

    const someStyle = !device ? {
        '&::-webkit-scrollbar': {
            width: '10px',
            bgcolor: 'transparent',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            bgcolor: 'steelblue',
            borderRadius: '5px',
        }
    } : {};

    useEffect(() => {
        if (!user?.phone || !user?.dOB) {
            open?.({
                type: 'error',
                message: 'Add date of birth and/or phone number for verify your account',
                description: 'Profile',
                key: 'add_dOB_phone',
                cancelMutation: () => {
                    close?.('add_dOB_phone')
                }
            })
            navigate(`/profile/edit`)
        }
    }, [user?.phone, user?._id, user?.dOB, window.location.href]);

    const ref = useScrollRestoration(window.location.href);

    useEffect(() => {
        setModalCaplContext([
            {
                color: 'info',
                variant: 'contained',
                link: '/capl/create',
                name: translate('capl.title')
            }
        ]);
    }, [translate]);

    return (
        <Box
            display="flex" flexDirection="row"
            sx={{
                margin: styles.marginS,
                height: '100%'
            }}>
            <SiderToRender/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    scrollBehavior: 'smooth',
                    gap: styles.gapS,
                    height: '100%',
                }}
            >
                {
                    schema !== 'schema_1' && (
                        <HeaderToRender/>
                    )
                }
                <Box
                    ref={ref}
                    component="main"
                    sx={{
                        height: styles.heightLayoutS,
                        overflow: 'auto',
                        borderRadius: styles.borderRadiusS,
                        bgcolor: 'common.black',
                        ...someStyle,
                        WebkitOverflowScrolling: 'touch'
                        // paddingTop: schema === 'schema_1' ? '80px' : '0',
                    }}
                >
                    {
                        schema === 'schema_1' && (
                            <HeaderToRender/>
                        )
                    }
                    {/*<ScrollManager/>*/}
                    <Outlet/>
                    <FooterToRender/>

                    <ModalShowContent
                        openComponent={
                            <Tooltip title={'Capl'} arrow>
                                <Button
                                    onClick={() => setOpenModal(true)}
                                    sx={{
                                        // boxShadow: '0 0 10px #ccc',
                                        position: 'fixed',
                                        right: width < 900 ? '10px' : '20px',
                                        bottom: width < 900 ? '10px' : '20px',
                                        minWidth: '30px',
                                        zIndex: 10,
                                        borderRadius: '50%',
                                        p: 1.5,
                                        width: 'fit-content',
                                        height: 'fit-content',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    variant={"contained"}
                                    color={'info'}
                                >
                                    <Article fontSize={'large'}/>
                                </Button>
                            </Tooltip>
                        }
                        isOpen={openModal}
                        setIsOpen={setOpenModal}
                        contentStyle={{
                            width: '100%',
                        }}
                        modalStyle={{
                            width: '90%',
                            maxWidth: '500px',
                            top: '40%'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            {
                                modalCaplContext?.length > 0 && modalCaplContext?.map((value, index) => (
                                    <Button key={index}
                                            color={value?.color}
                                            sx={{
                                                width: '100%',
                                                textTransform: 'inherit'
                                            }}
                                            onClick={() => {
                                                navigate(value?.link)
                                                setOpenModal(false)
                                            }}
                                            variant={value?.variant}
                                    >
                                        {value.name}
                                    </Button>
                                ))
                            }
                        </Box>
                    </ModalShowContent>
                    {/*<ModalWindow*/}
                    {/*    open={openModal}*/}
                    {/*    setOpen={setOpenModal}*/}
                    {/*    title={*/}
                    {/*        <Box>List items</Box>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    Content*/}
                    {/*</ModalWindow>*/}
                </Box>
            </Box>
            {OffLayoutArea && <OffLayoutArea/>}
        </Box>
    );
};
