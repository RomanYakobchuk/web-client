import {IEstablishment} from "@/interfaces/common";
import {useTranslate} from "@refinedev/core";
import {useContext} from "react";
import {ColorModeContext} from "@/contexts";
import {Box, Popover, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {ESTABLISHMENT, SHOW} from "@/config/names";
import {East} from "@mui/icons-material";

type TBigPopoverVariant = {
    establishment: IEstablishment,
    popoverId: string | undefined,
    anchorElPopover: HTMLButtonElement | null,
    handleClosePopover: () => void,
    openPopover: boolean
}
export const BigPopoverVariant = ({
                               popoverId,
                               openPopover,
                               establishment,
                               anchorElPopover,
                               handleClosePopover
                           }: TBigPopoverVariant) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    return (
        <Popover
            id={popoverId}
            open={openPopover}
            anchorEl={anchorElPopover}
            onClose={handleClosePopover}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            sx={{
                "& div.MuiPaper-root": {
                    backgroundColor: 'modern.modern_2.second',
                    boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? '#f1f1f1' : '#424242'}`,
                    borderRadius: '10px'
                },
                // "& div.MuiPaper-root-MuiPopover-paper": {
                // }
            }}
        >
            <Box sx={{
                p: 1.5,
                width: '100%',
                maxWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                "& a": {
                    color: '#fff',
                    bgcolor: 'info.main',
                    transition: '200ms linear',
                    "&:hover": {
                        bgcolor: 'modern.modern_1.second',
                    }
                }
            }}>
                {
                    establishment?._id && (
                        <>
                            {
                                establishment?.pictures?.length > 0 && (
                                    <Box sx={{
                                        width: '100%',
                                        height: '200px',
                                        "& img": {
                                            borderRadius: '7px',
                                            objectFit: 'cover'
                                        }
                                    }}>
                                        <img
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                            src={establishment?.pictures[0]?.url}
                                            alt={establishment?.pictures[0]?.name}
                                        />
                                    </Box>
                                )
                            }
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'end',
                                gap: 2,
                                width: '100%',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap'
                            }}>
                                <Typography variant={'h5'} sx={{
                                    fontSize: '20px',
                                    whiteSpace: 'break-spaces',
                                    color: 'common.white'
                                }}>
                                    {establishment?.title}
                                </Typography>
                                <Box sx={{
                                    bgcolor: 'common.white',
                                    color: 'common.black',
                                    p: '3px 10px',
                                    borderRadius: '10px'
                                }}>
                                    {translate(`home.create.type.${establishment?.type}`)}
                                </Box>
                            </Box>
                            <Link
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    margin: '10px 0',
                                    width: '100%',
                                    justifyContent: 'center',
                                    padding: '10px',
                                    borderRadius: '10px'
                                }}
                                to={`/${ESTABLISHMENT}/${SHOW}/${establishment?._id}`}
                            >
                                {translate('home.one')}
                                <East/>
                            </Link>
                        </>
                    )
                }
            </Box>
        </Popover>
    )
}