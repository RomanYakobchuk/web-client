import {APIProvider, Map, MapCameraChangedEvent} from "@vis.gl/react-google-maps";
import {ReactNode, useEffect, useState} from "react";
import {Box, SxProps} from "@mui/material";

import {IEstablishment} from "@/interfaces/common";
import {Loading} from "@/components";


const API_KEY = import.meta.env.VITE_APP_NEW_GOOGLE_MAPS_KEY;
const MAP_ID = import.meta.env.VITE_APP_NEW_GOOGLE_MAPS_ID;

export type TNewShowMap = {
    styles?: SxProps,
    zoom?: number,
    center: IEstablishment['location'],
    children: ReactNode,
    disableDefaultUI?: boolean,
    scaleControl?: boolean,
    fullscreenControl?: boolean,
    streetViewControl?: boolean,
    mapTypeControl?: boolean,
    zoomControl?: boolean,
}
export const NewShowMap = ({
                               children,
                               styles,
                               zoom = 10,
                               center,
                               disableDefaultUI = false,
                               scaleControl = true,
                               fullscreenControl = true,
                               streetViewControl = true,
                               mapTypeControl = true,
                               zoomControl = true,
                           }: TNewShowMap) => {
    const [currentCenter, setCurrentCenter] = useState<IEstablishment['location'] | null>(center);
    const [currentZoom, setCurrentZoom] = useState<number | null>(zoom);

    useEffect(() => {
            setCurrentZoom(zoom)
            setCurrentCenter(center);
    }, [zoom, center]);

    const handleChangeCenter = (event: MapCameraChangedEvent) => {
        const lng = event.map.getCenter()?.lng();
        const lat = event.map.getCenter()?.lat();
        setCurrentCenter({lng: lng || currentCenter?.lng || 30, lat: lat || currentCenter?.lat || 30});
    }
    const handleChangeZoom = (event: MapCameraChangedEvent) => {
        const z = event.map.getZoom();
        setCurrentZoom(z || currentZoom);
    }
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
                ...styles
            }}
        >
            <APIProvider apiKey={API_KEY}>
                {
                    (!currentCenter || !currentZoom)
                        ? <Loading height={'100%'}/>
                        : <Map
                            // defaultCenter={currentCenter}
                            // defaultZoom={currentZoom}
                            zoom={currentZoom}
                            center={currentCenter}
                            mapId={MAP_ID}
                            onCenterChanged={handleChangeCenter}
                            onZoomChanged={handleChangeZoom}
                            gestureHandling={'greedy'}
                            disableDefaultUI={disableDefaultUI}
                            scaleControl={scaleControl}
                            fullscreenControl={fullscreenControl}
                            streetViewControl={streetViewControl}
                            mapTypeControl={mapTypeControl}
                            zoomControl={zoomControl}
                        >
                            {children}
                        </Map>
                }
            </APIProvider>
        </Box>
    );
};
