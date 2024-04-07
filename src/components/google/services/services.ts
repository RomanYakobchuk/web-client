import {IEstablishment} from "@/interfaces/common";

type TFindMidPoint = {
    coordinates: IEstablishment['location'][]
}
const findMidPoint = ({coordinates}: TFindMidPoint): IEstablishment['location'] => {
    if (coordinates?.length === 0) {
        return {lat: 0, lng: 0};
    }
    // let sumLat = 0;
    // let sumLng = 0;
    //
    // for (let i = 0; i < coordinates?.length; i++) {
    //     sumLat += coordinates[i].lat;
    //     sumLng += coordinates[i].lng;
    // }
    //
    // const avgLat = sumLat / coordinates?.length;
    // const avgLng = sumLng / coordinates?.length;

    return {
        lat: getMiddle("lat", coordinates),
        lng: getMiddle("lng", coordinates)
    };
}
function getMiddle(prop: "lat" | "lng", markers: IEstablishment['location'][]) {
    let values = markers.map(m => m[prop]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (prop === 'lng' && (max - min > 180)) {
        values = values.map(val => val < max - 180 ? val + 360 : val);
        min = Math.min(...values);
        max = Math.max(...values);
    }
    let result = (min + max) / 2;
    if (prop === 'lng' && result > 180) {
        result -= 360
    }
    return result;
}

const computeMapZoom = ({ coordinates, coords, mapWidth }: { coords: IEstablishment['location'], coordinates: TFindMidPoint['coordinates'], mapWidth: number }): number => {
    const distances = coordinates.map(coord => getDistanceFromLatLonInKm(coords, coord));
    const maxDistance = Math.max(...distances);

    const zoom = Math.round(5 - Math.log2(maxDistance / mapWidth));
    return (zoom);
}

function getDistanceFromLatLonInKm(coord1: IEstablishment['location'], coord2: IEstablishment['location']): number {
    const R = 6371;
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lng - coord1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c);
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export {
    computeMapZoom,
    deg2rad,
    findMidPoint,
    getDistanceFromLatLonInKm
}