import {Box} from "@mui/material";
import React from "react";

import {NewComponentButton, NewsUserList} from "@/components";


const News = () => {

    return (
        <Box sx={{
            p: {xs: 1, md: 2}
        }}>
            <NewComponentButton link={'/news/create'} title={"home.createNews.title"}/>
            <NewsUserList/>
        </Box>
    )
};
export default News;