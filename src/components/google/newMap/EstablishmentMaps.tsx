import {useTranslate} from "@refinedev/core";
import {Box, Button, Typography} from "@mui/material";
import {useContext, useMemo, useState} from "react";

import {computeMapZoom, findMidPoint} from "@/components/google/services/services";
import {NewShowMap} from "@/components/google/newMap/newShowMap";
import {Markers} from "@/components/google/newMap/Markers";
import {IEstablishment} from "@/interfaces/common";
import {ModalWindow} from "@/components";
import {useMobile} from "@/hook";
import {MapRounded} from "@mui/icons-material";
import {ControlPosition, MapControl} from "@vis.gl/react-google-maps";
import {EstablishmentDeviceMapList} from "@/components/google/newMap/EstablishmentDeviceMapList";
import {ColorModeContext} from "@/contexts";

export type TValues = {
    coordinate: IEstablishment['location'],
    title?: string,
    rating?: number,
    image?: string,
    key: string
}

type TProps = {
    establishments: IEstablishment[],
}
export const EstablishmentMaps = ({establishments}: TProps) => {

    const {width} = useMobile();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const values: TValues[] = establishments?.length > 0 ? establishments?.map((establishment) => {
        const image = establishment?.pictures?.length > 0 ? establishment?.pictures[0]?.url : '';
        return {
            title: establishment?.title,
            image: image,
            rating: establishment?.rating,
            coordinate: establishment?.location || {lat: 0, lng: 0},
            key: establishment?._id
        }
    }) : [] as TValues[];
    const coordinates = values?.map((value) => value.coordinate);

    const center = findMidPoint({coordinates});
    const zoom = computeMapZoom({coords: center, coordinates});

    const toggleOpenModal = () => {
        if (width < 900) {
            setOpenModal((prevState) => !prevState);
        }
    }
    return (
        <>
            {
                width < 900
                    ? <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url('/images/map_kyiv.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px'
                        }}
                    >
                        <Button
                            startIcon={<MapRounded/>}
                            variant={'contained'}
                            color={mode === 'dark' ? 'secondary' : 'primary'}
                            sx={{
                                bgcolor: '#000',
                                color: '#f9f9f9',
                                textTransform: 'inherit',
                                fontSize: '1rem',
                                borderRadius: '24px',
                                px: 3,
                                py: 1
                            }}
                            onClick={toggleOpenModal}
                        >
                            {translate('text.map.view')}
                        </Button>
                        <ModalWindow
                            timeOut={400}
                            contentProps={{
                                width: '100%',
                                height: '100%',
                                maxWidth: '100%',
                                borderRadius: 0
                            }}
                            open={openModal}
                            setOpen={setOpenModal}
                            title={
                            <Typography
                                variant={'h5'}
                                color={'secondary'}
                            >
                                {translate('establishment.establishment')}
                            </Typography>
                        }
                            bodyProps={{
                                maxWidth: '100%',
                                maxHeight: 'calc(100% - 50px)'
                            }}
                        >
                            <NewShowMap
                                styles={{
                                    borderRadius: '0'
                                }}
                                center={center}
                                zoom={zoom}
                                fullscreenControl={false}
                                streetViewControl={false}
                                zoomControl={false}

                            >
                                {
                                    values?.length > 0 && (
                                        <Markers points={values}/>
                                    )
                                }
                                <MapControl
                                    position={ControlPosition.BOTTOM_CENTER}
                                >
                                    <EstablishmentDeviceMapList
                                        establishments={establishments}/>
                                </MapControl>
                            </NewShowMap>
                        </ModalWindow>
                    </Box> : (
                        <NewShowMap
                            center={center}
                            zoom={zoom}
                        >
                            {
                                values?.length > 0 && (
                                    <Markers points={values}/>
                                )
                            }
                        </NewShowMap>
                    )
            }
        </>
    );
};

