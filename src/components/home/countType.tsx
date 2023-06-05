import {Box, Grid, Skeleton, Typography} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Typography as TypographyAntd} from "antd";
import ScrollContent from "../common/scrollContent";

const {Text} = TypographyAntd;
const CountType = () => {

    const translate = useTranslate();
    const navigate = useNavigate();

    const {data: dataTypes, isLoading: isLoadingTypes} = useList<any>({
        resource: "institution/countByType",
    });
    return (
        <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <Typography sx={{
                fontSize: '22px',
                fontWeight: 900,
                color: (theme: any) => theme.palette.secondary.main
            }}>
                {translate("home.sortByType.browse")}
            </Typography>
            <ScrollContent id={'countTypes'}>
                {
                    isLoadingTypes
                        ? [1, 2, 3]?.map((item: number) => (
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
                        : ['cafe', 'bar', 'restaurant']?.map((type: string, index) => (
                            <Grid
                                onClick={() => navigate(`/all_institutions?pageSize=10&current=1&sorters[0][field]=createdAt_asc&sorters[0][order]=desc&filters[0][field]=propertyType&filters[0][operator]=eq&filters[0][value]=${type}`)}
                                key={index}
                                item
                                sx={{
                                    cursor: 'pointer',
                                    width: {xs: '300px', sm: '400px'},
                                    height: {xs: '150px', sm: "200px"},
                                    borderRadius: '10px',
                                    bgcolor: (theme) => theme.palette.primary.main,
                                    backgroundImage: `url(images/${type}.jpg)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'end',
                                    p: '10px'
                                }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: '22px',
                                    fontWeight: 900
                                }}>
                                    {translate(`home.sortByType.${type}`)}
                                </Text>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: '18px',
                                    fontWeight: 600
                                }}>
                                    {translate("cities.institutions", {"number": dataTypes?.data[index]?.count})}
                                </Text>
                            </Grid>
                        ))
                }
            </ScrollContent>
        </Box>
    );
};
export default CountType
