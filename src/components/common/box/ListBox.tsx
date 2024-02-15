import {ComponentType, useState, JSX, createElement} from "react";
import {Box, SxProps} from "@mui/material";

import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import {CustomObject} from "@/interfaces/common";

type TListBox<T> = {
    items: T[],
    renderSimpleListComponent: ComponentType<{data: T}>,
    renderComponent: ComponentType<{data: T}>,
    styles?: SxProps
}

const ListBox = <T extends CustomObject>({renderComponent, items, styles, renderSimpleListComponent}: TListBox<T>): JSX.Element => {
    const [isParent, setIsParent] = useState<boolean>(true);
    const [currentChildren, setCurrentChildren] = useState<null | T>(null);

    const handleSetChildren = (item: T) => {
        setIsParent(false);
        setCurrentChildren(item);
    }
    const handleCloseChildren = () => {
        setIsParent(true);
        setCurrentChildren(null);
    }
    return (
        <Box
            sx={{
                ...styles
            }}
        >
            {
                isParent ? (
                    items?.map((item, index) => (
                        <Box
                            key={index}
                            onClick={() => handleSetChildren(item)}
                        >
                            {
                                createElement(renderSimpleListComponent, {data: item})
                            }
                        </Box>
                    ))
                ) : (
                    <Box sx={{
                        width: '100%',
                        height: 'fit-content',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start'
                        }}>
                            <KeyboardBackspaceRoundedIcon
                                onClick={handleCloseChildren}
                            />
                        </Box>
                        <Box sx={{
                            width: '100%',
                            height: 'fit-content',
                        }}>
                            {
                                currentChildren && createElement(renderComponent, {data: currentChildren})
                            }
                        </Box>
                    </Box>
                )
            }
        </Box>
    );
};

export default ListBox;