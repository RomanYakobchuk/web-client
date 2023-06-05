import {CanAccess} from "@refinedev/core";

import {NewsAdminList, NewsUserList} from "../components";


const News = () => {
    return (
        <>
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
        </>
    )
};
export default News;