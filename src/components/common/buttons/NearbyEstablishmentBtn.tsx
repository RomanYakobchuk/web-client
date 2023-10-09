import {Box, Button, SxProps} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Radar} from "@mui/icons-material";
import {useNavigate, useSearchParams} from "react-router-dom";

import CustomDrawer from "../custom/customDrawer";
import {useMobile} from "../../../hook";
import FindNearbyPlaces, {INearbyF} from "../places/findNearbyPlaces";
import {PropertyProps} from "../../../interfaces/common";

interface IProps {
    style?: SxProps,
    showIcon?: boolean
    text?: string,
    icon?: ReactNode,
    showText?: boolean,
    variant?: "text" | "contained" | "outlined",
    location: PropertyProps['location'],
    error?: string | null,
    establishment?: PropertyProps
}

export const OPEN_NEARBY = 'open_nearby_establishment';
const NearbyEstablishmentBtn = ({
                                    showIcon = true,
                                    style,
                                    text,
                                    icon,
                                    showText = true,
                                    variant = 'contained',
                                    location,
                                    error,
                                    establishment
                                }: IProps) => {
    const translate = useTranslate();
    const {device} = useMobile();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [nearbyParsed, setNearbyParsed] = useState<INearbyF>({} as INearbyF);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    useEffect(() => {
        const s = searchParams.get(OPEN_NEARBY);
        if (s) {
            setNearbyParsed(JSON.parse(s as string) as INearbyF)
        } else {
            setNearbyParsed({} as INearbyF)
        }
    }, [searchParams.get(OPEN_NEARBY)]);
    const onClick = (value: boolean) => {
        const prevSearch = searchParams.toString();
        setOpenDrawer(value);
        if (value) {
            console.log('set true nearby')
            searchParams.set(OPEN_NEARBY, JSON.stringify({
                openDrawer: value
            } as INearbyF))
        } else {
            navigate(-1)
        }
        if (prevSearch !== searchParams.toString()) {
            setSearchParams(searchParams)
        }
    }

    useEffect(() => {
        const prevSearchParams = searchParams.toString();

        if (!nearbyParsed?.openDrawer) {
            console.log('delete nearby in btn')
            setOpenDrawer(false)
            navigate(-1)
        } else {
            console.log('set open true')
            setOpenDrawer(true)
            searchParams.set(OPEN_NEARBY, JSON.stringify({
                ...nearbyParsed,
                openDrawer: true
            } as INearbyF))
        }

        if (prevSearchParams !== searchParams.toString()) {
            setSearchParams(searchParams)
        }
    }, [nearbyParsed]);


    return (
        <>
            <Button
                variant={variant}
                onClick={() => onClick(true)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    textTransform: 'inherit',
                    marginTop: {xs: '10px', sm: 0},
                    ...style
                }}
            >
                {showIcon ? (icon ? icon : <Radar/>) : ''}
                {showText ? (text ? text : translate('buttons.nearby')) : ''}
            </Button>
            {
                openDrawer && (
                    <></>
                )
            }
            <CustomDrawer
                open={openDrawer as boolean}
                anchor={device ? "bottom" : "right"}
                title={<Box sx={{
                    display: 'flex',
                    fontSize: {xs: '18px', sm: '22px'},
                    fontWeight: {xs: 600, sm: 700}
                }}>
                    {translate('buttons.nearby')}
                </Box>}
                toggleDrawer={onClick as Dispatch<SetStateAction<boolean>>}
            >
                {
                    !error ? (openDrawer && location?.lng && location?.lat && (
                            <FindNearbyPlaces
                                establishment={establishment}
                                location={location}
                            />
                        )
                    ) : <Box>
                        {error}
                    </Box>
                }
            </CustomDrawer>
        </>
    );
};
export default NearbyEstablishmentBtn
