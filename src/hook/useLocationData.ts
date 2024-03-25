import {IEstablishment} from "../interfaces/common";
import {useEffect, useState} from "react";

interface IProps {
    locationData: IResponseDataLocation
}

export interface IResponseDataLocation {
    address: {
        country: string,
        country_code: string,
        district?: string,
        house_number?: string,
        municipality?: string,
        postcode?: string,
        road?: string,
        state?: string,
        town?: string,
        city?: string,
        village?: string
    },
    addresstype?: string,
    boundingbox?: [number],
    class?: string,
    display_name: string,
    importance: number,
    lat: string,
    licence: string,
    lon: string,
    name: string,
    osm_id: number,
    osm_type: string,
    place_id: number,
    place_rank: number,
    type: string
}

export const useLocationData: (location: IEstablishment['location'], callback?: (locationData: IResponseDataLocation) => void) => {
    locationData: IProps['locationData']
} = (location: IEstablishment['location'], callback?: (locationData: IResponseDataLocation) => void): IProps => {

    const [locationData, setLocationData] = useState<IResponseDataLocation>({} as IResponseDataLocation);

    useEffect(() => {
        if (location?.lat && location?.lng) {
            const url = `http://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`;
            fetch(url)
                .then(value => value.json())
                .then((data: IResponseDataLocation) => {
                        if (data) {
                            setLocationData(data);
                            if (callback) {
                                callback(data)
                            }
                        }
                    }
                )
        }
    }, [location, callback]);

    return {
        locationData
    }
}
