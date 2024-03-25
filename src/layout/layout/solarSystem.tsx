import {Box, IconButton} from "@mui/material";
import React, {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useIdle} from "@uidotdev/usehooks";

import "./layout.scss";
import {Close} from "@mui/icons-material";


type TProps = {
    timer?: number,
    speed?: number,
    amount?: number
}

export const SolarSystem = ({timer = 50000, speed = 1, amount = 100}: TProps) => {

    const [isUserActive, setIsUserActive] = useState<boolean>(true);

    const times = {
        mercury: 8.8 / speed,
        venus: 22.6 / speed,
        earth: 36.5 / speed,
        mars: 68.6 / speed,
        jupiter: 432.9 / speed,
        saturn: 1075.3 / speed,
        uran: 3069.7 / speed,
        neptune: 6014.8 / speed,
    }


    const isInActive = useIdle(timer);

    useEffect(() => {
        if (isInActive) {
            setIsUserActive(false);
        }
    }, [isInActive]);

    if (isUserActive) return null;

    const stars = Array(amount).fill(null).map((_, index) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 100;
        const width = Math.random() * 2 + 7;
        const height = Math.random() * 2 + 7;
        const opacity = Math.random() * 0.5 + 0.5;

        const isRedStar = index % 8 === 0;
        const isBlueStar = index % 10 === 6;

        return (
            <div
                key={index}
                className={`star-blink ${isRedStar ? 'red' : ''} ${isBlueStar ? 'blue' : ''}`}
                style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    animation: `blinklAfter 15s infinite ${animationDelay}s linear`,
                    width: `${width}px`,
                    height: `${height}px`,
                    opacity,
                }}
            />
        );
    });

    return createPortal(
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                // bgcolor: '#000',
                backgroundColor: 'darkblue',
                background: '-webkit-radial-gradient(center, rgba(0,0,70,1) 0%, #000 60%)',
                animation: 'rotate 250s infinite linear',
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <IconButton
                    onClick={() => setIsUserActive(true)}
                    sx={{
                        borderRadius: '10px',
                        bgcolor: 'rgba(200, 200, 200, 0.6)',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <Close/>
                </IconButton>
            </Box>
            {stars}
            <Box
                sx={{
                    scale: '0.7',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    maxWidth: '900px',
                    // maxHeight: '100%',
                    color: 'common.white',
                    position: 'relative',
                    fontSize: '10px',
                    "& .earth, & .saturn, & .uran, & .neptune, & .jupiter, & .moon, & .mercury, & .venus, & .mars": {
                        position: 'absolute',
                        borderStyle: 'solid',
                        borderColor: '#f1f1f1 transparent transparent transparent',
                        borderWidth: '0.1em 0.1em 0 0',
                        borderRadius: '50%',
                        "&::before": {
                            content: "''",
                            position: 'absolute',
                            borderRadius: '50%'
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '10%',
                        aspectRatio: '1 / 1',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'orange',
                        borderRadius: '50%',
                        boxShadow: '0 0 35px 5px yellow,0 0 25px 10px yellow inset',
                    }}
                    className={'sun'}
                />
                <Box
                    sx={{
                        top: '40%',
                        left: '40%',
                        // transform: 'translate(-50%, -50%)',
                        width: '20%',
                        aspectRatio: '1 / 1',
                        // height: '23%',
                        animation: `orbit ${times.mercury}s linear infinite`,
                        "&::before": {
                            top: '7%',
                            right: '7%',
                            width: '15%',
                            aspectRatio: '1 / 1',
                            // maxWidth: '30px',
                            // height: '15%',
                            bgcolor: '#b97a7a'
                        }
                    }}
                    className={'mercury'}
                />
                <Box
                    sx={{
                        top: '35%',
                        left: '35%',
                        width: '30%',
                        aspectRatio: '1 / 1',
                        // height: '33%',
                        animation: `orbit ${times.venus}s linear infinite`,
                        "&::before": {
                            top: '8%',
                            right: '8%',
                            width: '13%',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: '#ac541d'
                        }
                    }}
                    className={'venus'}
                />
                <Box
                    sx={{
                        top: '26%',
                        left: '26%',
                        width: '48%',
                        aspectRatio: '1 / 1',
                        // height: '50%',
                        animation: `orbit ${times.earth}s linear infinite`,
                        "&::before": {
                            top: '7%',
                            right: '7%',
                            width: '15%',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: 'aqua'
                        }
                    }}
                    className={'earth'}
                >
                    <Box
                        sx={{
                            width: '7%',
                            top: '10%',
                            left: '80%',
                            position: 'absolute',
                            aspectRatio: '1 / 1',
                            bgcolor: 'green',
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                        }}
                    />
                    <Box
                        sx={{
                            top: '2%',
                            right: '2%',
                            width: '25%',
                            aspectRatio: '1 / 1',
                            // height: '25%',
                            animation: 'orbit 2.7s linear infinite',
                            "&::before": {
                                top: '5%',
                                right: '5%',
                                width: '15%',
                                aspectRatio: '1 / 1',
                                // height: '15%',
                                bgcolor: 'silver'
                            }
                        }}
                        className="moon"/>
                </Box>
                <Box
                    sx={{
                        top: '17%',
                        left: '17%',
                        width: '66%',
                        aspectRatio: '1 / 1',
                        // height: '65%',
                        animation: `orbit ${times.mars}s linear infinite`,
                        "&::before": {
                            top: '11%',
                            right: '11%',
                            width: '8%',
                            aspectRatio: '1 / 1',
                            // height: '8%',
                            bgcolor: 'red'
                        }
                    }}
                    className={'mars'}
                />
                <Box
                    sx={{
                        top: '8%',
                        left: '8%',
                        width: '84%',
                        aspectRatio: '1 / 1',
                        // height: '80%',
                        animation: `orbit ${times.jupiter}s linear infinite`,
                        "&::before": {
                            top: '9%',
                            right: '9%',
                            width: '12%',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: '#996f60'
                        }
                    }}
                    className={'jupiter'}
                />
                <Box
                    sx={{
                        top: '0%',
                        left: '0%',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        // height: '80%',
                        animation: `orbit ${times.saturn}s linear infinite`,
                        "&::before": {
                            top: '11.5%',
                            right: '11.5%',
                            width: '6%',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: '#a48074'
                        },
                        "&::after": {
                            top: '12.5%',
                            right: '12.5%',
                            width: '4%',
                            border: '5px solid black',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: '#725a52',
                            content: "''",
                            position: 'absolute',
                            borderRadius: '50%'
                        },
                    }}
                    className={'saturn'}
                />
                <Box
                    sx={{
                        top: '-7%',
                        left: '-7%',
                        width: '114%',
                        aspectRatio: '1 / 1',
                        // height: '80%',
                        animation: `orbit ${times.uran}s linear infinite`,
                        "&::before": {
                            top: '13%',
                            right: '13%',
                            width: '3.5%',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: '#f1e2de'
                        }
                    }}
                    className={'uran'}
                />
                <Box
                    sx={{
                        top: '-12%',
                        left: '-12%',
                        width: '124%',
                        aspectRatio: '1 / 1',
                        // height: '80%',
                        animation: `orbit ${times.neptune}s linear infinite`,
                        "&::before": {
                            top: '12.8%',
                            right: '12.8%',
                            width: '3.5%',
                            aspectRatio: '1 / 1',
                            // height: '15%',
                            bgcolor: '#030aa4'
                        }
                    }}
                    className={'neptune'}
                />
            </Box>
        </Box>, document.body
    );
};

