import {CanAccess} from "@refinedev/core";
import {Box} from "@mui/material";
import React from "react";

import {NewComponentButton, NewsAdminList, NewsUserList} from "../../components";


const News = () => {

    return (
        <Box sx={{
            p: {xs: 1, md: 2}
        }}>
            <NewComponentButton link={'/news/create'} title={"home.createNews.title"}/>
            <CanAccess
                resource={'news'}
                action={'userListNews'}
            >
                <NewsUserList/>
            </CanAccess>
            <CanAccess
                resource={'news'}
                action={'adminListNews'}
            >
                <NewsAdminList/>
            </CanAccess>
        </Box>
    )
};
export default News;