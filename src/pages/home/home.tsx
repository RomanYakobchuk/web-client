import {Box, Button, Typography} from "@mui/material";
import {FC, useContext} from "react";

import "./home.css";


import {CountCities, CountType, CountViews, TypePart, WelcomePart} from "../../components/home";
import {ColorModeContext} from "../../contexts";

const Home: FC = () => {

    const {mode} = useContext(ColorModeContext);

    return (
        <Box sx={{
            width: '100%'
        }}>
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mb: 2
            }}>
               <WelcomePart/>
                <Box sx={{
                    width: '90%',
                    margin: '0 auto',
                    p: {xs: 1, md: 2},
                }}>
                    <CountCities/>
                </Box>
                <TypePart/>
                <Box sx={{
                    margin: '0 auto',
                    p: {xs: 1, md: 2},
                }}>
                    <CountViews/>
                </Box>
            </Box>
        </Box>
    );
};
export default Home;
