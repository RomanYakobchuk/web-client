import {PropertyProps} from "@/interfaces/common";
import {Box, Chip, Typography} from "@mui/material";
import {ESTABLISHMENT} from "@/config/names";
import React from "react";
import {useTranslate} from "@refinedev/core";
import {Link} from "react-router-dom";

type TProps = {
    tags: PropertyProps['tags']
}
export const MainTags = ({tags}: TProps) => {
    const translate = useTranslate();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography>
                {translate("home.create.tags")}
            </Typography>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                ml: 1,
                mt: 1,
                gap: 0.5,

            }}>
                {
                    tags?.map((tag: any, index: number) => (
                        <Chip
                            key={index}
                            clickable
                            label={
                                <Link
                                    to={`/${ESTABLISHMENT}?pageSize=10&current=1&filters[0][field]=title&filters[0][value]=%23${tag.value}`}
                                >
                                    {'#' + tag.value}
                                </Link>
                            }
                            sx={{
                                cursor: 'pointer',
                                bgcolor: 'common.white',
                                color: 'common.black',
                                "& a": {
                                    color: 'common.black',
                                },
                                transition: '200ms linear',
                                "&:hover": {
                                    bgcolor: 'info.main',
                                    "& a": {
                                        color: '#f1f1f1'
                                    }
                                }
                            }}/>
                    ))
                }
            </Box>
        </Box>
    );
};

