import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import {Box, SxProps} from "@mui/material";
import "leaflet/dist/leaflet.css";

import Pin from "./pin/Pin";
import "./map.scss";
import {IEstablishment} from "@/interfaces/common";
import {ReactNode, useRef} from "react";
import {LatLngExpression} from "leaflet";
import {computeMapZoom, findMidPoint} from "@/components/google/services/services";

type TProps = {
    zoom?: number,
    center?: IEstablishment['location'],
    items: IEstablishment[],
    children?: ReactNode,
    styles?: SxProps,
    coordinates: { lng: number, lat: number }[]
}

export const LeafletMap = ({
                               zoom: newZoom,
                               center: newCenter,
                               items,
                               children,
                               styles,
                               coordinates
                           }: TProps) => {

    const ref = useRef<HTMLDivElement | null>(null);

    const center = newCenter || findMidPoint({coordinates});
    const zoom = newZoom || computeMapZoom({
        coords: center,
        coordinates,
        mapWidth: ref?.current?.offsetWidth ? ref?.current?.offsetWidth - 70 : 500
    });

    const mapCenter = items?.length === 0
        ? [50, 30]
        : items?.length === 1
            ? [items[0]?.location?.lat, items[0]?.location?.lng]
            : [center?.lat, center?.lng]

    return (
        <Box
            ref={ref}
            sx={{
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                ...styles
            }}
        >
            <MapContainer
                key={`${items?.length}` + zoom + JSON.stringify(center)}
                zoom={items?.length === 0 ? 6 : zoom}
                center={mapCenter as LatLngExpression}
                scrollWheelZoom={true}
                className={"map"}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position={'topleft'}/>
                {
                    items?.length > 0 && items?.map((item) => (
                        <Pin item={item} key={item?._id}/>
                    ))
                }
                {
                    children && children
                }
            </MapContainer>
        </Box>
    );
};

