import {Box, Button, Popover, Typography} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {DateRange, Person, EastOutlined, Place, CallMadeSharp} from "@mui/icons-material";
import React, {MouseEvent, useContext, useState} from "react";
import dayjs from "dayjs";
import {Link, useNavigate} from "react-router-dom";

import {IReserve} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useUserInfo} from "@/hook";
import RenderTag from "@/components/common/statusTagRender";

interface IProps {
    reserve: IReserve
}

const ReservedCard = ({reserve}: IProps) => {

    const {
        institution,
        date,
        _id,
        fullName,
        institutionStatus,
        userStatus,
        isActive,
        isClientAppeared
    } = reserve;

    const {user} = useUserInfo();
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);


    const [anchorElPopover, setAnchorElPopover] = useState<HTMLButtonElement | null>(null);

    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorElPopover(event.currentTarget);
    }
    const handleClosePopover = () => {
        setAnchorElPopover(null);
    }
    const openPopover = Boolean(anchorElPopover);
    const popoverId = openPopover ? 'reservation_popover_info' : undefined;


    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            p: '7px',
            gap: 2,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: mode === 'light' ? '#fcfcfc' : '#191a1c',
            boxShadow: '0px 0px 2px 0px silver'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: 'start'
            }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    gap: 2,
                    fontSize: '15px',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        gap: 2,
                        "& div": {
                            display: 'flex',
                            alignItems: 'end',
                            gap: 1,
                        },
                        "& svg": {
                            fontSize: '1.6rem',
                            color: 'common.white'
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <div>
                                <Person/>
                                {fullName}
                            </div>
                            <Box sx={{
                                p: '3px 10px',
                                bgcolor: isActive ? '#00be65' : '#ff6464',
                                color: '#010101',
                                borderRadius: '10px'
                            }}>
                                {translate(`capl.status.valid.${isActive ? 'active' : 'inactive'}`)}
                            </Box>
                        </Box>
                        <div>
                            <DateRange/>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                fontSize: '15px'
                            }}>
                                {dayjs(date)?.fromNow()}
                                {' ' + ' '}
                                {dayjs(date)?.format('DD/MM/YYYY HH:mm')}
                            </div>

                        </div>
                    </Box>
                    <Box sx={{
                        width: 'fit-content',
                        maxWidth: 'calc(100% - 8px)', display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        "& div": {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'space-between'
                        }
                    }}>
                        <div>
                            <span style={{
                                color: 'common.white',
                                fontWeight: 600,
                                fontSize: '16px'
                            }}>
                                {translate('capl.status.userStatus')}
                            </span>
                            <RenderTag value={userStatus?.value}/>
                        </div>
                        <div>
                            <span style={{
                                color: 'common.white',
                                fontWeight: 600,
                                fontSize: '16px'
                            }}>
                                {translate('capl.status.institutionStatus')}
                            </span>
                            <RenderTag value={institutionStatus?.value}/>
                        </div>
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Button
                    color={'info'}
                    variant={'outlined'}
                    sx={{
                        textTransform: 'inherit',
                        borderRadius: '7px'
                    }}
                    onClick={handleClickPopover}
                >
                    {translate('home.one')}
                </Button>
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
                        overflowY: 'auto',
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
                                    institution?.pictures?.length > 0 && (
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
                                                src={institution?.pictures[0]?.url}
                                                alt={institution?.title}/>
                                        </Box>
                                    )
                                }
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: {xs: '80px', md: '100px'}
                                }}>
                                    <Typography
                                        sx={{
                                            fontSize: {xs: '16px', md: '18px'},
                                            fontWeight: 600
                                        }}
                                    >
                                        {institution?.title}
                                    </Typography>
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
                                        {translate(`home.sortByType.${institution?.type}`)}
                                    </Typography>
                                    {
                                        institution?.place?.city && (
                                            <Typography sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: 1,
                                                alignItems: 'end',
                                                fontSize: '14px'
                                            }}>
                                                <Place/>
                                                {institution?.place?.city}
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
                                "& a":{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                "& svg": {
                                    color: 'common.black',
                                }
                            }}>
                                <Link
                                    to={`/all_institutions/show/${institution?._id}`}
                                >
                                    <CallMadeSharp/>
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Popover>
                <Button
                    sx={{
                        width: 'fit-content',
                        textTransform: 'inherit',
                        borderRadius: '7px',
                        color: 'common.black'
                    }}
                    onClick={() => navigate(`/capl/show/${_id}`)}
                    color={"secondary"}
                    endIcon={<EastOutlined/>}
                    variant={"contained"}>
                    {translate("buttons.details")}
                </Button>
            </Box>
        </Box>
    );
};
export default ReservedCard
