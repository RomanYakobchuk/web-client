import {useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";

import {StarRating} from "@/components/establishment/utills/main/starRating";
import {ShowTimeComponent} from "@/components/time";
import {IReviews} from "@/interfaces/common";
import parse from "html-react-parser";
import {formatText} from "@/utils";

type TProps = {
    review: IReviews
}

const ReviewCard = ({review}: TProps) => {
    const translate = useTranslate();

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            p: 2,
            // borderRadius: '10px',
            // bgcolor: 'common.black',
            color: 'common.white',
            "&:not(:last-of-type)": {
                borderBottom: '1px solid silver'
            }
        }}>
            <Box sx={{
                display: 'flex',
                gap: 1,
                width: '100%'
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: {xs: 'wrap', sm: 'nowrap'},
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    gap: {xs: 1, sm: 5, lg: 8},
                    width: '100%'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: 'fit-content',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: 1,
                        order: 1,
                        height: 'fit-content'
                    }}>
                        <Box
                            component="img"
                            sx={{
                                width: {xs: '46px', sm: '52px', md: '58px', lg: '64px'},
                                height: {xs: '46px', sm: '52px', md: '58px', lg: '64px'},
                                borderRadius: '7px',
                                objectFit: 'cover'
                            }}
                            src={review?.createdBy?.avatar}
                            alt={"avatar"}
                        />
                        <Box
                            sx={{
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            {review?.createdBy?.name}
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    p: '0px 8px',
                                    bgcolor: 'common.white',
                                    color: 'common.black',
                                    borderRadius: '20px'
                                }}
                            >
                                <Box
                                    sx={{
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {(translate('home.create.averageCheck')?.split(" ")[1] || "Check")}:
                                </Box>
                                {review?.check}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        order: {xs: 3, sm: 2},
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: '100%',
                        justifyContent: 'start',
                        alignItems: 'start',
                    }}>
                        <StarRating
                            value={review?.score}
                            readOnly
                            size={36}
                        />
                        <Box
                            sx={{
                                fontSize: '18px',
                                fontWeight: 600
                            }}
                        >
                            {review?.title}
                        </Box>
                        <Box
                            sx={{
                                fontSize: '14px',
                                wordWrap: 'break-word',
                                whiteSpace: 'break-spaces',
                            }}
                        >
                            {parse(formatText({text: review?.text}))}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: 'fit-content',
                            order: {xs: 2, sm: 3}
                        }}
                    >
                        <ShowTimeComponent
                            isFirstAgo={true}
                            style={{
                                fontSize: '14px',
                                whiteSpace: 'nowrap'
                            }}
                            date={review?.createdAt}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default ReviewCard
