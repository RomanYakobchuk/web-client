import {Box, Button, SxProps} from "@mui/material";
import {useNotification, useTranslate} from "@refinedev/core";
import {ReactNode, useState} from "react";
import {Radar} from "@mui/icons-material";
import {notification} from 'antd';

import CustomDrawer from "../drawer/customDrawer";
import {useMobile} from "@/hook";
import FindNearbyPlaces from "../common/places/findNearbyPlaces";
import {IEstablishment, IColor} from "@/interfaces/common";

type TProps = {
    style?: SxProps,
    showIcon?: boolean
    text?: string,
    icon?: ReactNode,
    showText?: boolean,
    variant?: "text" | "contained" | "outlined",
    location: IEstablishment['location'],
    error?: string | null,
    establishment?: IEstablishment,
    btnColor?: IColor['color']
}

// export const OpenDrawer = 'openDrawer';
// export const OPEN_NEARBY = 'open_nearby_establishment';
const NearbyEstablishmentBtn = ({
                                    showIcon = true,
                                    style,
                                    text,
                                    icon,
                                    showText = true,
                                    variant = 'contained',
                                    location,
                                    error,
                                    establishment,
                                    btnColor = 'info'
                                }: TProps) => {
    const translate = useTranslate();
    const {device, width} = useMobile();
    const {open} = useNotification();
    // const go = useGo();
    // const {params} = useParsed();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const onClick = () => {
        setOpenDrawer((prevState) => !prevState);
    }

    // useEffect(() => {
    //     console.log(searchParams.entries())
    //     console.log(searchParams.keys())
    //     navigate(`?${new URLSearchParams({
    //         openDrawer: JSON.stringify(openDrawer)
    //     })}`)
    // }, [openDrawer, searchParams]);

    // useEffect(() => {
    //     if (searchParams.get(OpenDrawer)) {
    //         const v = !!JSON.parse(searchParams.get(OpenDrawer) as string) as boolean;
    //         setOpenDrawer(v)
    //     }
    // }, [searchParams.get(OpenDrawer)]);

    // useEffect(() => {
    //     console.log(params)
    //     if (params?.openDrawer !== undefined) {
    //         if (typeof params?.openDrawer !== 'boolean' && (params?.openDrawer === 'true' || params?.openDrawer === 'false')) {
    //             const v = params?.openDrawer === 'true';
    //             setOpenDrawer(v)
    //         }
    //     }
    // for (const filter of params?.filters as LogicalFilter[]) {
    //     if (filter?.field === OpenDrawer && filter?.value !== undefined) {
    //         console.log(filter?.value)
    //         if (typeof filter?.value !== 'boolean' && filter?.value === ('true' || 'false')) {
    //             setOpenDrawer(Boolean(filter?.value))
    //         }
    //     }
    // }
    // }, [params?.openDrawer]);

    // useEffect(() => {
    //     go({
    //         query: {
    //             openDrawer: openDrawer,
    //             filters: params?.filters
    //             // filters: [
    //             //     {
    //             //         field: OpenDrawer,
    //             //         value: openDrawer,
    //             //         operator: 'eq'
    //             //     }
    //             // ]
    //         },
    //         type: 'push'
    //     })
    // }, [openDrawer]);
    const handleAccessUserGeolocation = () => {
        window.navigator.geolocation.getCurrentPosition(() => {
        }, (error) => {
            if (error.code) {
                api?.open({
                    type: 'warning',
                    description: 'User denied the request for Geolocation',
                    message: <div> <a target={'_blank'}
                                    href={'https://support.google.com/chrome/answer/142065?hl=en&co=GENIE.Platform%3DDesktop&oco=0'}>Visit
                        here (en)</a> <a target={'_blank'}
                                    href={'https://support.google.com/chrome/answer/142065?hl=uk&co=GENIE.Platform%3DDesktop&oco=0'}>Подивіться тут (ua)</a></div>
                })
                // open?.({
                //     type: 'error',
                //     description: 'https://support.google.com/chrome/answer/142065?hl=en&co=GENIE.Platform%3DDesktop&oco=0'
                // })
            }
        });
    }
    return (
        <>
            {contextHolder}
            <Button
                color={btnColor}
                variant={variant}
                onClick={onClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    textTransform: 'inherit',
                    // "& svg":{
                    //     display: {xs: 'none', sm: 'flex'}
                    // },
                    borderRadius: '7px',
                    // marginTop: {xs: '10px', sm: 0},
                    ...style
                }}
            >
                {showIcon ? (icon ? icon : <Radar/>) : ''}
                {showText ? (text ? text : translate('buttons.nearby')) : ''}
            </Button>
            <CustomDrawer
                open={openDrawer as boolean}
                maxWidth={width < 600 ? '100%' : width < 900 ? '600px' : width < 1500 ? '800px' : '1000px'}
                anchor={device ? "bottom" : "right"}
                title={<Box sx={{
                    display: 'flex',
                    fontSize: {xs: '18px', sm: '22px'},
                    fontWeight: {xs: 600, sm: 700},
                    p: 1
                }}>
                    {translate('buttons.nearby')}
                </Box>}
                contentStyle={{
                    mt: '20px'
                }}
                toggleDrawer={setOpenDrawer}
                isScaleRoot={true}
            >
                {
                    !error ? (openDrawer && location?.lng && location?.lat && (
                            <FindNearbyPlaces
                                setOpenDrawer={setOpenDrawer}
                                establishment={establishment}
                                location={location}
                            />
                        )
                    ) : <Box>
                        {error}
                        {
                            error && (
                                <Button
                                    variant={'contained'}
                                    color={'success'}
                                    sx={{
                                        textTransform: 'inherit'
                                    }}
                                    onClick={handleAccessUserGeolocation}
                                >
                                    Access your geolocation
                                </Button>
                            )
                        }
                    </Box>
                }
            </CustomDrawer>
        </>
    );
};
export default NearbyEstablishmentBtn
