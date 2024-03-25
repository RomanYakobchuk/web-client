import {Box, Popover, Typography} from "@mui/material";
import {CallMadeSharp, Place} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useTranslate} from "@refinedev/core";
import React, {useContext} from "react";

import {ESTABLISHMENT, SHOW} from "@/config/names";
import {IEstablishment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {TruncateSingleText} from "@/utils";

type TSmallPopoverVariant = {
    establishment: IEstablishment,
    popoverId: string | undefined,
    anchorElPopover: HTMLButtonElement | null,
    handleClosePopover: () => void,
    openPopover: boolean
}
export const SmallPopoverVariant = ({anchorElPopover, openPopover, handleClosePopover, popoverId, establishment}: TSmallPopoverVariant) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    return (
        <Popover
            id={popoverId}
            open={openPopover}
            anchorEl={anchorElPopover}
            onClose={handleClosePopover}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            sx={{
                "& div.MuiPaper-root": {
                    backgroundColor: 'common.black',
                    boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? '#f1f1f1' : '#424242'}`,
                    borderRadius: '7px'
                },
            }}
        >
            <Box sx={{
                width: '300px',
                height: 'fit-content',
                // maxHeight: {xs: '400px', md: '600px', lg: '700px'},
                // overflowY: 'auto',
                display: 'flex',
                p: 2,
                flexDirection: 'column',
                color: 'common.white',
                gap: 1
            }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box
                        sx={{
                            width: 'fit-content',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'start'
                        }}
                    >
                        {
                            establishment?.pictures?.length > 0 && (
                                <Box sx={{
                                    width: {xs: '80px', md: '100px'},
                                    height: {xs: '80px', md: '100px'}
                                }}>
                                    <img
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '10px',
                                            objectFit: 'cover'
                                        }}
                                        src={establishment?.pictures[0]?.url}
                                        alt={establishment?.title}/>
                                </Box>
                            )
                        }
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: {xs: '80px', md: '100px'}
                        }}>
                            <Box
                                sx={{
                                    fontSize: {xs: '16px', md: '18px'},
                                    fontWeight: 600
                                }}
                            >
                                <TruncateSingleText str={establishment?.title} width={'120px'}/>
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    p: '1px 7px',
                                    bgcolor: 'common.white',
                                    width: 'fit-content',
                                    color: 'common.black',
                                    borderRadius: '10px'
                                }}
                            >
                                {translate(`home.sortByType.${establishment?.type}`)}
                            </Typography>
                            {
                                establishment?.place?.city && (
                                    <Typography sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        alignItems: 'end',
                                        fontSize: '14px'
                                    }}>
                                        <Place/>
                                        {establishment?.place?.city}
                                    </Typography>
                                )
                            }
                        </Box>
                    </Box>
                    <Box sx={{
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        bgcolor: 'common.white',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        p: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        "& a": {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        "& svg": {
                            color: 'common.black',
                        }
                    }}>
                        <Link
                            to={`/${ESTABLISHMENT}/${SHOW}/${establishment?._id}`}
                        >
                            <CallMadeSharp/>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Popover>
    );
};

