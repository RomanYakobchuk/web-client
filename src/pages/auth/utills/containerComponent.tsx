import {Header} from "../../../layout";
import {Box, Container, CssBaseline, SxProps} from "@mui/material";
import React, {ReactNode, useContext} from "react";
import {ColorModeContext} from "../../../contexts";
import Copyright from "./copyright";
import {useMobile} from "../../../utils";

interface IProps {
    children: ReactNode,
    isPicture?: boolean,
    childrenProps?: SxProps,
    picturePath?: string,
    pictureProps?: SxProps
}

const ContainerComponent = ({children, isPicture = true, childrenProps, picturePath, pictureProps}: IProps) => {
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            minHeight: '100vh',
            height: '100%',
            bgcolor: mode === "dark" ? "#173d4f" : '#E9EEF2',
        }}>
            <Header/>
            <Container component="main" sx={{
                bgcolor: 'transparent',
                width: '100vw',
                position: 'relative',
                height: 'calc(100vh - 60px)',
                zIndex: 0,
                p: '0 !important',
                maxWidth: '100% !important'
            }}>
                <CssBaseline/>
                <Box sx={{
                    position: 'absolute',
                    width: '150px',
                    zIndex: 4,
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(rgba(222,19,35,0.6), rgba(222,19,35,0.4))',
                    top: '-10px',
                    left: '5%'
                }}/>
                <Box sx={{
                    position: 'absolute',
                    width: '200px',
                    zIndex: 4,
                    height: '200px',
                    borderRadius: '50%',
                    background: 'linear-gradient(rgba(105,208,9,0.6), rgba(105,208,9,0.4))',
                    top: '30%',
                    right: '10%'
                }}/>
                <Box sx={{
                    position: 'absolute',
                    width: '300px',
                    zIndex: 4,
                    height: '300px',
                    borderRadius: '50%',
                    background: 'linear-gradient(rgba(4,75,179,0.6), rgba(4,75,179,0.4))',
                    bottom: '10%',
                    left: '15%'
                }}/>
                <Box sx={{
                    bgcolor: mode === 'dark' ? 'rgba(50, 50, 50, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(20px)',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    zIndex: 5,
                    inset: 0
                }}>
                    <Box sx={{
                        paddingTop: 4,
                        order: 2,
                        width: {xs: '90%', md: '60%'},
                        maxWidth: '440px',
                        margin: '0 auto',
                        maxHeight: '100%',
                        overflowY: 'auto',
                        ...childrenProps
                    }}>
                        {children}
                        <Copyright sx={{mt: 5, mb: 10}}/>
                    </Box>
                    {
                        isPicture && width > 900 && (
                            <Box sx={{
                                height: '100%',
                                width: '40%',
                                order: 3,
                                backgroundImage: `url(${picturePath ? picturePath : "images/home/restaurant.png"})`,
                                backgroundPosition: 'center',
                                ...pictureProps
                            }}/>
                        )
                    }
                </Box>
            </Container>
        </Box>
    );
};
export default ContainerComponent
