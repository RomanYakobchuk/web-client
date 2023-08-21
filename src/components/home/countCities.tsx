import {Box, Button, Grid, Skeleton, Typography} from "@mui/material";
import {CanAccess, useGetLocale, useList, useTranslate} from "@refinedev/core";
import {Typography as TypographyAntd} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {EditLocationOutlined} from "@mui/icons-material";

import ScrollContent from "../common/scrollContent";
import {useMobile} from "../../utils";

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
            </Typography>
            <ScrollContent>
                <CanAccess action={'cityWithData'} resource={'cities'}>
                    <Button
                        variant={'outlined'}
                        color={'secondary'}
                        onClick={() => navigate('/home/update-city')}
                    >
                        <EditLocationOutlined/>
                    </Button>
                </CanAccess>
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
                                    padding: '10px',
                                }}>
                                <Text style={{
                                    fontSize: width < 600 ? '18px' : '22px',
                                    fontWeight: 900
                                }}>
                                    {
                                        currentLocale === 'ua' ? city.name_ua : city.name_en
                                    }
                                </Text>
                                <Text style={{
                                    fontSize: width < 600 ? '16px' : '18px',
                                    fontWeight: 600
                                }}>
                                    {translate("cities.institutions", {"number": city.institutionCount})}
                                </Text>
                            </Link>
                        ))
                }
            </ScrollContent>
        </Box>
    );
};
export default CountCities
