import React, {useEffect} from "react";
import {LayoutProps} from "@refinedev/core";
import {Box, Button, Tooltip} from "@mui/material";

import {Sider as DefaultSider} from "../sider";
import {Header as DefaultHeader} from "../header";
import {KeyboardArrowUp, WineBar} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";

export const Layout: React.FC<LayoutProps> = ({
                                                  Sider,
                                                  Header,
                                                  Footer,
                                                  OffLayoutArea,
                                                  children,
                                              }) => {
    const SiderToRender = Sider ?? DefaultSider;
    const HeaderToRender = Header ?? DefaultHeader;
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const currentPath = pathname?.split('/')[1];

    const scrollTop = document.getElementById('scrollTop')!;

    useEffect(() => {
        window.onload = () => {
            scrollTop.style.visibility = 'hidden';
            scrollTop.style.opacity = '0';
        }

        window.onscroll = () => {
            if (window.scrollY > 200) {
                scrollTop.style.visibility = 'visible';
                scrollTop.style.opacity = '1';
            } else {
                scrollTop.style.visibility = 'hidden';
                scrollTop.style.opacity = '0'
            }
        }
    }, [window, scrollTop])

    return (
        <Box display="flex" flexDirection="row">
            <SiderToRender/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: "100vh",
                }}
            >
                <HeaderToRender/>
                <Box
                    component="main"
                    sx={{
                        p: {xs: 1, md: 2, lg: 3},
                        flexGrow: 1,
                        position: 'relative',
                        bgcolor: (theme) => theme.palette.background.default,
                    }}
                >
                    {children}
                    <Box id={'scrollTop'}
                         component={'a'}
                         href={'#top'}
                         sx={{
                             visibility: "hidden",
                             opacity: 0,
                             position: 'fixed',
                             right: '30px',
                             bottom: '80px',
                             minWidth: '50px',
                             zIndex: 10000,
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
                                        right: '30px',
                                        bottom: '30px',
                                        minWidth: '50px',
                                        zIndex: 1000,
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
                {Footer && <Footer/>}
            </Box>
            {OffLayoutArea && <OffLayoutArea/>}
        </Box>
    );
};