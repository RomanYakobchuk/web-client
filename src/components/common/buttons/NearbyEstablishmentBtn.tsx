import {Box, Button, SxProps} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {ReactNode, useState} from "react";
import {Radar} from "@mui/icons-material";

import CustomDrawer from "../custom/customDrawer";
import {useMobile} from "../../../hook";
import FindNearbyPlaces from "../places/findNearbyPlaces";
import {PropertyProps} from "../../../interfaces/common";

type TProps = {
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
                                    establishment
                                }: TProps) => {
    const translate = useTranslate();
    const {device} = useMobile();
    // const go = useGo();
    // const {params} = useParsed();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

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
    return (
        <>
            <Button
                variant={variant}
                onClick={onClick}
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
            <CustomDrawer
                open={openDrawer as boolean}
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
                    </Box>
                }
            </CustomDrawer>
        </>
    );
};
export default NearbyEstablishmentBtn