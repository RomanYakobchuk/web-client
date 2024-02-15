import {Box} from "@mui/material";
import {SchemaSelector} from "../../components";
import {ScreenMode} from "@/components/settings/screenMode";

const Settings = () => {
    return (
        <Box sx={{
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <SchemaSelector/>
            <ScreenMode/>
        </Box>
    );
};
export default Settings
