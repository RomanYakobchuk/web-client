import {useTranslate} from "@refinedev/core";
import {HeadlessSelect, TOption} from "@/components/headlessUI/headlessSelect";
import {Box, SxProps} from "@mui/material";

type TProps = {
    current?: TOption,
    styles?: SxProps,
    position?: "left" | "right"
}
export const ChooseCuisine = ({current, styles, position = 'left'}: TProps) => {
    const translate = useTranslate();

    const cuisine = Object.entries(translate('cuisine', {returnObjects: true}));

    const options = cuisine?.map(([key, value]) => ({
        value: key,
        title: value
    }))?.sort((a, b) => a?.title?.toLowerCase()?.localeCompare(b?.title?.toLowerCase()));

    return (
        <Box
            sx={{
                width: '100%',
                ...styles
            }}
        >
            <HeadlessSelect
                current={current}
                position={position}
                options={options}
            />
        </Box>
    );
};

