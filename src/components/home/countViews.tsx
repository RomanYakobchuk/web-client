import {Box, Typography} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {Link} from "react-router-dom";
import {Typography as TypographyAntd} from "antd";
import {CallMade, PlaceOutlined} from "@mui/icons-material";

import {useMobile} from "@/hook";
import {CarouselComponent} from "../index";
import {ESTABLISHMENT, SHOW} from "@/config/names";

const {Text} = TypographyAntd;
const CountViews = () => {

    const translate = useTranslate();
    const {layoutWidth, width} = useMobile();


    const {data: dataViews, isLoading: isLoadingViews} = useList<any>({
        resource: `${ESTABLISHMENT}/countMoreViews`,
    });

    if (dataViews?.data?.length === 0) {
        return null;
    }


    return (
        <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            {
                (dataViews?.total! > 0 || isLoadingViews) &&
                <Typography sx={{
                    fontSize: {xs: '18px', sm: '22px'},
                    fontWeight: 900,
                    mx: 6,
                    color: (theme: any) => theme.palette.secondary.main
                }}>
                    {translate("home.sortByType.popularPlace")}
                </Typography>
            }
            <Box sx={{
                // width: {xs: '80vw', md: `calc(${layoutWidth}px - 160px)`},
                width: {xs: '100vw', md: `${layoutWidth}px`},
                margin: '0',
                position: 'relative'
            }}>
                <CarouselComponent>
                    {
                        dataViews?.data?.map((item, index) => (
                            <Box key={index} sx={{
                                width: '100%',
                                height: {xs: '250px', sm: '350px', lg: '450px', xl: '550px'},
                                // padding: '0 10px',
                                display: 'flex',
                                position: 'relative'
                            }}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        // borderRadius: '10px',
                                        backgroundImage: `url("${item?.url}")`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        margin: '5px',
                                        borderRadius: "15px",
                                        p: '5px 10px',
                                        width: 'fit-content',
                                        background: "rgba(0, 0, 0, 0.2)",
                                        backdropFilter: "blur(4px)",
                                    }}>
                                        <PlaceOutlined sx={{
                                            color: '#fff'
                                        }}/>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: '14px',
                                            fontWeight: 500
                                        }}>
                                            {item?.viewsWith?.place?.city}
                                        </Text>
                                    </Box>
                                    <Link
                                        to={`/${ESTABLISHMENT}/${SHOW}/${item?.viewsWith?._id}`}
                                        style={{
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            padding: "10px",
                                            margin: '10px 5px',
                                            borderRadius: "25px",
                                            background: "rgba(0, 0, 0, 0.2)",
                                            backdropFilter: "blur(4px)",
                                            display: "flex",
                                            width: 'fit-content',
                                            flexDirection: "row",
                                            gap: '16px',
                                            alignItems: 'center'
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: width < 600 ? '14px' : '16px',
                                            fontWeight: 900,
                                            textTransform: 'capitalize'
                                        }}>
                                            {item?.viewsWith?.title}
                                        </Text>
                                        <CallMade sx={{
                                            color: '#fff'
                                        }}/>
                                    </Link>
                                    <Box sx={{
                                        position: 'absolute',
                                        right: {xs: '0px', md: 'unset'},
                                        left: {xs: 'unset', md: '0px'},
                                        bottom: {xs: '10px', md: '60px'},
                                        p: '5px 10px',
                                        bgcolor: 'common.black',
                                        borderRadius: '15px',
                                        "& span": {
                                            color: 'common.white',
                                        }
                                    }}>
                                        <Text style={{
                                            fontSize: width < 600 ? '12px' : '14px',
                                            fontWeight: 600
                                        }}>
                                            {translate(`home.sortByType.${item?.viewsWith?.type}`)}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    }
                </CarouselComponent>
            </Box>
            {/*<ScrollContent>*/}
            {/*    {*/}
            {/*        isLoadingViews*/}
            {/*            ? [1, 2, 3]?.map((item: number) => (*/}
            {/*                <Skeleton*/}
            {/*                    key={item}*/}
            {/*                    sx={{*/}
            {/*                        width: {xs: '300px', sm: '400px'},*/}
            {/*                        height: {xs: '150px', sm: "200px"},*/}
            {/*                        borderRadius: '10px'*/}
            {/*                    }}*/}
            {/*                    animation={"wave"}*/}
            {/*                    variant={"rectangular"}*/}
            {/*                />*/}
            {/*            ))*/}
            {/*            : dataViews?.data?.map((item: any, index) => (*/}
            {/*                <Grid*/}
            {/*                    key={index}*/}
            {/*                    item*/}
            {/*                    sx={{*/}
            {/*                        cursor: 'pointer',*/}
            {/*                        width: {xs: '300px', sm: '400px'},*/}
            {/*                        height: {xs: '150px', sm: "200px"},*/}
            {/*                        borderRadius: '10px',*/}
            {/*                        bgcolor: (theme) => theme.palette.primary.main,*/}
            {/*                        backgroundImage: `url(${item?.viewsWith?.mainPhoto})`,*/}
            {/*                        backgroundPosition: 'center',*/}
            {/*                        backgroundSize: 'cover',*/}

            {/*                    }}>*/}

            {/*                </Grid>*/}
            {/*            ))*/}
            {/*    }*/}
            {/*</ScrollContent>*/}
        </Box>
    );
};
export default CountViews
