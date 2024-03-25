import {AdvancedMarker, ControlPosition, MapControl, useMap} from "@vis.gl/react-google-maps";
import {Marker, MarkerClusterer} from "@googlemaps/markerclusterer";
import {ArrowOutwardRounded, Close} from "@mui/icons-material";
import {MouseEvent, useEffect, useRef, useState} from "react";
import {Box, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {ESTABLISHMENT, SHOW} from "@/config/names";
import {TruncateSingleText} from "@/utils";
import type {TValues} from "./EstablishmentMaps";

type TMarkers = {
    points: TValues[]
}
export const Markers = ({points}: TMarkers) => {
    const map = useMap();
    const navigate = useNavigate();

    const [activeMarker, setActiveMarker] = useState<TValues | null>(null);

    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
        }
    }, [map]);

    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers((prevState) => {
            if (marker && !markers[key]) {
                return {...prevState, [key]: marker}
            } else {
                // const newMarkers = {...prevState};
                delete prevState[key];
                return prevState;
            }
        })
    }
    const closeActiveMarker = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveMarker(null)
    };

    const handleActiveMarker = (marker: TValues) => {
        console.log('open')
        if (activeMarker?.key === marker?.key) return;
        console.log('open - 2')
        setActiveMarker(marker)
    }

    return (
        <>
            {
                points?.map((point, index) => (
                    <AdvancedMarker
                        position={point?.coordinate}
                        key={point?.key + index}
                        onClick={() => {
                            console.log('click')
                            handleActiveMarker(point)
                        }}
                        ref={(marker) => setMarkerRef(marker, point.key)}
                    >
                        <Box
                            sx={{
                                position: 'relative'
                            }}
                        >
                            {
                                activeMarker && activeMarker?.key === point.key && (
                                    <MapControl position={ControlPosition.BLOCK_START_INLINE_CENTER}>
                                        <Box
                                            sx={{
                                                // position: 'absolute',
                                                // bottom: 0,
                                                // right: 0,
                                                transform: 'translateY(100px)',
                                                width: '250px',
                                                p: 1,
                                                zIndex: 1000,
                                                bgcolor: 'common.black',
                                                color: 'common.white',
                                                borderRadius: '12px'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'relative',
                                                    p: 0.5,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1
                                                }}
                                            >
                                                <IconButton
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-10px'
                                                    }}
                                                    onClick={closeActiveMarker}
                                                >
                                                    <Close/>
                                                </IconButton>
                                                <TruncateSingleText
                                                    width={'150px'}
                                                    styles={{
                                                        fontSize: '1rem'
                                                    }}
                                                    str={point?.title as string}
                                                />
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: '100px',
                                                        display: 'flex',
                                                        gap: 1,
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <Box
                                                        component={"img"}
                                                        src={point?.image}
                                                        sx={{
                                                            objectFit: 'cover',
                                                            width: '50%',
                                                            height: '100%',
                                                            borderRadius: '7px'
                                                        }}
                                                    />
                                                    <IconButton
                                                        sx={{
                                                            "& svg": {
                                                                fontSize: '40px'
                                                            }
                                                            // width: '40px',
                                                            // height: '40px'
                                                        }}
                                                        onClick={() => {
                                                            navigate(`/${ESTABLISHMENT}/${SHOW}/${point?.key}`)
                                                        }}
                                                        color={'secondary'}
                                                    >
                                                        <ArrowOutwardRounded/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </MapControl>
                                )
                            }
                            <Box
                                sx={{
                                    width: '50px',
                                    height: '50px',
                                    backgroundImage: `url(${point?.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '7px',
                                }}
                            >
                            </Box>
                            <Box
                                sx={{
                                    width: '50px',
                                    height: '30px',
                                    bgcolor: '#000',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    clipPath: 'polygon(10% 0, 90% 0, 50% 100%)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '48px',
                                        height: '28px',
                                        bgcolor: '#fff',
                                        color: '#000',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        clipPath: 'polygon(10% 0, 90% 0, 50% 100%)',
                                    }}
                                >
                                    {point.rating}
                                </Box>
                            </Box>
                        </Box>
                    </AdvancedMarker>
                ))
            }
        </>
    );
};