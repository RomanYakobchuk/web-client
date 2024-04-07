import {Box, IconButton, Skeleton, Typography} from "@mui/material";
import {CanAccess, useList, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {EditLocationOutlined} from "@mui/icons-material";

import ScrollContent from "../common/scroll/scrollContent";
import {useMobile} from "@/hook";
import {ESTABLISHMENT} from "@/config/names";
import {CountCitiesCard} from "@/components/home/utils/countCitiesCard";

export interface ICity {
    name_ua: string,
    name_en: string,
    establishmentCount: number,
    url: string,
    _id: string
}


const CountCities = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {layoutWidth} = useMobile();

    const {data: dataCities, isLoading: isLoadingCities} = useList<any>({
        resource: `${ESTABLISHMENT}/countByCity`,
    });

    return (
        <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            width: '100%',
        }}>
            <Typography sx={{
                fontSize: {xs: '18px', sm: '22px', lg: '24px'},
                borderLeft: '3px solid transparent',
                borderLeftColor: 'common.white',
                fontWeight: 900,
                pl: 2,
                color: "secondary.main"
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
            <Box sx={{
                display: "flex",
                // flexDirection: 'column',
                // gap: 2,
                width: '100%',
                // flexDirection: {xs: 'column', md: 'row'},
                bgcolor: 'modern.modern_1.main',
                borderRadius: '15px',
                p: 3,
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
                {/*<Box sx={{}}>*/}
                {/*    <Box>*/}
                {/*        SOME TEXT*/}
                {/*    </Box>*/}
                {/*</Box>*/}
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
                                return a.establishmentCount > b.establishmentCount ? -1 : 1
                            })?.map((city: ICity, index) => (
                                <CountCitiesCard city={city} key={index + city?.name_en}/>
                            ))
                    }
                </ScrollContent>
            </Box>
        </Box>
    );
};
export default CountCities
