import {Box, CardMedia, Typography} from "@mui/material";
import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {useTranslate} from "@refinedev/core";
import {Place, Star} from "@mui/icons-material";

import {BookMarkButton} from "../../index";
import {PropertyProps} from "../../../interfaces/common";
import {ColorModeContext} from "../../../contexts";
import SharedComponent from "../../common/shared/sharedComponent";

interface IProps {
    establishment: PropertyProps
}

const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;

const Variant2EstablishmentCard = ({establishment}: IProps) => {

    const {_id, type, place, pictures, rating, title, averageCheck, createdBy} = establishment;

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    return (
        <Box sx={{
            width: '100%',
        }}>
            <Link
                style={{
                    textDecoration: 'none',
                    width: '100%'
                }}
                to={`/all_institutions/show/${_id}`}
            >
                <Box sx={{
                    padding: '10px',
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    boxShadow: {xs: 'unset', sm: '0px 0px 3px 0px silver'},
                    bgcolor: 'common.black',
                    borderRadius: {xs: '0', sm: '15px'},
                    width: '100%',
                    gap: 2,
                    color: 'common.white'
                }}>
                    <CardMedia
                        component="img"
                        image={pictures[0].url}
                        alt="card image"
                        sx={{
                            borderRadius: "10px",
                            height: {xs: '200px', sm: '150px', md: '200px'},
                            width: {xs: '100%', sm: '200px', md: '300px'},
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        p: '0 0 10px 0',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5
                            }}>
                                <Typography sx={{
                                    fontSize: {xs: '1.2rem', md: '1.5rem'},
                                    fontWeight: 700
                                }}>
                                    {title}
                                </Typography>
                                <Typography sx={{
                                    color: 'common.black',
                                    bgcolor: 'common.white',
                                    p: '5px 10px',
                                    borderRadius: '7px',
                                    fontWeight: 500,

                                }}>
                                    {translate(`home.create.type.${type}`)}
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <BookMarkButton
                                    id={_id}
                                    bgColor={'transparent'}
                                    color={'common.white'}
                                    type={'institution'}
                                    showText={false}
                                    style={{
                                        p: '5px',
                                        borderRadius: '5px',
                                        minWidth: '20px',
                                        bgcolor: mode === 'dark' ? '#86a8cf' : '#e6f2ff',
                                        "& svg": {
                                            fontSize: {xs: '26px', sm: '30px'}
                                        }
                                    }}
                                />
                                <Box sx={{
                                    backdropFilter: 'blur(20px)',
                                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: '10px'
                                }}>
                                    <SharedComponent
                                        type={'institution'}
                                        color={mode === 'dark' ? '#000' : '#fff'}
                                        url={`${CLIENT_URL}/all_institutions/show/${_id}`}
                                        title={translate('buttons.share')}
                                        isOnlyShared={true}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                fontSize: {xs: '1.5rem', md: '2rem'}
                            }}>
                                <Star sx={{color: 'yellow'}}/>
                                {rating > 0 ? rating?.toFixed(2) : rating}
                                <Box
                                    component={'span'}
                                    sx={{
                                        margin: '0 5px',
                                        fontSize: '14px',
                                        color: 'silver'
                                    }}
                                >
                                    ({establishment?.reviewsLength})
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'start',
                                alignItems: 'center',
                                colro: mode === "dark" ? '#f1e6e6' : "#1d1a39"
                            }}>
                                <Place
                                    sx={{
                                        fontSize: 24,
                                        color: "secondary.main",
                                    }}
                                />
                                <Box sx={{
                                    fontSize: '16px',
                                    display: 'flex',
                                    height: '50px',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {
                                        place?.city
                                    }
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box component={"span"}>
                                    {translate("home.create.averageCheck")}
                                </Box>
                                <Box>
                                    ~ ₴ {averageCheck}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    );
};
export default Variant2EstablishmentCard;
