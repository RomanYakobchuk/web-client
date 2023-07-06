import {DateRange, Edit, Email, HourglassBottom, Phone, Public} from "@mui/icons-material";
import {Avatar, Box, Button, Grid, Stack, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Image} from "antd";


import {ProfileProps, PropertyProps} from "interfaces/common";
import InstitutionCard from "../institution/utills/InstitutionCard";
import {CustomButton, UserInstitutions, UserReviews, UserComments} from "../index";
import {ColorModeContext} from "../../contexts";
import CustomAccordion from "./customAccordion";
import dayjs from "dayjs";
import CommentCard from "../institution/utills/commentCard";
import TitleTextItem from "./TitleTextItem";
import CommentsList from "./comments-list";


const CustomProfile = ({
                           name,
                           avatar,
                           email,
                           phone,
                           _id,
                           dOB,
                           phoneVerify,
                           status,
                           allInstitutions,
                           isActivated,
                           favoritePlaces: places,
                           myReviews,
                       }: ProfileProps) => {

    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const [favoritePlaces, setFavoritePlaces] = useState([]);

    useEffect(() => {
        setFavoritePlaces(places)
    }, [places])

    return (
        <Box>
            <Typography fontSize={{xs: '18px', sm: '22px'}} fontWeight={700}
                        color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                {translate("profile.profile")}
            </Typography>
            <Box mt={{xs: '10px', sm: '20px'}} borderRadius="15px" padding="10px"
                 bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {xs: 'column', sm: 'row'},
                        gap: 2.5,
                    }}
                >
                    <Box
                         sx={{
                             display: 'flex',
                             width: {xs: '100%', sm: 'auto'},
                             gap: 2,
                             flexDirection:{xs: 'row', sm: 'column'},
                             justifyContent: {xs: 'center', sm: 'auto'},
                             alignItems: {xs: "center", sm: "start"},

                         }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: {xs: "120px", sm: '150px', md: '220px', lg: "300px"},
                            height: {xs: "120px", sm: '150px', md: '220px', lg: "300px"},
                            gap: 3
                        }}>
                            {
                                avatar ?
                                    <Image alt={"image"}
                                           preview={{zIndex: 10000, height: '70%'}}
                                           src={avatar}
                                           width={"100%"}
                                           height={"100%"}
                                           style={{
                                               objectFit: "cover",
                                               borderRadius: '5px'
                                           }}/> :
                                    <Avatar sx={{
                                        width: {xs: "140px", md: "340px"},
                                        height: {xs: "130px", md: "320px"},
                                        borderRadius: '5px'
                                    }}/>
                            }
                        </Box>
                        <Box sx={{
                            display: {xs: 'block', lg: 'none'},
                            ml: {xs: 6, sm: 0},
                        }}>
                            <Stack direction="row" justifyContent={"space-between"}>
                                <Box display={"flex"} flexDirection={"column"}>
                                    <Typography
                                        fontSize={{xs: 16, md: 20}}
                                        fontWeight={600}
                                        color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                    >
                                        {name}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                    <Box
                        flex={1}
                    >
                        <Box
                            flex={1}
                            display="flex"
                            flexDirection={{xs: "column", md: "row"}}
                            gap="20px"
                        >
                            <Box
                                flex={1}
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                gap="20px"
                            >
                                <Stack direction="column" gap="20px">
                                    <Grid
                                        container
                                        spacing={2}
                                    >
                                        {
                                            [
                                                {
                                                    title: <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        gap: 0.5,
                                                        alignItems: 'center'
                                                    }}>
                                                        {translate("profile.edit.phone")}
                                                        <Phone color={'secondary'}/>
                                                    </Box>,
                                                    value: phone ? phone.toString() : ""
                                                },
                                                {
                                                    title: <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        gap: 0.5,
                                                        alignItems: 'center'
                                                    }}>
                                                        {translate("profile.email")}
                                                        <Email color={'secondary'}/>
                                                    </Box>,
                                                    value: email
                                                },
                                                {
                                                    title: <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        gap: 0.5,
                                                        alignItems: 'center'
                                                    }}>
                                                        {translate("profile.edit.dOB")}
                                                        <Email color={'secondary'}/>
                                                    </Box>,
                                                    value: dayjs(dOB).format("DD-MM-YYYY")
                                                },
                                                {
                                                    title: <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            gap: 2,
                                                            fontSize: '22px',
                                                            alignItems: 'center',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {translate("profile.edit.title")}
                                                        <Edit/>
                                                    </Box>,
                                                    bgColor: '#f36429',
                                                    onClick: () => {
                                                        navigate(
                                                            `/profile/edit/${_id}`
                                                        )
                                                    }
                                                }
                                            ].map((item, index) => (
                                                <Grid
                                                    key={index}
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    lg={4}
                                                >
                                                    <TitleTextItem
                                                        title={item.title}
                                                        value={item.value}
                                                        bgColor={item?.bgColor}
                                                        onClick={item?.onClick}
                                                    />
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Stack>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: {xs: 'none', lg: 'block'},
                            width: '100%'
                        }}>
                            <Stack direction="row" justifyContent={"space-between"}>
                                <Box display={"flex"} flexDirection={"column"}>
                                    <Typography
                                        fontSize={{xs: 16, md: 20}}
                                        fontWeight={600}
                                        color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                    >
                                        {name}
                                    </Typography>
                                </Box>
                            </Stack>
                            {/*    <CustomButton*/}
                            {/*        fullWidth*/}
                            {/*        title={translate("profile.edit.title")}*/}
                            {/*        backgroundColor="#475BE8"*/}
                            {/*        color="#FCFCFC"*/}
                            {/*        icon={*/}
                            {/*            <Edit/>*/}
                            {/*        }*/}
                            {/*        handleClick={() => {*/}
                            {/*            navigate(*/}
                            {/*                `/profile/edit/${_id}`*/}
                            {/*            )*/}
                            {/*        }}*/}
                            {/*    />*/}
                        </Box>
                    </Box>
                </Box>
            </Box>
            {
                allInstitutions?.length > 0 && (
                    <CustomAccordion title={translate("profile.my_places")}
                                     id={allInstitutions[0]}>
                        <UserInstitutions id={_id}/>
                    </CustomAccordion>
                )
            }
            {
                favoritePlaces?.length > 0 && (
                    <CustomAccordion title={translate("profile.my_fav_places", {"length": favoritePlaces?.length})}
                                     id={"favorite_places"}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2.5,
                                width: '100%'
                            }}
                        >
                            {favoritePlaces?.map((property: PropertyProps) => (
                                <InstitutionCard
                                    otherProps={setFavoritePlaces}
                                    key={property?._id}
                                    institution={property}
                                />
                            ))}
                        </Box>
                    </CustomAccordion>
                )
            }
            {
                myReviews?.length > 0 && (
                    <CustomAccordion title={translate("profile.my_reviews", {"length": myReviews?.length})}
                                     id={"my_reviews"}>
                        <Box>

                        </Box>
                    </CustomAccordion>
                )
            }
            <CustomAccordion title={translate("profile.my_comments")}
                             id={"my_comments"}>
                <CommentsList
                    id={_id} type={"allByUserId"}
                    setParent={() => {}}
                    setIsAnswer={() => {}}
                />
            </CustomAccordion>
        </Box>
    )
        ;
}
export default CustomProfile;
