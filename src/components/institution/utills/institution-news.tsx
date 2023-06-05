import {Box} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {INews, PropertyProps} from "../../../interfaces/common";
import {NewsCard} from "../../index";
import {useMobile} from "../../../utils";

interface IProps {
    institution: PropertyProps
}

const InstitutionNews = ({institution}: IProps) => {
    const translate = useTranslate();
    const {width} = useMobile();

    const {news} = institution;
    return (
        <Box
             sx={{
                 width: '100%',
                 borderRadius: '15px',
                 p: '10px',
                 pr: '25px',
                 maxHeight: '900px',
                 overflowX: 'auto'
             }}
        >
            {
                news?.length > 0
                    ? <Box sx={{
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        {
                            news?.map((newsItem: INews, index: number) => (
                                <Box key={index}
                                     sx={{
                                         width: width < 600 ? "100%" : width < 1260 ? '48%' : '100%'
                                     }}>
                                    <NewsCard index={index} _id={newsItem._id} title={newsItem.title} place={newsItem.place}
                                              dateEvent={newsItem.dateEvent} mainPhoto={newsItem.mainPhoto}
                                              category={newsItem.category} description={newsItem.description}
                                              createdAt={newsItem.createdAt}/>
                                </Box>
                            ))
                        }
                    </Box>
                    : translate("news.notHave")
            }
        </Box>
    );
};
export default InstitutionNews
