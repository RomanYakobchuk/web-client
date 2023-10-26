import {Box} from "@mui/material";
import {FC} from "react";

import "./home.css";

import {CountCities, CountViews, TypePart, WelcomePart} from "../../components/home";

const Home: FC = () => {

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
                }}>
                    <CountCities/>
                </Box>
                <Box
                    id={'typePart'}
                    sx={{
                        width: '100%'
                    }}>
                    <TypePart/>
                </Box>
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
