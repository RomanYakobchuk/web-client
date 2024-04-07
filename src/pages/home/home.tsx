import {Box} from "@mui/material";
import {FC} from "react";

import "./home.css";

import {CountCities, CountViews, TypePart, WelcomePart} from "@/components/home";
import {PropertyCards} from "@/components/home/PropertyCards";


const Home: FC = () => {

    return (
        <Box sx={{
            display: 'flex',
            gap: 4,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            mb: 2,
            color: 'common.white'
        }}>
            <WelcomePart/>
            <Box
                sx={{
                    margin: '0 auto',
                    width: {xs: '90vw', md: '90%'},
                    overflowY: 'hidden',
                    overflowX: 'auto',
                    pb: 1
                }}
            >
                <PropertyCards/>
            </Box>
            <Box
                id={'typePart'}
                sx={{
                    width: '100%'
                }}>
                <TypePart/>
            </Box>
            <Box sx={{
                width: {xs: '90vw', md: '90%'},
                maxWidth: {xs: '90vw', md: '90%'},
                margin: '0 auto',
            }}>
                <CountCities/>
            </Box>
            <Box sx={{
                margin: '0 auto',
                width: '100%'
            }}>
                <CountViews/>
            </Box>
        </Box>
    );
};
export default Home;
