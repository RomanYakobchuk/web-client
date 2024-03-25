import {DateRange, Person, EastOutlined} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Box, Button} from "@mui/material";
import React, {useContext} from "react";
import dayjs from "dayjs";

import {EstablishmentPopoverBtn} from "@/components/buttons/establishmentPopover/EstablishmentPopoverBtn";
import RenderTag from "@/components/common/statusTagRender";
import {IReserve} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useUserInfo} from "@/hook";

interface IProps {
    reserve: IReserve
}

const ReservedCard = ({reserve}: IProps) => {

    const {
        establishment,
        date,
        _id,
        fullName,
        establishmentStatus,
        userStatus,
        isActive,
        isClientAppeared
    } = reserve;

    const {user} = useUserInfo();
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);

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
            boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)`,
            transition: '200ms ease-in-out',
            "&:hover": {
                boxShadow: `0px 0px 10px 3px ${mode === 'dark' ? '#f9f9f9' : 'rgba(121, 121, 121, 1)'}`,
            }
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
                                {translate('capl.status.userStatus.title')}
                            </span>
                            <RenderTag value={userStatus?.value}/>
                        </div>
                        <div>
                            <span style={{
                                color: 'common.white',
                                fontWeight: 600,
                                fontSize: '16px'
                            }}>
                                {translate('capl.status.establishmentStatus.title')}
                            </span>
                            <RenderTag value={establishmentStatus?.value}/>
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
                <EstablishmentPopoverBtn
                    btnVariant={'outlined'}
                    variantPopover={'small'}
                    isShowIcon={false}
                    establishment={establishment}/>
                <Button
                    sx={{
                        width: 'fit-content',
                        textTransform: 'inherit',
                        borderRadius: '7px',
                        // color: 'common.black'
                    }}
                    onClick={() => navigate(`/capl/show/${_id}`)}
                    color={"secondary"}
                    endIcon={<EastOutlined/>}
                    variant={"text"}>
                    {translate("buttons.details")}
                </Button>
            </Box>
        </Box>
    );
};
export default ReservedCard
