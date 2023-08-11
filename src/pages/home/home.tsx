import {Box} from "@mui/material";
import {FC} from "react";


import {CountCities, CountType, CountViews} from "../../components/home";

const Home: FC = () => {

    return (
        <Box sx={{
            p: {xs: 1, md: 2}
        }}>
            <Box sx={{
                display: 'flex',
                gap: "20px",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto",
                justifyContent: "center",
                width: "90%",
                mb: 2
            }}>
                <CountCities/>
                <CountType/>
                <CountViews/>
            </Box>
        </Box>
    );
};
export default Home;
