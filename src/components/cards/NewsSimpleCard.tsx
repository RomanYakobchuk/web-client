import {Box, Button, Paper, Typography} from "@mui/material";

import {INews} from "@/interfaces/common";
import {useProgressiveImage} from "@/hook";
import {TruncateMultipleText} from "@/utils";
import {useContext} from "react";
import {ColorModeContext} from "@/contexts";
import {useTranslate} from "@refinedev/core";
import {NEWS, SHOW} from "@/config/names";
import {useNavigate} from "react-router-dom";
import {NewsDateEvent} from "@/components/news/utills/newsDateEvent";
import {Place} from "@mui/icons-material";

type TProps = {
    news: INews
}

export const NewsSimpleCard = ({news}: TProps) => {

    const picture = news?.pictures?.length > 0 ? news?.pictures[0]?.url : '';
    const image = useProgressiveImage({src: picture});

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const navigate = useNavigate();

    const isPLace = !!news?.place?.place?.city;
    const silver = mode === 'dark' ? 'silver' : '#676767';
    return (
        <Paper
            elevation={2}
            sx={{
                width: '100%',
                borderRadius: '15px',
                overflow: 'hidden',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'center'
            }}
        >
            {
                image && (
                    <Box
                        component="img"
                        src={image}
                        sx={{
                            width: '100%',
                            height: {xs: '200px'},
                            borderRadius: '15px',
                            objectFit: 'cover'
                        }}
                    />
                )
            }
            <Box
                sx={{
                    p: 2,
                    width: '100%',
                    color: 'common.white'
                }}
            >
                <Box
                    sx={{
                        color: silver,
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 1
                    }}
                >
                    <Typography
                        variant={'subtitle1'}
                    >
                        {translate('dates.date')}:
                    </Typography>
                    <Box
                        component="span"
                    >
                        <NewsDateEvent
                            dateEvent={news?.dateEvent}
                            lengthItems={1}
                            styles={{
                                "::before": {},
                                fontSize: '14px'
                            }}
                        />
                    </Box>
                </Box>
                <Typography
                    variant={'h5'}
                    sx={{
                        m: 0,
                        p: 0
                    }}
                >
                    {news?.title}
                </Typography>
                <Box sx={{
                    color: silver,
                    width: '100%',
                    fontSize: '15px'
                }}>
                    <TruncateMultipleText
                        str={news?.description}
                        lines={3}
                    />
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isPLace ? 'space-between' : 'end'
                    }}
                >
                    {
                        isPLace && (
                            <Box
                                className="flex gap-1"
                                sx={{
                                    color: silver,
                                    alignItems: 'center',
                                }}
                            >
                                <Place/>
                                <Typography
                                >
                                    {news?.place?.place?.city}
                                </Typography>
                            </Box>
                        )
                    }
                    <Button
                        sx={{
                            textTransform: 'inherit',
                            p: '4px 16px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 600
                        }}
                        variant={'contained'}
                        color={'info'}
                        onClick={() => navigate(`/${NEWS}/${SHOW}/${news?._id}`)}
                    >
                        {translate('buttons.details')}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

