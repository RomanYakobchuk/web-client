import React, {useEffect} from "react";
import {LayoutProps} from "@refinedev/core";
import {Box, Button, Tooltip} from "@mui/material";

import {Sider as DefaultSider} from "../sider";
import {Header as DefaultHeader} from "../header";
import {Footer as DefaultFooter} from "../footer";
import {KeyboardArrowUp, WineBar} from "@mui/icons-material";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useMobile} from "../../utils";
import {useSchema} from "../../settings";

export const Layout: React.FC<LayoutProps> = ({
                                                  Sider,
                                                  Header,
                                                  Footer,
                                                  OffLayoutArea,
                                              }) => {
    const SiderToRender = Sider ?? DefaultSider;
    const HeaderToRender = Header ?? DefaultHeader;
    const FooterToRender = Footer ?? DefaultFooter;
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {device, width} = useMobile();
    const {styles} = useSchema();

    const currentPath = pathname?.split('/')[1];

    const scrollTop = document.getElementById('scrollTop')!;

    useEffect(() => {
        window.onload = () => {
            scrollTop.style.visibility = 'hidden';
            scrollTop.style.opacity = '0';
        }

        window.onscroll = () => {
            if (window.scrollY > 500) {
                scrollTop.style.visibility = 'visible';
                scrollTop.style.opacity = '1';
            } else {
                scrollTop.style.visibility = 'hidden';
                scrollTop.style.opacity = '0'
            }
        }
    }, [window, scrollTop])

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
                    gap: styles.gapS,
                    height: '100%',
                }}
            >
                <HeaderToRender/>
                <Box
                    component="main"
                    sx={{
                        height: styles.heightLayoutS,
                        overflow: 'auto',
                        borderRadius: styles.borderRadiusS,
                        bgcolor: (theme) => theme.palette.background.paper,
                        ...someStyle,
                    }}
                >
                    <Outlet/>
                    <FooterToRender/>
                    <Box id={'scrollTop'}
                         component={'a'}
                         href={'#top'}
                         sx={{
                             visibility: "hidden",
                             opacity: 0,
                             position: 'fixed',
                             right: width < 600 ? '5px' : '20px',
                             bottom: '70px',
                             minWidth: '40px',
                             zIndex: 10,
                             borderRadius: '50%',
                             width: '62px',
                             height: '60px',
                             transition: 'visibility 0s, opacity 0.5s ease-in'
                         }}>
                        <Button variant={'contained'} sx={{
                            bgcolor: 'rgba(25, 25, 25, 0.7)',
                            color: 'rgb(221,222,213, 0.8)'
                        }}>
                            <KeyboardArrowUp/>
                        </Button>
                    </Box>
                    {
                        currentPath !== 'capl' && (
                            <Tooltip title={'Capl'} arrow>
                                <Button
                                    onClick={() => navigate('/capl')}
                                    sx={{
                                        boxShadow: '0 0 10px #ccc',
                                        position: 'fixed',
                                        right: width < 600 ? '5px' : '20px',
                                        bottom: width < 600 ? '5px' : '20px',
                                        minWidth: '50px',
                                        zIndex: 10,
                                        borderRadius: '50%',
                                        width: '60px',
                                        height: '60px',

                                    }}
                                    variant={"contained"}
                                    color={'info'}
                                >
                                    <WineBar/>
                                </Button>
                            </Tooltip>
                        )
                    }
                </Box>
            </Box>
            {OffLayoutArea && <OffLayoutArea/>}
        </Box>
    );
};
