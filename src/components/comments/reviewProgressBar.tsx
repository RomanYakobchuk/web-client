import {useState} from "react";
import {Box, SxProps, Tooltip} from "@mui/material";
import {useTranslate} from "@refinedev/core";

type TProps = {
    value: number,
    onChange: (value: number) => void,
    styles?: SxProps
}
export const selectedColor = {
    '1': '#f80317',
    '2': '#dea413',
    '3': '#f1f127',
    '4': '#93dc4f',
    '5': 'success.main',
}
// export const selectedColor = {
//     '1': 'linear-gradient(90deg, rgba(242,0,0,1) 0%, rgba(222,164,19,1) 100%)',
//     '2': 'linear-gradient(90deg, rgba(222,164,19,1) 0%, rgba(241,241,39,1) 100%)',
//     '3': 'linear-gradient(90deg, rgba(241,241,39,1) 0%, rgba(255,246,49,1) 100%)',
//     '4': 'linear-gradient(90deg, rgba(241,241,39,1) 0%, rgba(147,220,79,1) 100%)',
//     '5': 'linear-gradient(90deg, rgba(103,190,35,1) 0%, rgba(76,173,0,1) 100%)',
// }

export const ReviewProgressBar = ({onChange, value, styles}: TProps) => {
    const translate = useTranslate();

    const [hoveredValue, setHoveredValue] = useState<number>(0);

    const handleBlockClick = (newValue: number) => {
        onChange(newValue);
    }

    const handleBlockMouseEnter = (newValue: number) => {
        setHoveredValue(newValue)
    }
    const handleBlockMouseLeave = () => {
        setHoveredValue(0);
    }

    const scoreTitles = Object.entries(translate('text.score', {returnObjects: true}));

    return (
        <Box
            className={'reviewProgressBar'}
            sx={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                height: '30px',
                gap: 0.5,
                ...styles
            }}
        >
            {
                [...Array(5)]?.map((_, i) => {
                    const isBlockHovered = i < hoveredValue;

                    const defaultColor = '#e3e3e3';
                    const colorByValue = selectedColor[`${value}` as keyof typeof selectedColor];
                    const hoverColor = selectedColor[`${hoveredValue}` as keyof typeof selectedColor];
                    const bgColor = i + 1 <= (hoveredValue || value) ? (isBlockHovered ? hoverColor : colorByValue) : defaultColor;
                    return (
                        <Tooltip
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        color: '#fff'
                                    }
                                }
                            }}
                            arrow
                            placement={'top'}
                            title={scoreTitles[i + 1][1]}
                            key={i}
                        >
                            <Box
                                sx={{
                                    width: '20%',
                                    height: '100%',
                                    borderRadius: '4px',
                                    transition: '200ms linear',
                                    bgcolor: bgColor,
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleBlockClick(i + 1)}
                                onMouseEnter={() => handleBlockMouseEnter(i + 1)}
                                onMouseLeave={handleBlockMouseLeave}
                            />
                        </Tooltip>
                    )
                })
            }
        </Box>
    );
};

