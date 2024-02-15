import {CreateButton, List} from "@refinedev/mui";
import {
    DataGrid, DataGridProps, GridColDef,
    GridColumnMenu,
    GridColumnMenuItemProps,
    GridColumnMenuProps, GridRowId, GridToolbar,
    useGridApiContext
} from "@mui/x-data-grid";
import React, {Dispatch, ReactNode, SetStateAction} from "react";
import {Grid, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import IconFilter from "@mui/icons-material/FilterAlt";

import {useMobile} from "@/hook";
import {useNavigate} from "react-router-dom";

function CustomFilterItem(props: GridColumnMenuItemProps) {
    const {onClick, colDef} = props;
    const apiRef = useGridApiContext();
    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            apiRef.current.showFilterPanel(colDef.field);
            onClick(event);
        },
        [apiRef, colDef.field, onClick],
    );
    return (
        <MenuItem onClick={handleClick}>
            <ListItemIcon>
                <IconFilter fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Show Filters</ListItemText>
        </MenuItem>
    );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
    return (
        <GridColumnMenu
            {...props}
            slots={{
                // Override slot for `columnMenuFilterItem`
                columnMenuFilterItem: CustomFilterItem,
            }}
        />
    );
}

type TProps = {
    title: string,
    dataGridProps: DataGridProps<any> | any,
    columns: GridColDef<any, any, any>[],
    isCheckboxSelection?: boolean,
    setSelectedItems?: Dispatch<SetStateAction<GridRowId[]>>,
    accessResource: string,
    createLink: string,
    filtersComponent: ReactNode
}
const GridComponent = ({title, dataGridProps, columns, isCheckboxSelection = true, setSelectedItems, createLink, accessResource, filtersComponent}: TProps) => {

    const navigate = useNavigate();

    const {width, layoutWidth, device} = useMobile();

    return (
        <Grid sx={{
            width: '100%',
            maxWidth: device ? 'calc(100vw - 7px)' : {xs: 'calc(100vw - 14px)', md: `calc(${layoutWidth}px - 14px) !important`},
            transition: 'max-width 300ms linear',
            "& > div":{
                borderRadius: '10px',
            },
        }} item xs={12}>
            <List
                createButtonProps={{
                    color: 'success'
                }}
                headerButtons={[
                    <CreateButton
                        hideText={width < 500}
                        color={'success'}
                        resource={accessResource}
                        onClick={() => navigate(createLink)}
                        key={'create-button'}
                        sx={{
                            textTransform: 'inherit',
                            fontSize: {xs: '14px', md: '16px'}
                        }}
                    />,
                ]}
                headerProps={{
                    sx: {
                        backgroundColor: 'common.black',
                        "& > div > span": {
                            fontSize: {xs: '18px', sm: '20px', md: '22px', lg: '24px'}
                        },
                        "& > div.MuiCardHeader-action":{
                            m: 0
                        }
                    }
                }}
                contentProps={{
                    sx: {
                        backgroundColor: 'common.black',
                        color: 'common.white',
                        width: '100%',
                        maxWidth: '100%'
                    },
                    color: 'common.white'
                }}
                title={title}
                breadcrumb={<></>}
            >
                {filtersComponent}
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    getRowId={row => row._id}
                    disableColumnFilter={true}
                    filterModel={undefined}
                    autoHeight
                    sx={{
                        color: 'common.white',
                        width: '100%',
                        "& div.MuiDataGrid-toolbarContainer button":{
                            color: 'info.main'
                        },
                        "& div.MuiDataGrid-virtualScroller":{
                            "&::-webkit-scrollbar": {
                                height: '7px',
                                borderRadius: '5px',
                                bgcolor: 'transparent'
                            },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: 'info.main',
                                borderRadius: '10px'
                            }
                        }
                    }}
                    disableVirtualization
                    checkboxSelection={isCheckboxSelection}
                    pageSizeOptions={[10, 20, 50, 100]}
                    slots={{
                        columnMenu: CustomColumnMenu,
                        toolbar: GridToolbar,
                    }}
                    onRowSelectionModelChange={(rowSelectionModel) => {
                        if (setSelectedItems && rowSelectionModel?.length > 0) {
                            setSelectedItems(rowSelectionModel)
                        }
                    }}
                />
            </List>
        </Grid>
    );
};
export default GridComponent
