import {Box, Grid, Skeleton, Typography} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {Link, useNavigate} from "react-router-dom";
import {Typography as TypographyAntd} from "antd";
import ScrollContent from "../common/scrollContent";
import {useMobile} from "../../utils";
import {color} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts";

const {Text} = TypographyAntd;
const CountType = () => {

    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const {data: dataTypes, isLoading: isLoadingTypes} = useList<any>({
        resource: "institution/countByType",
    });
    return (
        <Box sx={{
            display: "flex",
            flexDirection: {xs: 'column', sm: 'row'},
            gap: {xs: 3, sm: 5, md: 3, lg: 5},
            width: '100%',
            "& a": {
                textDecoration: 'none',
                height: {xs: "120px", md: '180px', lg: '220px'},
                bgcolor: 'primary.main',
                "&:hover": {
                    boxShadow: `0px 0px 10px 3px ${mode === 'dark' ? '#fcfcfc' : '#000'}`,
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
                                height: {xs: "120px", md: '180px', lg: '220px'},
                                borderRadius: '10px'
                            }}
                            animation={"wave"}
                            variant={"rectangular"}
                        />
                    ))
                    : ['restaurant', 'bar', 'cafe']?.map((type: string, index) => (
                        <Link
                            to={`/all_institutions?pageSize=10&current=1&sorters[0][field]=createdAt_asc&sorters[0][order]=desc&filters[0][field]=propertyType&filters[0][operator]=eq&filters[0][value]=${type}`}
                            key={index}
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                borderRadius: '10px',
                                backgroundImage: `url(images/${type}.jpg)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: '300ms linear',
                            }}>
                            <Box sx={{
                                width: '100%',
                                padding: '10px 0',
                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(2px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: {xs: 1, md: 2},
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: width < 600 ? '16px' : '20px',
                                    fontWeight: 900
                                }}>
                                    {translate(`home.sortByType.${type}`)}
                                </Text>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: width < 600 ? '14px' : '16px',
                                    fontWeight: 600
                                }}>
                                    {translate("cities.institutions", {"number": dataTypes?.data[index]?.count})}
                                </Text>
                            </Box>
                        </Link>
                    ))
            }
        </Box>
    );
};
export default CountType
