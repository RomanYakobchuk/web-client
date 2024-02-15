type TProps = {
    destination: {
        lat: number,
        lng: number
    },
    userGeo: {
        lat: number,
        lng: number
    }
}

const openGoogleMaps = ({destination, userGeo}: TProps) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userGeo.lat},${userGeo.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

    window.open(mapsUrl, '_blank');
}

export {
    openGoogleMaps
}