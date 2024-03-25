import Typography from "@mui/material/Typography";
import ReactApexChart from "react-apexcharts";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CountUp from "react-countup";
import {useContext} from "react";

import {PieChartProps} from "@/interfaces/dashboard";
import {ColorModeContext} from "@/contexts";
import {rounded} from "../rounded";

const PieChart = ({title, value, series, colors, labels, list, style}: PieChartProps) => {
    const {mode} = useContext(ColorModeContext);

    return (
        <Box
            id="chart"
            flex={1}
            display="flex"
            bgcolor="common.black"
            color="common.white"
            flexDirection="column"
            justifyContent="start"
            alignItems="start"
            gap={1}
            p={1}
            borderRadius="15px"
            maxWidth="100%"
            sx={{
                width: '100%',
                minWidth: {xs: '300px', lg: '400px'},
                "& svg, & foreignObject": {
                    height: '230px',
                    width: '230px',
                },
                "& div.apexcharts-tooltip-series-group.apexcharts-active": {
                    bgcolor: `${mode === 'dark' ? '#fff' : '#000'} !important`,
                    color: `${mode === 'dark' ? '#000' : '#fff'} !important`,
                    boxShadow: `0px 0px 2px 0px ${mode === 'dark' ? '#000' : '#fff'} !important`
                },
                "& div.apexcharts-tooltip-text": {
                    fontSize: "16px !important"
                },
                ...style
            }}
        >
            <Stack pl={3.5} className={'stack'} direction="row" alignItems={'baseline'} gap={2}>
                <Typography fontSize={16}
                            sx={{
                                color: 'common.white'
                            }}
                >
                    {title}
                </Typography>
                <Typography
                    fontSize={24}
                    // color="#11142d"
                    fontWeight={700}
                    mt={1}
                >
                    <CountUp end={value}/>
                    {/*{value}*/}
                </Typography>
            </Stack>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: {sm: 'column', lg: 'row'},
                "@media screen and (max-width: 550px)":{
                    flexDirection: 'column'
                },
                "@media screen and (max-width: 700px && min-width: 550px)":{
                    flexDirection: 'row',
                    gap: 0
                },
                gap: {xs: 2, lg: 0},
            }}>
                <ReactApexChart
                    options={{
                        chart: {
                            type: "donut",
                        },
                        stroke: {
                            colors: colors?.map((_) => mode === 'dark' ? '#fff' : '#000'),
                            width: 3,
                            curve: 'monotoneCubic'
                        },
                        colors,
                        legend: {
                            show: false,
                            fontSize: '16px',
                            floating: true,
                        },
                        dataLabels: {enabled: true, style: {fontSize: '16px'}},
                        labels: labels,
                    }}
                    series={series}
                    type="donut"
                    height={'230px'}
                    width={'230px'}
                />
                <Box sx={{
                    width: '100%',
                    height: 'fit-content',
                    overflowX: 'hidden',
                    minWidth: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 2
                }}>
                    {
                        list?.map((item, index) => (
                            <Box key={index} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '5px',
                                    bgcolor: item?.color
                                }}/>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    flexWrap: 'wrap'
                                }}>
                                    <span>
                                        {item?.item}
                                    </span>
                                    -
                                    <span style={{
                                        fontWeight: 600,
                                        color: 'cornflowerblue',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 0.5,
                                        flexWrap: 'wrap'
                                    }}>
                                        <CountUp end={rounded(item?.percent)}/>
                                        %
                                        <span style={{
                                            color: 'silver',
                                            fontSize: '16px',
                                            margin: '0 5px'
                                        }}>({item?.length || 0})</span>
                                    </span>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default PieChart;