import {Box, Typography} from "@mui/material";
import {SchemaSelector} from "../../components";

const Settings = () => {
    return (
        <Box sx={{
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <SchemaSelector/>

        </Box>
    );
};
export default Settings
