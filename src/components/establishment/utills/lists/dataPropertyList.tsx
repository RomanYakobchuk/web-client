import {Box, Button, Chip, TextField} from "@mui/material";
import React, { useContext, useState} from "react";
import SortableList, {SortableItem} from "react-easy-sort";
import {Add} from "@mui/icons-material";
import arrayMove from "array-move";

import {ColorModeContext} from "@/contexts";
import {textFieldStyle} from "@/styles";
import {IEstablishmentFormProps, TItemList} from "@/interfaces/formData";


type Props = {
    elements: string[] | any;
    setData: (value: TItemList[]) => void;
    label: string
};


const InputList = ({elements, setData, label}: Props) => {
    const [item, setItem] = useState<string>("");

    const {mode} = useContext(ColorModeContext);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem(e.target.value);
    };
    const handleAddData = (element: string | any) => {
        setData([...elements, element])
    }

    const handleAddNumber = () => {
        if (item) {
            handleAddData({value: item});
            setItem("");
        }
    };
    const handleDeleteData = (index: number | any) => {
        setData(elements.filter((_: any, i: any) => i !== index));
    };

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setData(arrayMove(elements, oldIndex, newIndex))
    }
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: elements?.length > 0 ? 1 : 0
            }}
        >
            <Box gap={2} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TextField
                    label={label}
                    variant="outlined"
                    fullWidth
                    value={item ? item : ''}
                    color={"secondary"}
                    size={"small"}
                    sx={textFieldStyle}
                    type={"text"}
                    onChange={handleInputChange}
                />
                <Button
                    variant="contained" color={"info"} onClick={handleAddNumber}>
                    <Add/>
                </Button>
            </Box>
            <SortableList
                onSortEnd={onSortEnd}
            >
                {elements?.map((element: any, index: any) => (
                    <SortableItem
                        key={index}
                    >
                        <Chip
                            label={element.value}
                            onDelete={() => handleDeleteData(index)}
                            size={"small"}
                            color={'info'}
                            sx={{
                                cursor: 'grab',
                                px: 1,
                                py: 0.3,
                                height: 'auto',
                                fontSize: '16px',
                                m: 0.5,
                                // borderColor: mode === "dark" ? '#fcfcfc' : '#314d63'
                            }}
                            variant="filled"
                        />
                    </SortableItem>
                ))}
            </SortableList>
            {/*<Grid item xs={12}>*/}
            {/*    {elements?.map((element: any, index: any) => (*/}
            {/*        <Chip*/}
            {/*            key={index}*/}
            {/*            label={element.value}*/}
            {/*            onDelete={() => handleDeleteData(index)}*/}
            {/*            size={"small"}*/}
            {/*            sx={{*/}
            {/*                p: "5px",*/}
            {/*                fontSize: '16px',*/}
            {/*                m: 0.5,*/}
            {/*                color: (theme) => theme.palette.secondary.main,*/}
            {/*                borderColor: mode === "dark" ? '#fcfcfc' : '#314d63'*/}
            {/*            }}*/}
            {/*            variant="outlined"*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</Grid>*/}
        </Box>
    );
};

export default InputList;
