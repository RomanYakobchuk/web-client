import SwipeToDelete from "@/components/swipe/swipeComponent";
import {useState} from "react";
import SwipeComponent from "@/components/swipe/swipeComponent";
import {Add, Delete} from "@mui/icons-material";
import {Box} from "@mui/material";

const AllReviews = () => {

    const [state, setState] = useState([
        {id: 0, title: 'title 1'},
        {id: 1, title: 'title 1'},
        {id: 2, title: 'title 2'},
        {id: 3, title: 'title 3'},
        {id: 4, title: 'title 4'},
        {id: 5, title: 'title 5'},
        {id: 6, title: 'title 6'},
    ])

    const onDelete = (id: number) => {

        setState((prevState) => prevState.filter((row) => row.id !== id));
    }
    return (
        <Box sx={{
            width: '100%',
            overflow: 'hidden'
        }}>
            {
                state?.map((item, index) => (
                    <SwipeComponent
                        key={item?.id}
                        uniqueKey={item?.id?.toString()}
                        leftItem={
                            <Box sx={{width: '100%'}}>
                                <Add onClick={() => setState((prevState) => ([...prevState, {id: Date.now(), title: `title ${index + 1}`}]))}/>
                            </Box>
                        }
                        rightItem={
                            <Box sx={{width: '100%'}}>
                                <Delete onClick={() => onDelete(item?.id)}/>
                            </Box>
                        }
                        leftItemWidth={100}
                        rightItemWidth={100}
                    >
                        <Box sx={{
                            width: '100%',
                            p: 2
                        }}>
                            {item?.title}
                        </Box>
                    </SwipeComponent>
                ))
            }
        </Box>
    );
};
export default AllReviews
