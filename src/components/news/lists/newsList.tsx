import {Box} from "@mui/material";

import {INews} from "../../../interfaces/common";
import NewsItem1 from "../utills/newsItem1";

type IProps = {
    news: INews[]
}
const NewsList = ({news}: IProps) => {
    return (
        <Box sx={{
            width: '100%'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                justifyContent: 'start',
                alignItems: 'start'
            }}>
                {
                    news?.map((itemNews: INews) => (
                        <NewsItem1 itemNews={itemNews} key={itemNews?._id}/>
                    ))
                }
            </Box>
        </Box>
    );
};
export default NewsList
