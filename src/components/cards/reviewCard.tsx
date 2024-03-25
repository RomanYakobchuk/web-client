import {Box, Divider, Rating} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import React, {useContext} from "react";
import {Typography} from "antd";

import {ShowTimeComponent} from "@/components/time";
import {IReviews} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useMobile} from "@/hook";
import {StarRating} from "@/components/establishment/utills/main/starRating";

type TProps = {
    review: IReviews
}
const {Title, Text} = Typography;

const ReviewCard = ({review}: TProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const textColor = mode === "dark" ? "#e8dfdf" : '#000';

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            p: '15px',
            borderRadius: '10px',
            bgcolor: 'common.black'
        }}>
            <Box sx={{
                display: 'flex',
                gap: 1,
                width: '100%'
            }}>
                <img style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%'
                }} src={review?.createdBy?.avatar} alt={"avatar"}/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{
                            color: textColor
                        }}>
                            {review?.createdBy?.name}
                        </Box>
                        <ShowTimeComponent
                            isFirstAgo={true}
                            date={review?.createdAt}/>
                    </Box>
                    <StarRating
                        value={review?.grade}
                        readOnly
                    />
                    {/*<Rating value={review?.grade} precision={0.5} readOnly/>*/}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        gap: 2,
                        width: '100%',
                        justifyContent: {xs: 'start', sm: 'space-between'},
                        alignItems: 'start',
                        "& div.reviewCardIsLikePart":{
                            width: '100%'
                        }
                    }}>
                        <Box
                            className={'reviewCardIsLikePart'}
                        >
                            <Title
                                style={{
                                    color: textColor,
                                    marginTop: '5px',
                                    marginBottom: 0
                                }}
                                level={5}
                            >
                                {translate('home.show.reviews.like')}
                            </Title>
                            <Text
                                style={{
                                    color: textColor,
                                    whiteSpace: 'break-spaces'
                                }}
                            >
                                {review.text?.like}
                            </Text>
                        </Box>
                        {
                            width > 600 && (
                                <Divider
                                    sx={{
                                        bgcolor: 'silver'
                                    }}
                                    orientation={'vertical'}/>
                            )
                        }
                        <Box
                            className={'reviewCardIsLikePart'}
                        >
                            <Title
                                style={{
                                    color: textColor,
                                    marginTop: '5px',
                                    marginBottom: 0
                                }}
                                level={5}
                            >
                                {translate('home.show.reviews.notLike')}
                            </Title>
                            <Text
                                style={{
                                    color: textColor,
                                    whiteSpace: 'break-spaces'
                                }}
                            >
                                {review.text?.notLike}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default ReviewCard
