import {Box, Button, Typography} from "@mui/material";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {DateRange, Money, People, Person, EditNote, EastOutlined, Place} from "@mui/icons-material";
import React, {useContext} from "react";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

import {IReserve, ProfileProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import {TagField} from "@refinedev/mui";

const ReservedCard = ({
                          comment,
                          institution,
                          date,
                          _id,
                          eventType,
                          fullName,
                          whoPay,
                          numberPeople,
                          writeMe,
                          institutionStatus,
                          userStatus,
                          desiredAmount
                      }: IReserve) => {
    const {data: user} = useGetIdentity<ProfileProps>();
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    return (
        <Box sx={{
            width: '100%',
            borderRadius: '10px',
            p: '10px',
            bgcolor: mode === 'light' ? '#fcfcfc' : '#384c5f',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'center',
                    width: '100%',
                    borderBottom: "1px solid silver",
                    paddingBottom: '10px'
                }}>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center'
                        }}
                    >
                        <img
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '10px',
                                objectFit: 'cover'
                            }}
                            src={institution?.mainPhoto}
                            alt={institution?.title}/>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <Typography
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: 600
                                }}
                            >
                                {institution?.title}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '16px'
                                }}
                            >
                                {institution?.type}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center',
                        fontSize: '14px'
                    }}>
                        <Place/>
                        {institution?.place?.city}
                    </Typography>
                </Box>
                {
                    [
                        {
                            value: fullName,
                            icon: <Person/>
                        },
                        {
                            value: dayjs(date).format("DD/MM/YYYY HH:mm"),
                            icon: <DateRange/>
                        },
                        {
                            icon: translate('capl.status.userStatus'),
                            value: userStatus?.value === 'accepted'
                                ?
                                <TagField
                                    style={{
                                        fontSize: '20px',
                                        padding: '7px'
                                    }}
                                    value={translate(`capl.status.${userStatus?.value}`)}
                                    color={"success"}/>
                                : userStatus?.value === 'draft'
                                    ?
                                    <TagField
                                        style={{
                                            fontSize: '20px',
                                            padding: '7px'
                                        }}
                                        value={translate(`capl.status.${userStatus?.value}`)}
                                        color={"info"}/>
                                    : userStatus?.value === 'rejected'
                                        ? <TagField
                                            style={{
                                                fontSize: '20px',
                                                padding: '7px'
                                            }}

                                            value={translate(`capl.status.${userStatus?.value}`)}
                                            color={"error"}/>
                                        : <TagField value={""}
                                                    color={"default"}/>
                        },
                        {
                            icon: translate('capl.status.institutionStatus'),
                            value: institutionStatus?.value === 'accepted'
                                ?
                                <TagField
                                    style={{
                                        fontSize: '20px',
                                        padding: '7px'
                                    }}
                                    value={translate(`capl.status.${institutionStatus?.value}`)}
                                    color={"success"}/>
                                : institutionStatus?.value === 'draft'
                                    ?
                                    <TagField
                                        style={{
                                            fontSize: '20px',
                                            padding: '7px'
                                        }}
                                        value={translate(`capl.status.${institutionStatus?.value}`)}
                                        color={"info"}/>
                                    : institutionStatus?.value === 'rejected'
                                        ? <TagField
                                            style={{
                                                fontSize: '20px',
                                                padding: '7px'
                                            }}

                                            value={translate(`capl.status.${institutionStatus?.value}`)}
                                            color={"error"}/>
                                        : <TagField value={""}
                                                    color={"default"}/>
                        }
                    ]?.map((item, index) => (
                        <Box key={index} sx={{
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 2fr',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            {item.icon}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'end'
                            }}>
                                {item.value}
                            </Box>
                        </Box>
                    ))
                }
            </Box>
            <Button
                sx={{
                    fontSize: {xs: '12px', sm: '14px'},
                    width: '100%',
                    my: 1
                }}
                onClick={() => navigate(`/capl/show/${_id}`)}
                color={"secondary"}
                endIcon={<EastOutlined/>}
                variant={"outlined"}>
                {translate("buttons.details")}
            </Button>
        </Box>
    );
};
export default ReservedCard
