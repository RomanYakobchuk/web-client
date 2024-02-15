import {SxProps} from "@mui/material";

export interface PieChartProps {
    title: string;
    value: number;
    series: Array<number>;
    colors: Array<string>;
    labels: Array<string>;
    list: Array<{item: string, color?: string, percent: number, length?: number}>,
    style?: SxProps,
}