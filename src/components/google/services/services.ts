import {IEstablishment} from "@/interfaces/common";

type TFindMidPoint = {
    coordinates: IEstablishment['location'][]
}
const findMidPoint = ({coordinates}: TFindMidPoint): IEstablishment['location'] => {
    if (coordinates?.length === 0) {
        return {lat: 0, lng: 0};
    }

    let sumLat = 0;
    let sumLng = 0;

    for (let i = 0; i < coordinates?.length; i++) {
        sumLat += coordinates[i].lat;
        sumLng += coordinates[i].lng;
    }

    const avgLat = sumLat / coordinates?.length;
    const avgLng = sumLng / coordinates?.length;

    return { lat: avgLat, lng: avgLng };
}

const computeMapZoom = ({coordinates, coords}: {coords: IEstablishment['location'], coordinates: TFindMidPoint['coordinates']}): number => {
    const maxDistance = 1000;
    const center = coords;

    let maxDistanceInPixels = 100;

    for (const coord of coordinates) {
        const distance = getDistanceFromLatLonInKm(center, coord);
        maxDistanceInPixels = Math.max(maxDistanceInPixels, distance);
    }

    return Math.floor(Math.log(256 * 2 * maxDistanceInPixels / maxDistance) / Math.LN2) - 1;
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
    const d = R * c;
    return d;
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