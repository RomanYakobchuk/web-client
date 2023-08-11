import {CanAccess} from "@refinedev/core";

import {NewsAdminList, NewsUserList} from "../../components";
import {Box} from "@mui/material";


const News = () => {
    return (
        <Box sx={{
            p: {xs: 1, md: 2}
        }}>
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