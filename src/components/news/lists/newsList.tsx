import {Box, SxProps} from "@mui/material";
import {useContext} from "react";

import {INews} from "@/interfaces/common";
import NewsItem1 from "../cards/newsItem1";
import NewsItemV2 from "../cards/newsItemV2";
import {VariantContext} from "@/settings/variantEstablishment";

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
        gridTemplateColumns: `repeat(auto-fit, minmax(270px, 1fr))`,
        gap: {xs: 1.5, sm: 2}
    }

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
                                <NewsItemV2
                                    news={itemNews}
                                    key={itemNews?._id}/>
                            )
                        }
                    )
                }
            </Box>
        </Box>
    );
};
export default NewsList;