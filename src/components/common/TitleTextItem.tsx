import {Typography} from "antd";
import React, {JSX, useContext} from "react";
import {Box} from "@mui/material";

import {ColorModeContext} from "../../contexts";

const {Title, Text} = Typography;

interface IProps {
    title: string | JSX.Element,
    value: string | any,
    bgColor?: string,
    onClick?: () => void,
    animate?: boolean,
    animation?: any
}

const TitleTextItem = ({value, title, bgColor, onClick, animate, animation}: IProps) => {
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
                bgcolor: bgColor ? bgColor : mode === 'dark' ? "#252525" : '#016AB9',
                animation: animate && animation,
                transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1), height 2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {
                value && <Title
                    style={{
                        color: textColor,
                        margin: '0px',
                        fontSize: '16px'
                    }}
                    level={5}>{value}</Title>
            }
            {
                title && <Text
                    style={{
                        color: textColor,
                        whiteSpace: 'break-spaces',
                        fontSize: '14px'
                    }}
                >{title}</Text>
            }
        </Box>
    )
}

export default TitleTextItem;