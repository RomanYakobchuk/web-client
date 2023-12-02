import {useList, useTranslate} from "@refinedev/core";
import {PropertyProps} from "@/interfaces/common";
import React, {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import {ScrollContent, Variant1EstablishmentCard} from "@/components";
import {useMobile} from "@/hook";

type TProps = {
    id: string,
}

const SimilarEstablishment = ({id}: TProps) => {

    const translate = useTranslate();
    const {layoutWidth} = useMobile();

    const [similarItems, setSimilarItems] = useState<PropertyProps[]>([] as PropertyProps[]);

    const {data, isLoading, isError} = useList<PropertyProps>({
        resource: `institution/similar/${id}`
    });

    useEffect(() => {
        if (data?.data) {
            setSimilarItems(data?.data)
        }
    }, [data]);

    return (
        <Box sx={{
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            // gap: 2,
            alignItems: 'start',
            width: '100%',
            flexDirection: 'column',
            gap: 2
        }}>
            <Typography
                sx={{
                    color: 'common.white'
                }}
                variant={'h5'}
            >
                {translate('all_institutions.similar.title')}
            </Typography>
            <ScrollContent
                parentWidth={innerWidth < 900 ? 'calc(100vw - 30px)' : innerWidth < 1300 ? `calc(${layoutWidth}px - 30px)` : innerWidth < 1550 ? `1070px` : `calc(1500px - 46px - 500px)`}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%'
                }}>
                    {
                        similarItems?.length > 0 && similarItems?.map((item, index) => (
                            <Box
                                sx={{
                                    width: {xs: '250px', sm: '300px'},
                                }}
                                key={item?._id}
                            >
                                <Variant1EstablishmentCard
                                    institution={item}
                                />
                            </Box>
                        ))
                    }
                </Box>
            </ScrollContent>
        </Box>
    );
};
export default SimilarEstablishment;
