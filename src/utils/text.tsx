import {Box, SxProps} from "@mui/material";
import {ReactNode} from "react";

type TTruncateSingleTextProps = {
    width?: string | {
        xs?: string | number,
        sm?: string | number,
        md?: string | number,
        lg?: string | number,
        xl?: string | number
    },
    str: string | ReactNode,
    styles?: SxProps
}
export const TruncateSingleText = ({width = '100px', str, styles}: TTruncateSingleTextProps) => {
    return (
        <Box sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: width,
            // maxWidth: 'fit-content',
            ...styles
        }}>
            {str}
        </Box>
    )
}

type TTruncateMultipleTextProps = {
    lines?: number,
    str: string
}
export const TruncateMultipleText = ({lines = 2, str}: TTruncateMultipleTextProps) => {
    return (
        <Box sx={{
            whiteSpace: 'break-spaces',
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            width: '100%'
        }}>
            {str}
        </Box>
    )
}
type TTruncateFromMiddleTextProps = {
    fullStr: string,
    strLen: number,
    middleStr?: string
}
export const TruncateFromMiddleText = ({middleStr = '...', fullStr = '', strLen}: TTruncateFromMiddleTextProps) => {
    if (fullStr.length <= strLen) return fullStr;
    const midLen = middleStr?.length;
    const charsToShow = strLen - midLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        fullStr.substring(0, frontChars) + middleStr + fullStr.substring(fullStr.length - backChars)
    )
}

interface IPattern {
    pattern: RegExp;
    replacement: string;
}

export const formatText = ({text, id}: { text: string, id?: string }) => {
    const patterns: IPattern[] = [
        {pattern: /[*]{2}([^*]+)[*]{2}/gim, replacement: '<strong>$1</strong>'},
        {pattern: /[|]{2}([^*]+)[|]{2}/gim, replacement: '<span class="spoiler-message">$1</span>'},
        {pattern: /_{2}([^_]+)_{2}/gim, replacement: '<em>$1</em>'},
        // { pattern: /\[(.+?)\]\((.+?)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' }, // посилання
        {pattern: /(https?:\/\/[^\s]+)/gim, replacement: '<a href="$1" target="_blank">$1</a>'}, // посилання
    ];
    let formattedText = text;
    patterns?.forEach(({pattern, replacement}) => {
        formattedText = formattedText?.replace(pattern, replacement);
    });
    return formattedText;
};

