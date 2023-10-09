import {Box, Button, Grid, IconButton, Skeleton, Typography} from "@mui/material";
import {CanAccess, useGetLocale, useList, useTranslate} from "@refinedev/core";
import {Typography as TypographyAntd} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {EditLocationOutlined} from "@mui/icons-material";

import ScrollContent from "../common/scrollContent";
import {useMobile} from "../../hook";

interface ICity {
    name_ua: string,
    name_en: string,
    institutionCount: number,
    url: string
}

const {Text} = TypographyAntd;

const CountCities = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {width} = useMobile();

    const {data: dataCities, isLoading: isLoadingCities} = useList<any>({
        resource: "institution/countByCity",
    });

    const locale = useGetLocale();
    const currentLocale = locale();

    return (
        <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            width: '100%',
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
            <ScrollContent>
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
                                    justifyContent: 'end',
                                }}>
                                <Box sx={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '0 0 10px 10px',
                                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                    alignItems: 'baseline'
                                }}>
                                    <Text style={{
                                        fontSize: width < 600 ? '18px' : '22px',
                                        fontWeight: 900,
                                        color: '#fff',
                                    }}>
                                        {
                                            currentLocale === 'ua' ? city.name_ua : city.name_en
                                        }
                                    </Text>
                                    <Text style={{
                                        fontSize: width < 600 ? '16px' : '18px',
                                        fontWeight: 600,
                                        color: '#fff',
                                    }}>
                                        {translate("cities.institutions", {"number": city.institutionCount})}
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
