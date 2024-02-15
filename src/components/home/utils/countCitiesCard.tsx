import {Box, Paper} from "@mui/material";
import {Apartment} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useGetLocale} from "@refinedev/core";
import {Typography as TypographyAntd} from "antd";

import {useMobile, useProgressiveImage} from "@/hook";
import {ICity} from "@/components/home/countCities";
import {ESTABLISHMENT} from "@/config/names";
import PlaceholderIgm from "../../../../public/images/placeholder.png"

const {Text} = TypographyAntd;

type TProps = {
    city: ICity
}
export const CountCitiesCard = ({city}: TProps) => {

    const {width} = useMobile();
    const locale = useGetLocale();

    const image = useProgressiveImage({src: city?.url});

    const currentLocale = locale();

    return (
        <Paper
            elevation={3}
            sx={{
                cursor: 'pointer',
                borderRadius: '10px',
            }}
        >
            <Link
                to={`/${ESTABLISHMENT}?pageSize=10&current=1&sorters[0][field]=&sorters[0][order]=asc&filters[0][field]=city&filters[0][operator]=contains&filters[0][value]=${city?.name_ua}`}
                style={{
                    borderRadius: '10px',
                    backgroundImage: `url("${image || PlaceholderIgm}")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    display: 'flex',
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
                        {city.establishmentCount}
                        {/*{translate("cities.establishments", {"number": city.establishmentCount})}*/}
                    </Text>
                </Box>
            </Link>
        </Paper>
    );
};

