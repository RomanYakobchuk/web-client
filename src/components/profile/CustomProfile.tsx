import {CalendarMonthSharp, Edit, Email, Phone} from "@mui/icons-material";
import {Avatar, Box, IconButton, Typography} from "@mui/material";
import React, {useContext} from "react";
import {usePermissions, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Image} from "antd";


import {ProfileProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import dayjs from "dayjs";
import {useUserInfo} from "@/hook";
import {TabsUserProperties} from "@/components/profile/index";
import {SchemaContext} from "@/settings/schema";


type TProps = {
    user: ProfileProps
}
const CustomProfile = ({user}: TProps) => {

    const {data: role} = usePermissions();
    const {user: currentUser} = useUserInfo();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {schema} = useContext(SchemaContext);
    const translate = useTranslate();

    const {_id, avatar, email, phone, dOB, name} = user;

    return (
        <Box sx={{
            p: 3,
            margin: '0 auto',
            maxWidth: '1400px',
            // "& *":{
            //     color: 'common.white'
            // }
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: {xs: 'column', lg: 'row'},
                gap: {xs: 2, sm: 3, md: 4, xl: 10}
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    position: {lg: 'sticky'},
                    height: 'fit-content',
                    top: {lg: schema === 'schema_1' ? '85px' : '20px'},
                    "& *":{
                        color: 'common.white'
                    }
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 1
                    }}>
                        <Typography fontSize={{xs: '18px', sm: '22px'}} fontWeight={700}
                                    color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                            {translate("profile.profile")}
                        </Typography>
                        <span style={{
                            fontSize: '14px'
                        }}>
                        ({translate(`roles.${user?.status}`)})
                        </span>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            width: {xs: '100%', lg: 'fit-content'},
                            gap: {xs: 2, sm: 4, lg: 2},
                            flexDirection: {xs: 'row', lg: 'column'},
                            justifyContent: {xs: 'center', sm: 'start'},
                            flexWrap: {xs: 'wrap', sm: 'nowrap'},
                            alignItems: {xs: "center", sm: "start"},
                            p: "16px 0"
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: {xs: "100px", sm: '150px', md: '180px'},
                            height: {xs: "100px", sm: '150px', md: '180px'},
                            gap: 3,
                            "& > div > div": {
                                borderRadius: '50%'
                            }
                        }}>
                            {
                                avatar ?
                                    <Image alt={"image"}
                                           preview={{zIndex: 1000, height: '70%'}}
                                           src={avatar}
                                           width={"100%"}
                                           height={"100%"}
                                           style={{
                                               objectFit: "cover",
                                               borderRadius: '50%'
                                           }}/> :
                                    <Avatar sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%'
                                    }}/>
                            }
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Typography
                                    fontSize={{xs: 16, sm: 20, md: 30}}
                                    fontWeight={600}
                                    color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                >
                                    {name}
                                </Typography>
                                <IconButton onClick={(event) => {
                                    event.preventDefault();
                                    navigate((role === 'admin' && currentUser?._id !== user?._id) ? `/profile/edit/${_id}` : '/profile/edit')
                                }}>
                                    <Edit/>
                                </IconButton>
                            </Box>
                            {
                                [
                                    {
                                        icon: <Phone color={'secondary'}/>,
                                        value: phone ? phone.toString() : ""
                                    },
                                    {
                                        icon: <Email color={'secondary'}/>,
                                        value: email
                                    },
                                    {
                                        icon: <CalendarMonthSharp color={'secondary'}/>,
                                        value: dayjs(dOB).format("DD-MM-YYYY")
                                    },
                                ]?.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            "& span": {
                                                fontSize: '14px'
                                            }
                                        }}
                                    >
                                        {item?.icon}
                                        <span style={{
                                            whiteSpace: 'break-spaces'
                                        }}>
                                        {item?.value}
                                    </span>
                                    </Box>
                                ))
                            }
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    width: '100%'
                }}>
                    <TabsUserProperties user={user}/>
                </Box>
            </Box>
        </Box>
    );
}
export default CustomProfile;
