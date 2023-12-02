import {Box, IconButton, Skeleton, Typography} from "@mui/material";
import {CanAccess, useGetLocale, useList, useTranslate} from "@refinedev/core";
import {Typography as TypographyAntd} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {Apartment, EditLocationOutlined} from "@mui/icons-material";

import ScrollContent from "../common/scroll/scrollContent";
import {useMobile} from "@/hook";

export interface ICity {
    name_ua: string,
    name_en: string,
    institutionCount: number,
    url: string,
    _id: string
}

const {Text} = TypographyAntd;

const CountCities = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {width, layoutWidth} = useMobile();

    const {data: dataCities, isLoading: isLoadingCities} = useList<any>({
        resource: "institution/countByCity",
    });

    const locale = useGetLocale();
    const currentLocale = locale();


    return (
        <Box sx={{
            display: "flex",
            flexDirection: {xs: 'column', md: 'row'},
            gap: 2,
            width: '100%',
            bgcolor: 'modern.modern_1.main',
            borderRadius: '15px',
            p: '20px',
            "& a": {
                textDecoration: 'none',
                width: {xs: '300px', sm: '400px'},
                height: {xs: '150px', sm: "200px"},
                bgcolor: "silver",
                "& span": {
                    color: 'common.black',
                }
            }
        }}>
            <Box sx={{

            }}>
                <Typography sx={{
                    fontSize: {xs: '18px', sm: '22px'},
                    fontWeight: 900,
                    color: (theme: any) => theme.palette.secondary.main
                }}>
                    {translate("home.sortByType.browseByCity")}
                    <CanAccess action={'cityWithData'} resource={'cities'}>
                        <IconButton
                            color={'secondary'}
                            onClick={() => navigate('/home/update-city')}
                        >
                            <EditLocationOutlined/>
                        </IconButton>
                    </CanAccess>
                </Typography>
                <Box>
                    SOME TEXT
                </Box>
            </Box>
            <ScrollContent
                parentWidth={`calc(${layoutWidth}px - 10vw - 40px)`}
            >
                {
                    isLoadingCities
                        ? [1, 2, 3, 4]?.map((item: number) => (
                            <Skeleton
                                key={item}
                                sx={{
                                    width: {xs: '300px', sm: '400px'},
                                    height: {xs: '150px', sm: "200px"},
                                    borderRadius: '10px'
                                }}
                                animation={"wave"}
                                variant={"rectangular"}
                            />
                        ))
                        :
                        dataCities?.data?.sort((a: ICity, b: ICity) => {
                            return a.institutionCount > b.institutionCount ? -1 : 1
                        })?.map((city: ICity, index) => (
                            <Link
                                to={`/all_institutions?pageSize=10&current=1&sorters[0][field]=&sorters[0][order]=asc&filters[0][field]=city&filters[0][operator]=contains&filters[0][value]=${city?.name_ua}`}
                                key={index}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    backgroundImage: `url("${city.url}")`,
                                    backgroundSize: 'cover',
                                    display: 'flex',
                                    backgroundPosition: 'center',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 'fit-content',
                                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: '20px',
                                    p: '5px 15px',
                                    m: '10px'
                                }}>
                                    <Text style={{
                                        fontSize: width < 600 ? '16px' : '20px',
                                        fontWeight: 900,
                                        color: '#fff',
                                    }}>
                                        {
                                            currentLocale === 'ua' ? city.name_ua : city.name_en
                                        }
                                    </Text>
                                </Box>
                                <Box sx={{
                                    width: 'fit-content',
                                    padding: '7px 20px 7px 10px',
                                    m: '10px',
                                    borderRadius: '20px',
                                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                    alignItems: 'baseline'
                                }}>
                                    <Text style={{
                                        fontSize: width < 600 ? '16px' : '18px',
                                        fontWeight: 600,
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}>
                                        <Apartment/>
                                        {city.institutionCount}
                                        {/*{translate("cities.institutions", {"number": city.institutionCount})}*/}
                                    </Text>
                                </Box>
                            </Link>
                        ))
                }
            </ScrollContent>
        </Box>
    );
};
export default CountCities
