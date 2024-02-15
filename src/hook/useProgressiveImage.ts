import {useEffect, useState} from "react";

type TProps = {
    src: string,
}
type TResponse = string | null;
export const useProgressiveImage = ({src}: TProps): TResponse => {
    const [srcLoaded, setSrcLoaded] = useState<string | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setSrcLoaded(src);
    }, [src]);

    return srcLoaded;
}