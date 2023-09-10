import React, {ChangeEvent, useEffect, useRef} from "react";
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import {Box, CircularProgress, TextField} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {center, containerStyle, options} from "../establishment/utills/mapsOptrions";
import {textFieldStyle} from "../../styles";


interface IProps {
    location: google.maps.LatLngLiteral | any,
    setLocation: (value: {lat: number, lng: number}) => void,
    setPlace: (item: { address: string, city: string }) => void,
    place: { address: string, city: string },
}
const ChangeLocation = ({setLocation, location, setPlace, place}: IProps) => {

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
    useEffect(() => {
        if (location?.lat && location?.lng) {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`;

            fetch(url).then(data => data.json()).then((data) => {
                console.log(data)
                setPlace({
                    address: data?.address?.road + ' ' + data?.address?.house_number,
                    city: data?.address?.city
                })
            })
            // fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_KEY}`)
            //     .then((data) => data.json())
            //     .then((data) => {
            //         if (!place.address || !place.city) {
            //             setPlace({
            //                 address: data.results[0]?.formatted_address?.split(',')?.splice(0, 2)?.join(','),
            //                 city: `${data.results[0]?.address_components[4].long_name}, ${data.results[0]?.address_components[3]?.long_name}, ${data.results[0]?.address_components[2]?.long_name}`
            //             })
            //         }
            //     })
            //     .catch((error) => console.log(error))
        }
    }, [location])

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
                            center={center}
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
                        <CircularProgress/>
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
