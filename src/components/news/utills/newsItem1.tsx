import {Link} from "react-router-dom";
import {Avatar, Box, Typography} from "@mui/material";
import React from "react";
import {useTranslate} from "@refinedev/core";

import {INews, PropertyProps} from "../../../interfaces/common";
import NewsItem1Info from "./newsItem_1_Info";

type IProps = {
    itemNews: INews
}
const NewsItem1 = ({itemNews}: IProps) => {
    const translate = useTranslate();

    const establishmentInfo = itemNews?.institutionId as PropertyProps;

     return (
        <Box sx={{
            width: '100%',
            bgcolor: 'modern.modern_1.second',
            borderRadius: '15px'
        }}>
            <Box sx={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                // bgcolor: 'common.black',
                borderRadius: {xs: '0', sm: '15px'},
                width: '100%',
                gap: 2,
                color: 'common.white',
                "& a": {
                    textDecoration: 'none',
                    color: 'common.white',
                },
            }}>
                <Link
                    to={`/all_institutions/show/${establishmentInfo?._id}`}
                    style={{
                        display: 'flex',
                        gap: "16px",
                    }}
                >
                    <Avatar
                        src={establishmentInfo?.pictures[0]?.url}
                        alt={establishmentInfo?.pictures[0]?.name}
                        sx={{
                            width: {xs: 48, sm: 56, md: 64, lg: 72},
                            height: {xs: 48, sm: 56, md: 64, lg: 72},
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {xs: 'row', md: 'column'},
                            gap: {xs: 2, md: 0},
                            alignItems: {xs: 'center', md: 'start'}
                        }}
                    >
                        <Typography
                            variant={'h5'}
                            sx={{
                                fontSize: {xs: '18px', md: '22px'}
                            }}
                        >
                            {establishmentInfo?.title}
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: 'common.white',
                                borderRadius: '10px',
                                color: 'common.black',
                                p: '1px 7px',
                                fontSize: {xs: '14px', md: '16px'}
                            }}
                        >
                            {translate(`home.sortByType.${establishmentInfo?.type}`)}
                        </Box>
                    </Box>
                </Link>
                <NewsItem1Info news={itemNews}/>
            </Box>
        </Box>
    );
};
export default NewsItem1
