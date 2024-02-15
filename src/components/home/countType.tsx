import {Box, Paper, Skeleton} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {Link} from "react-router-dom";
import {Typography as TypographyAntd} from "antd";
import {useContext} from "react";
import {LocalCafe, Restaurant, WineBar} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

import {ColorModeContext} from "@/contexts";
import {useMobile} from "@/hook";
import {ESTABLISHMENT} from "@/config/names";

const {Text} = TypographyAntd;
const CountType = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {i18n} = useTranslation();
    const {width} = useMobile();

    const {data: dataTypes, isLoading: isLoadingTypes} = useList<any>({
        resource: `${ESTABLISHMENT}/countByType`,
    });
    const items = [
        {
            title: 'restaurant',
            icon: <Restaurant/>
        },
        {
            title: 'bar',
            icon: <WineBar/>
        },
        {
            title: 'cafe',
            icon: <LocalCafe/>
        }
    ];

    const mergeData = dataTypes?.data?.map((res) => {
        const item = items?.find((item) => item?.title === res?.type);
        if (item) {
            return {
                ...res,
                ...item
            }
        }
        return res;
    })
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: 'wrap',
                maxWidth: {xs: '100%', lg: i18n?.language === 'ua' ? '260px' : '310px'},
                gap: 3,
                width: {xs: '100%'},
                margin: {xs: '0 auto', lg: 'unset'},
                color: 'color.black',
                bgcolor: 'modern.modern_1.main',
                p: '20px',
                borderRadius: '15px',
                transition: '300ms linear',
                justifyContent: 'center',
                "& a": {
                    textDecoration: 'none',
                    bgcolor: 'common.black',
                    "&:hover": {
                        bgcolor: 'info.main',
                        "& div.countType_open_btn": {
                            bgcolor: 'common.black'
                        }
                    }
                }
            }}>
            {
                isLoadingTypes
                    ? [1, 2, 3]?.map((item: number) => (
                        <Skeleton
                            key={item}
                            sx={{
                                width: '100%',
                                height: '75px',
                                borderRadius: '10px',
                                flex: '1 0 200px',
                                padding: '10px',
                                paddingRight: '20px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: '32px',
                                alignItems: 'center',
                            }}
                            animation={"wave"}
                            variant={"rectangular"}
                        />
                    ))
                    : mergeData?.sort((a, b) => a?.count > b?.count ? -1 : 1)?.map((item, index) => (
                        <Paper
                            elevation={3}
                            key={index}
                            sx={{
                                cursor: 'pointer',
                                width: '100%',
                                flex: '1 0 200px',
                                maxWidth: '300px',
                                borderRadius: '10px',
                            }}
                        >
                            <Link
                                to={`/${ESTABLISHMENT}?pageSize=10&current=1&sorters[0][field]=createdAt_asc&sorters[0][order]=desc&filters[0][field]=propertyType&filters[0][operator]=eq&filters[0][value]=${item?.title}`}
                                style={{
                                    borderRadius: '10px',
                                    width: '100%',
                                    padding: '10px',
                                    paddingRight: '20px',
                                    // backgroundImage: `url(images/${type}.jpg)`,
                                    // backgroundSize: 'cover',
                                    // backgroundPosition: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    gap: '32px',
                                    alignItems: 'center',
                                    transition: '300ms linear',
                                }}>
                                <Box
                                    className={'countType_open_btn'}
                                    sx={{
                                        color: 'common.white',
                                        p: '10px',
                                        bgcolor: 'info.main',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '10px',
                                        "& svg": {
                                            width: '30px',
                                            height: '30px',
                                        },
                                    }}>
                                    {item?.icon}
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // gap: 1,
                                    justifyContent: 'center',
                                    alignItems: 'start',
                                    "& span": {
                                        color: 'common.white'
                                    }
                                }}>
                                    <Text style={{
                                        fontSize: width < 600 ? '14px' : '18px',
                                        fontWeight: 900
                                    }}>
                                        {translate(`home.sortByType.${item?.title}`)}
                                    </Text>
                                    <Text style={{
                                        fontSize: width < 600 ? '12px' : '16px',
                                        fontWeight: 600
                                    }}>
                                        {translate("cities.establishments", {"number": item?.count})}
                                    </Text>
                                </Box>
                            </Link>
                        </Paper>
                    ))
            }
        </Box>
    );
};
export default CountType
