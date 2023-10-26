import React, {useContext} from "react";
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import {Box} from "@mui/material";
import {Route} from "@mui/icons-material";
import {Button} from "antd";
import {useTranslate} from "@refinedev/core";

import {usePosition} from "../../../hook";
import {containerStyle} from "../../establishment/utills/mapsOptrions";
import {Loading, openGoogleMaps} from "../../index";
import {ColorModeContext} from "../../../contexts";

type TProps = {
    location: google.maps.LatLngLiteral | { lat: number, lng: number },
    showRoute: boolean
}

// interface IDataRoute {
//     distance: string,
//     duration: string
// }

// const TravelModeType = {
//     BICYCLING: "BICYCLING",
//     DRIVING: "DRIVING",
//     TRANSIT: "TRANSIT",
//     WALKING: "WALKING",
// } as const;
// type TravelModeTypeValues = typeof TravelModeType[keyof typeof TravelModeType];

const ShowMap = ({showRoute, location}: TProps) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {position} = usePosition();
    // const selectOptions = getSelectOptions();

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_KEY!,
    });

    // const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
    // const [travelMode, setTravelMode] = useState<TravelModeTypeValues>("DRIVING");
    // const [dataRoute, setDataRoute] = useState<IDataRoute>({} as IDataRoute);

    const userPosition: google.maps.LatLngLiteral = {
        lat: position?.lat as number, lng: position?.lng as number
    }
    // const route = async () => {
    //     if (showRoute) {
    //
    //         const directionService = new google.maps.DirectionsService();
    //
    //         if (error) {
    //             alert(error);
    //             return;
    //         }
    //         console.log(position)
    //
    //         const results = await directionService.route({
    //             origin: userPosition,
    //             destination: location,
    //             travelMode: google.maps.TravelMode[travelMode]
    //         });
    //         setDirectionsResponse(results);
    //         setDataRoute({
    //             distance: results?.routes[0]?.legs[0]?.distance?.text as string,
    //             duration: results?.routes[0]?.legs[0]?.duration?.text as string
    //         })
    //     }
    // }
    // const clearRoute = () => {
    //     setDirectionsResponse(null);
    //     setDataRoute({} as IDataRoute);
    // }
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative'
        }}>
            {
                isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{
                            ...containerStyle,
                        }}
                        center={new google.maps.LatLng(location?.lat, location?.lng)}
                        zoom={10}
                    >
                        {
                            location ?
                                <MarkerF position={new google.maps.LatLng(location?.lat, location?.lng)}/>
                                : null
                        }
                        {/*{*/}
                        {/*    showRoute && directionsResponse && (*/}
                        {/*        <DirectionsRenderer*/}
                        {/*            directions={directionsResponse}*/}
                        {/*        />*/}
                        {/*    )*/}
                        {/*}*/}
                    </GoogleMap>
                ) : <Box sx={{
                    width: {xs: '100%', sm: '350px', md: '100%', lg: '50%'},
                    height: "350px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Loading height={'100%'}/>
                </Box>
            }
            {/*{*/}
            {/*    showRoute && (*/}
            {/*        <Box>*/}
            {/*            <Select*/}
            {/*                defaultValue={selectOptions[1]?.value}*/}
            {/*                options={selectOptions}*/}
            {/*                onChange={handleChange}*/}
            {/*            />*/}
            {/*        </Box>*/}
            {/*    )*/}
            {/*}*/}
            {
                showRoute && (
                    <Box sx={{
                        height: '30px',
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        // width: '100%',
                        transition: '300ms linear',
                        "& button:hover span":{
                            color: '#445fb7'
                        }
                    }}>
                        <Button
                            icon={<Route/>}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                color: mode === 'dark' ? '#f7f7f7' : '#302a29',
                                backgroundColor: mode === 'dark' ? '#302a29' : '#f7f7f7'
                            }}
                            onClick={() => openGoogleMaps({destination: location, userGeo: userPosition})}
                        >
                            {translate('buttons.google.viewRoute')}
                        </Button>
                    </Box>
                )
            }
        </Box>
    );
};

// const getSelectOptions = () => {
//     const translate = useTranslate();
//     const travelModeKeys: (keyof typeof TravelModeType)[] = Object.keys(TravelModeType) as (keyof typeof TravelModeType)[];
//
//     return travelModeKeys.map((key) => ({
//         value: TravelModeType[key],
//         label: translate(`travelMode.${key}`)
//     }));
// }
export default ShowMap
