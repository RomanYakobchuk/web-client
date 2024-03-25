import {PieChart as MuiPieChart} from "@mui/x-charts/PieChart";
import {MakeOptional} from "@mui/x-charts/models/helpers";
import {PieSeriesType, PieValueType} from "@mui/x-charts";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CountUp from "react-countup";
import {Box} from "@mui/material";

import {rounded} from "../rounded";


export type TSeriesForMuiPieChartList = MakeOptional<PieSeriesType<MakeOptional<PieValueType, "id">>, "type">[];
export type TSeriesForMuiPieChartItem = MakeOptional<PieSeriesType<MakeOptional<PieValueType, "id">>, "type">;
type TProps = {
    title: string,
    value: number,
    series: TSeriesForMuiPieChartList,
    list: Array<{ color?: string, value: number, label?: string, length?: number }>
}

const PieChartByMui = ({title, value, series, list}: TProps) => {
    return (
        <Box id="chart"
             flex={1}
             display="flex"
             bgcolor="common.black"
             color="common.white"
             flexDirection="column"
             justifyContent="space-between"
             alignItems="start"
             py={2}
             gap={1}
             borderRadius="15px"
             maxWidth="100%"
             sx={{
                 width: '100%',
                 minWidth: {xs: '300px', lg: '400px'},
                 p: 1,
                 "& svg": {
                     height: '230px',
                     width: '230px',
                 },
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
                    fontWeight={700}
                    mt={1}
                >
                    <CountUp end={value}/>
                </Typography>
            </Stack>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: {sm: 'column', lg: 'row'},
                "@media screen and (max-width: 550px)": {
                    flexDirection: 'column'
                },
                "@media screen and (max-width: 700px && min-width: 550px)": {
                    flexDirection: 'row',
                    gap: 0
                },
                gap: {xs: 2, lg: 0},
            }}>
                <MuiPieChart
                    width={230}
                    height={230}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                    series={series}
                />
                <Box/>
                <Box sx={{
                    width: {sm: '100%', lg: 'calc(100% - 230px)'},
                    "@media screen and (max-width: 550px)": {
                        width: '100%'
                    },
                    "@media screen and (max-width: 700px && min-width: 550px)": {
                        width: 'calc(100% - 230px)'
                    },
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
                                        {item?.label}
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
                                        <CountUp end={rounded(item?.value)}/>
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
export default PieChartByMui
