import {Typography} from "antd";
import React, {useContext} from "react";
import {Box} from "@mui/material";

import {ColorModeContext} from "../../contexts";

const {Title, Text} = Typography;

interface IProps {
    title: string | any,
    value: string | any,
    bgColor?: string,
    onClick?: () => void
}

const TitleTextItem = ({value, title, bgColor, onClick}: IProps) => {
    const {mode} = useContext(ColorModeContext);
    const textColor = '#fff'
    return (
        <Box
            onClick={onClick ? onClick : () => {}}
            sx={{
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                p: "5px",
                cursor: onClick ? 'pointer' : 'normal',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.7,
                bgcolor: bgColor ? bgColor : mode === 'dark' ? "#252525" : '#016AB9'
            }}
        >
            {
                value && <Title
                    style={{
                        color: textColor,
                        margin: '0px'
                    }}
                    level={5}>{value}</Title>
            }
            {
                title && <Text
                    style={{
                        color: textColor,
                        whiteSpace: 'break-spaces'
                    }}
                >{title}</Text>
            }
        </Box>
    )
}

export default TitleTextItem;