import {PropertyProps} from "../../../interfaces/common";
import {Box, Button, CircularProgress, TextField} from "@mui/material";
import {useState} from "react";
import {buttonStyle} from "../../../styles";
import {useTranslate, useForm, useInfiniteList} from "@refinedev/core";
import {axiosInstance} from "../../../authProvider";
import {CustomDrawer} from "../../index";
import {useMobile} from "../../../utils";

interface IProps {
    location: {
        lat: number,
        lng: number
    },
}

const FindNearbyPlaces = ({location}: IProps) => {

    const translate = useTranslate();
    const {device} = useMobile();

    const [items, setItems] = useState<PropertyProps[]>([] as PropertyProps[]);
    const [maxDistance, setMaxDistance] = useState<number>(5000);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const {refetch, isRefetching} = useInfiniteList<PropertyProps>({
        resource: 'institution/nearby',
        queryOptions: {

        }
    })
    const search = async () => {
        if (location.lat && maxDistance) {
            setOpenDrawer(true)
            const result = await axiosInstance.post('/institution/nearby', {
                location: location,
                maxDistance
            });

            if (result.data) {
                setItems(result.data?.nearby as PropertyProps[]);
            }
        }
    }


    return (
        <Box>
            <Button variant={'contained'}
                    sx={{
                        ...buttonStyle,
                        color: 'common.black'
                    }}
            >
                {translate('buttons.nearby')}
            </Button>
            {
                openDrawer && (
                    <CustomDrawer
                        anchor={device ? "bottom" : "right"}
                        title={translate('buttons.nearby')}
                        toggleDrawer={setOpenDrawer}
                    >
                        <Box>
                            <TextField
                                type={"number"}
                                sx={{}}
                                onChange={(event) => setMaxDistance(Number(event.target.value))}
                                value={maxDistance}
                            />
                            {
                                isRefetching ? <CircularProgress/> : (
                                    items.map((item, index) => (
                                        <Box key={index}>
                                        </Box>
                                    ))
                                )
                            }
                        </Box>
                    </CustomDrawer>
                )
            }
        </Box>
    );
};
export default FindNearbyPlaces;
