import {Link, Outlet} from "react-router-dom";

export const TestPage = () => {
    return (
        <div>
            <Link to={'calendar'}>
                Calendar
            </Link>
            <Outlet/>
        </div>
    );
};

