import React, {ChangeEvent, useEffect, useRef} from "react";
import { GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import {Box, TextField} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {center, containerStyle, options} from "../../establishment/utills/mapsOptrions";
import {textFieldStyle} from "../../../styles";
import {Loading} from "../../index";
import {useLocationData} from "../../../hook";

type TProps = {
    location: google.maps.LatLngLiteral | { lat: number, lng: number },
    setLocation: (value: { lat: number, lng: number }) => void,
    setPlace: (item: { address: string, city: string }) => void,
    place: { address: string, city: string },
    isReadOnly?: boolean
}

const ChangeLocation = ({setLocation, location, setPlace, place, isReadOnly = false}: TProps) => {

    const translate = useTranslate();

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_KEY!
    });

    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = (map: google.maps.Map): void => {
        mapRef.current = map
    }
    const onUnmount = (): void => {
        mapRef.current = null
    }
    const {locationData} = useLocationData(location);

    useEffect(() => {
        if (locationData) {
            setPlace({
                address: (locationData?.address?.road ? locationData?.address?.road : '' + ' ' + locationData?.address?.house_number ? locationData?.address?.house_number : '') as string,
                city: locationData?.address?.city ? locationData?.address?.city : locationData?.address?.town ? locationData?.address?.town : locationData?.address?.village ? locationData?.address?.village : locationData?.address?.municipality ? locationData?.address?.municipality : ''
            })
        }
    }, [locationData]);

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        setLocation({lat: e.latLng?.lat() as number, lng: e.latLng?.lng() as number})
    }

    return (
        <>
            {
                isLoaded ?
                    <Box sx={{
                        width: "100%",
                        height: {xs: "350px", md: "400px"},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={location?.lat ? location : center}
                            options={options as google.maps.MapOptions}
                            zoom={10}
                            onLoad={onLoad}
                            onClick={onMapClick}
                            onUnmount={onUnmount}>
                            {
                                location?.lat ?
                                    <MarkerF position={location as google.maps.LatLngLiteral}/> : null
                            }
                        </GoogleMap>
                    </Box> : <Box sx={{
                        width: "100%",
                        height: {xs: "350px", md: "400px"},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Loading height={'100%'}/>
                    </Box>
            }
            {
                (location?.lat && location?.lng) ?
                    <>
                        <TextField
                            fullWidth
                            required
                            sx={{
                                mt: 2,
                                ...textFieldStyle
                            }}
                            id="outlined-basic"
                            color={"secondary"}
                            disabled
                            label={translate("home.create.location.coordinates.title")}
                            variant="outlined"
                            size={"small"}
                            value={location?.lat && location?.lng ? `lat: ${location?.lat}   lng: ${location?.lng}` : `lat: 0, lng: 0`}
                            onChange={() => {
                            }}
                        />
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                            gap: {xs: 1, md: 2}
                        }}>
                            <TextField
                                fullWidth
                                required
                                sx={{
                                    mt: 2,
                                    ...textFieldStyle
                                }}
                                disabled={isReadOnly}
                                id="outlined-basic3"
                                color={"secondary"}
                                size={"small"}
                                value={place.city ?? ''}
                                label={translate("home.create.city")}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace({
                                    address: place.address,
                                    city: e.target.value
                                })}
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                required
                                id="outlined-basic3"
                                color={"secondary"}
                                sx={{
                                    mt: 2,
                                    ...textFieldStyle
                                }}
                                disabled={isReadOnly}
                                label={translate("home.create.address")}
                                size={"small"}
                                value={place.address ? place.address : ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace({
                                    address: e.target.value,
                                    city: place.city
                                })}
                                variant="outlined"
                            />
                        </Box>
                    </> : ''
            }
        </>
    );
};
export default ChangeLocation;
