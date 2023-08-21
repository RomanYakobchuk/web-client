import {Box, Grid, Skeleton, Typography} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {Link, useNavigate} from "react-router-dom";
import {Typography as TypographyAntd} from "antd";
import {PlaceOutlined} from "@mui/icons-material";
import ScrollContent from "../common/scrollContent";
import {useMobile} from "../../utils";
import {CarouselComponent} from "../index";
import {IPicture} from "../../interfaces/common";

const {Text} = TypographyAntd;
const CountViews = () => {

    const translate = useTranslate();
    const navigate = useNavigate();
    const {layoutWidth, width} = useMobile();


    const {data: dataViews, isLoading: isLoadingViews} = useList<any>({
        resource: "institution/countMoreViews",
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
                    color: (theme: any) => theme.palette.secondary.main
                }}>
                    {translate("home.sortByType.popularPlace")}
                </Typography>
            }
            <Box sx={{
                width: {xs: '80vw', md: layoutWidth - 200},
                margin: '0 auto',
                position: 'relative'
            }}>
                <CarouselComponent>
                    {
                        dataViews?.data?.map((item, index, array) => (
                            <Box key={index} sx={{
                                width: '100%',
                                height: {xs: '150px', md: '200px'},
                                padding: '0 10px',
                                display: 'flex',
                            }}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '20px',
                                        backgroundImage: `url("${item.url}")`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'end',
                                        "& a":{
                                            maxHeight: {xs: '60%', md: '45%'},
                                            height: {xs: '60%', md: '45%'},
                                        }
                                    }}>
                                    <Link
                                        to={`/all_institutions/show/${item?.viewsWith?._id}`}
                                        style={{
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            padding: "10px",
                                            borderRadius: "0 0 20px 20px",
                                            background: "rgba(0, 0, 0, 0.2)",
                                            display: "flex",
                                            flexDirection: "column",
                                            backdropFilter: "blur(4px)",
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: width < 600 ? '16px' : '18px',
                                            fontWeight: 900,
                                            textTransform: 'capitalize'
                                        }}>
                                            {item?.viewsWith?.title}
                                        </Text>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: width < 600 ? '12px' : '14px',
                                            fontWeight: 600
                                        }}>
                                            {translate(`home.sortByType.${item?.viewsWith?.type}`)}
                                        </Text>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}>
                                            <PlaceOutlined sx={{
                                                color: '#fff'
                                            }}/>
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: '12px',
                                                fontWeight: 500
                                            }}>
                                                {item?.viewsWith?.place?.city}
                                            </Text>
                                        </Box>
                                    </Link>
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
