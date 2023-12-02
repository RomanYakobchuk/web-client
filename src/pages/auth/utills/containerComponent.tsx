import {Header} from "../../../layout";
import {Box, Container, CssBaseline, SxProps} from "@mui/material";
import React, {ReactNode, useContext} from "react";
import {ColorModeContext} from "../../../contexts";
import Copyright from "./copyright";

import "./containerStyles.css";

interface IProps {
    children: ReactNode,
    childrenProps?: SxProps,
}

const ContainerComponent = ({children, childrenProps}: IProps) => {
    const {mode} = useContext(ColorModeContext);

    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            // minHeight: '100vh',
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            // bgcolor: mode === "dark" ? "#1c1d21" : '#f1f3f4',
            // pb: 4
        }}>
            <Header/>
            <Container component="main" sx={{
                bgcolor: 'transparent',
                width: '100vw',
                position: 'relative',
                height: 'fit-content',
                minHeight: '100%',
                zIndex: 0,
                p: '0',
                // mt: 2,
                maxWidth: '100% !important',
                // pb: 4,
            }}>
                <CssBaseline/>

                {/*<Box sx={{*/}
                {/*    position: 'absolute',*/}
                {/*    width: '150px',*/}
                {/*    zIndex: 4,*/}
                {/*    height: '150px',*/}
                {/*    borderRadius: '50%',*/}
                {/*    background: 'linear-gradient(rgba(222,19,35,0.6), rgba(222,19,35,0.4))',*/}
                {/*    top: '5%',*/}
                {/*    left: '45%',*/}
                {/*    animation: 'circular1 10s infinite'*/}
                {/*}}/>*/}
                {/*<Box sx={{*/}
                {/*    position: 'absolute',*/}
                {/*    width: '200px',*/}
                {/*    zIndex: 4,*/}
                {/*    height: '200px',*/}
                {/*    borderRadius: '50%',*/}
                {/*    background: 'linear-gradient(rgba(105,208,9,0.6), rgba(105,208,9,0.4))',*/}
                {/*    top: '30%',*/}
                {/*    right: '10%',*/}
                {/*    animation: 'circular2 10s infinite'*/}
                {/*}}/>*/}
                {/*<Box sx={{*/}
                {/*    position: 'absolute',*/}
                {/*    width: '300px',*/}
                {/*    zIndex: 4,*/}
                {/*    height: '300px',*/}
                {/*    borderRadius: '50%',*/}
                {/*    background: 'linear-gradient(rgba(4,75,179,0.6), rgba(4,75,179,0.4))',*/}
                {/*    bottom: '10%',*/}
                {/*    left: '15%',*/}
                {/*    animation: 'circular3 10s linear infinite'*/}
                {/*}}/>*/}
                <Box sx={{
                    bgcolor: mode === 'dark' ? 'rgba(50, 50, 50, 0.3)' : 'rgba(255, 255, 255, 1)',
                    // backdropFilter: 'blur(10px)',
                    width: '100%',
                    height: 'fit-content',
                    minHeight: '100%',
                    position: 'absolute',
                    display: 'flex',
                    zIndex: 5,
                    inset: 0
                }}>
                    <Box sx={{
                        width: '100%',
                        height: 'fit-content',
                        // maxHeight: '100%',
                        minHeight: '100%',
                        display: 'flex'
                    }}>
                        <Box sx={{
                            paddingTop: 4,
                            order: 2,
                            // maxWidth: '440px',
                            width: '100%',
                            margin: '0 auto',
                            height: 'fit-content',
                            ...childrenProps
                        }}>
                            {children}
                            <Copyright sx={{mt: 5, mb: 10}}/>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
export default ContainerComponent
