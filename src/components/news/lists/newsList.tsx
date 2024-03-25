import {Box, SxProps} from "@mui/material";
import {useContext} from "react";

import {INews} from "@/interfaces/common";
import NewsItem1 from "@/components/cards/newsCards/newsItem1";
import NewsItemV2 from "@/components/cards/newsCards/newsItemV2";
import {VariantContext} from "@/settings/variantEstablishment";
import {NewsSimpleCard} from "@/components/cards/NewsSimpleCard";

type IProps = {
    news: INews[]
}
const NewsList = ({news}: IProps) => {

    const {variantShowItems} = useContext(VariantContext);
    const currentVariant: SxProps = variantShowItems?.news === 'variant_1' ? {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'start',
        alignItems: 'start',
    } : {
        display: 'grid',
        // gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
        gridTemplateColumns: `repeat(1, 1fr)`,
        "@media screen and (min-width: 500px)": {
            gridTemplateColumns: `repeat(2, 1fr)`,
        },
        "@media screen and (min-width: 800px)": {
            gridTemplateColumns: `repeat(3, 1fr)`,
        },
        "@media screen and (min-width: 900px)": {
            gridTemplateColumns: `repeat(2, 1fr)`,
        },
        "@media screen and (min-width: 1100px)": {
            gridTemplateColumns: `repeat(3, 1fr)`,
        },
        "@media screen and (min-width: 1300px)": {
            gridTemplateColumns: `repeat(4, 1fr)`,
        },
        "@media screen and (min-width: 1500px)": {
            gridTemplateColumns: `repeat(5, 1fr)`,
        },
        gap: {xs: 1, sm: 1.5}
    }
    // {
    //     display: 'grid',
    //         // gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
    //         gridTemplateColumns: `repeat(1, 1fr)`,
    //     "@media screen and (min-width: 600px)": {
    //     gridTemplateColumns: `repeat(2, 1fr)`,
    // },
    //     "@media screen and (min-width: 1200px)": {
    //     gridTemplateColumns: `repeat(3, 1fr)`,
    // },
    //     "@media screen and (min-width: 1500px)": {
    //     gridTemplateColumns: `repeat(5, 1fr)`,
    // },
    //     gap: {xs: 1, sm: 1.5}
    // }

    return (
        <Box sx={{
            width: '100%',
        }}>
            <Box sx={{
                ...currentVariant
            }}>
                {
                    news?.map((itemNews: INews) => {
                            if (variantShowItems?.news === 'variant_1') {
                                return (
                                    <Box
                                        key={itemNews?._id}
                                        sx={{
                                            width: '100%',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <NewsItem1 itemNews={itemNews}/>
                                    </Box>
                                )
                            }
                            return (
                                <NewsSimpleCard
                                    key={itemNews?._id}
                                    news={itemNews}/>
                                // <NewsItemV2
                                //     news={itemNews}
                                //     key={itemNews?._id}/>
                            )
                        }
                    )
                }
            </Box>
        </Box>
    );
};
export default NewsList;