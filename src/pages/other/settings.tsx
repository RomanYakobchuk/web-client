import {Box, Button} from "@mui/material";
import {SchemaSelector} from "../../components";
import {ScreenMode} from "@/components/settings/screenMode";
import {deleteIndexedDB, storageSize} from "@/indexedDB/indexedDBInit";
import {useEffect, useState} from "react";
import * as console from "console";

const Settings = () => {
    const size = storageSize();

    const [storage, setStorage] = useState<number | string>(0);

    useEffect(() => {
        size.then((value) => {
            setStorage(value)
        })
    }, []);
    return (
        <Box sx={{
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'start'
        }}>
            <SchemaSelector/>
            Storage size: {storage}MB
            <Button
                color={'secondary'}
                variant={'contained'}
                onClick={deleteIndexedDB}
            >
                Clear db
            </Button>
            {/*<ScreenMode/>*/}
        </Box>
    );
};
export default Settings
