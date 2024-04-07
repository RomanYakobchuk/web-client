import {Box, Button, Typography} from "@mui/material";
import {MapRounded} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {useContext, useState} from "react";

import {EstablishmentDeviceMapList} from "@/components/google/newMap/EstablishmentDeviceMapList";
import {LeafletMap} from "@/components/google/LeafletMap/LeafletMap";
import {IEstablishment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {ModalWindow} from "@/components";
import {useMobile} from "@/hook";

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
                            <LeafletMap
                                coordinates={coordinates}
                                items={establishments}
                                styles={{
                                    borderRadius: 0
                                }}
                            >
                                <EstablishmentDeviceMapList
                                    establishments={establishments}/>
                            </LeafletMap>
                        </ModalWindow>
                    </Box> : (
                        <LeafletMap
                            coordinates={coordinates}
                            items={establishments}
                        />
                    )
            }
        </>
    );
};

