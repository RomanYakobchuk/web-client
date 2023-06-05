import {Box, Button, Grid, Skeleton} from "@mui/material";
import {CanAccess, useList, useTranslate} from "@refinedev/core";
import {Typography as TypographyAntd} from "antd";
import ScrollContent from "../common/scrollContent";
import {useNavigate} from "react-router-dom";
import {EditLocationOutlined} from "@mui/icons-material";

const {Text} = TypographyAntd;

const CountCities = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const {data: dataCities, isLoading: isLoadingCities} = useList<any>({
        resource: "institution/countByCity?cities=київ,харків,львів,одеса",
    });

    return (
        <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <ScrollContent id={'countCities'}>
                <CanAccess action={'cityWithData'} resource={'cities'}>
                    <Button
                        variant={'outlined'}
                        color={'secondary'}
                        onClick={() => navigate('/home/update-city')}
                    >
                        <EditLocationOutlined />
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
                        : [{
                            name: 'kyiv',
                            value: dataCities?.data[0] ?? 0,
                            search_value: 'київ'
                        }, {
                            name: 'odesa',
                            value: dataCities?.data[1] ?? 0,
                            search_value: 'одеса'
                        }, {
                            name: 'kharkiv',
                            value: dataCities?.data[2] ?? 0,
                            search_value: 'харків'
                        }, {
                            name: 'lviv',
                            value: dataCities?.data[3] ?? 0,
                            search_value: 'львів'
                        }]?.map((city: any, index) => (
                            <Grid key={index}
                                  onClick={() => {
                                      console.log(city)
                                      navigate(`/all_institutions?pageSize=10&current=1&sorters[0][field]=&sorters[0][order]=asc&filters[0][field]=averageCheck&filters[0][operator]=lte&filters[0][value]=2000&filters[1][field]=averageCheck&filters[1][operator]=gte&filters[1][value]=20&filters[2][field]=tag&filters[2][value]=&filters[2][operator]=contains&filters[3][field]=title&filters[3][value]=&filters[3][operator]=contains&filters[4][field]=propertyType&filters[4][operator]=eq&filters[4][value]=&filters[5][field]=city&filters[5][operator]=contains&filters[5][value]=${city?.search_value}`)
                                  }}
                                  item
                                  sx={{
                                      cursor: 'pointer',
                                      width: {xs: '300px', sm: '400px'},
                                      height: {xs: '150px', sm: "200px"},
                                      borderRadius: '10px',
                                      bgcolor: (theme) => theme.palette.primary.main,
                                      backgroundImage: `url(images/${city.name}.jpg)`,
                                      backgroundSize: 'cover',
                                      display: 'flex',
                                      backgroundPosition: 'center',
                                      flexDirection: 'column',
                                      justifyContent: 'end',
                                      p: '10px'
                                  }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: '22px',
                                    fontWeight: 900
                                }}>
                                    {translate(`cities.${city.name}`)}
                                </Text>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: '18px',
                                    fontWeight: 600
                                }}>
                                    {translate("cities.institutions", {"number": city.value})}
                                </Text>
                            </Grid>
                        ))
                }
            </ScrollContent>
        </Box>
    );
};
export default CountCities
