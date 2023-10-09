import {useEffect, useState} from "react";
import {PropertyProps} from "../interfaces/common";

interface IProps {
    position: PropertyProps['location'],
    error: string | null
}

const defaultSettings: PositionOptions = {
    enableHighAccuracy: false,
    timeout: Infinity,
    maximumAge: 0,
};
export const usePosition: (watch?: boolean, settings?: PositionOptions) => {
    position: IProps['position'],
    error: string | null
} = (watch: boolean = false, settings: PositionOptions = defaultSettings): IProps => {

    const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();
    const [error, setError] = useState<string | null>(null);

    const onChange: PositionCallback = (position: GeolocationPosition) => {
        setCurrentPosition(position);
    }
    const onError: PositionErrorCallback = (positionError: GeolocationPositionError) => {
        setError(positionError.message);
    }

    useEffect(() => {
        const geo: Geolocation = navigator.geolocation;

        if (!geo) {
            setError('Geolocation is not supported!!!');
            return;
        }

        let watcher: number | null = null;

        if (watch) {
            watcher = geo.watchPosition(onChange, onError, settings);
        } else {
            geo.getCurrentPosition(onChange, onError, settings);
        }

        return () => {
            if (watcher) {
                geo.clearWatch(watcher);
            }
        };
    }, [settings, watch]);

    return {position: {lat: currentPosition?.coords?.latitude as number, lng: currentPosition?.coords?.longitude as number}, error}
}