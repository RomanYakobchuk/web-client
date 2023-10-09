interface IProps {
    destination: {
        lat: number,
        lng: number
    },
    userGeo: {
        lat: number,
        lng: number
    }
}

const openGoogleMaps = ({destination, userGeo}: IProps) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userGeo.lat},${userGeo.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

    window.open(mapsUrl, '_blank');
}

export {
    openGoogleMaps
}