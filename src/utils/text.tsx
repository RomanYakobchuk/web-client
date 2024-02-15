import {Box} from "@mui/material";

type TTruncateSingleTextProps = {
    width?: string,
    str: string
}
export const TruncateSingleText = ({width = '100px', str}: TTruncateSingleTextProps) => {
    return (
        <Box sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: width,
            maxWidth: 'fit-content'
        }}>
            {str}
        </Box>
    )
}

type TTruncateMultipleTextProps = {
    lines?: number,
    str: string
}
export const truncateMultipleText = ({lines = 2, str}: TTruncateMultipleTextProps) => {
    return (
        <Box sx={{
            whiteSpace: 'break-spaces',
            display: '-webkit-box',
            WebkitLineClamp: lines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
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
export const truncateFromMiddleText = ({middleStr = '...', fullStr = '', strLen}: TTruncateFromMiddleTextProps) => {
    if (fullStr.length <= strLen) return fullStr;
    const midLen = middleStr?.length;
    const charsToShow = strLen - midLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        fullStr.substring(0, frontChars) + middleStr + fullStr.substring(fullStr.length - backChars)
    )
}