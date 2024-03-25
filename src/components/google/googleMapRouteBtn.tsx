import {Route} from "@mui/icons-material";
import {SxProps, Button} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {openGoogleMaps} from "@/components";
import {usePosition} from "@/hook";
import {TButtonVariant} from "@/interfaces/types";


type TProps = {
    location: google.maps.LatLngLiteral | { lat: number, lng: number },
    styles?: SxProps,
    isShowText?: boolean,
    isShowIcon?: boolean,
    variant?: TButtonVariant
}
export const GoogleMapRouteBtn = ({
                                      location,
                                      styles,
                                      isShowText = true,
                                      isShowIcon = true,
                                      variant = 'contained'
                                  }: TProps) => {
    const translate = useTranslate();
    const {position} = usePosition();

    const userPosition: google.maps.LatLngLiteral = {
        lat: position?.lat as number, lng: position?.lng as number
    }
    return (
        <Button
            startIcon={isShowIcon ? <Route/> : <></>}
            variant={variant}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                textTransform: 'inherit',
                width: '100%',
                color: 'common.white',
                backgroundColor: 'common.black',
                transition: '200ms linear',
                "& svg": {
                    color: 'common.white',
                },
                "&:hover": {
                    color: 'common.white',
                    backgroundColor: 'common.black',
                    boxShadow: '0px 0px 3px 1px #f9f9f9'
                },
                ...styles
            }}
            onClick={() => {
                if (location?.lat && location?.lng) {
                    openGoogleMaps({destination: location, userGeo: userPosition})
                }
            }}
        >
            {isShowText && translate('buttons.google.viewRoute')}
        </Button>
    );
};

