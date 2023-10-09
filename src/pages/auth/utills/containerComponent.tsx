import {Header} from "../../../layout";
import {Box, Container, CssBaseline, SxProps} from "@mui/material";
import React, {ReactNode, useContext} from "react";
import {ColorModeContext} from "../../../contexts";
import Copyright from "./copyright";
import {useMobile} from "../../../hook";

import "./containerStyles.css";
import MovingElement from "./movingElement";

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
    const totalElements = 7; // Кількість елементів
    const radius = width / 2 - 100;
    const duration = 3000;

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
                overflow: 'hidden',
                maxWidth: '100% !important'
            }}>
                <CssBaseline/>
                <Box sx={{
                    width: '90%',
                    height: '500px',
                    position: 'relative',
                    margin: '0 auto',
                    transform: 'translate(50%, 60%)'
                }}>
                    {Array.from({length: totalElements}).map((_, index) => (
                        <MovingElement
                            key={index}
                            index={index}
                            totalElements={totalElements}
                            // background={'linear-gradient(rgba(222,19,35,0.6), rgba(222,19,35,0.4))'}
                            radius={radius}
                            duration={duration}
                        />
                    ))}
                </Box>
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
                    bgcolor: mode === 'dark' ? 'rgba(50, 50, 50, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    zIndex: 5,
                    inset: 0
                }}>
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        maxHeight: '100%',
                        overflowY: 'auto',
                        display: 'flex'
                    }}>
                        <Box sx={{
                            paddingTop: 4,
                            order: 2,
                            // maxWidth: '440px',
                            width: '100%',
                            margin: '0 auto',
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
                </Box>
            </Container>
        </Box>
    );
};
export default ContainerComponent
