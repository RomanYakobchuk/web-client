import React, {Dispatch, ReactNode, SetStateAction, useContext, useRef, MouseEvent} from "react";
import {BottomSheet, BottomSheetRef} from "react-spring-bottom-sheet";

import ContainerSheet from "@/components/drawer/swipeDrawer/sheet/containerSheet";
import SheetContent from "@/components/drawer/swipeDrawer/sheet/sheetContent";
import SnapMarker from "@/components/drawer/swipeDrawer/snapMarker";
import {ColorModeContext} from "@/contexts";
import './style.css'
import ReactDOM from "react-dom";
import {Box, SxProps} from "@mui/material";

type TSwipeProps = {
    isVisible: boolean,
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    header: ReactNode,
    children: ReactNode,
    defaultSnap?: number,
    snapPoints?: number[],
    styles?: SxProps,
    classes?: string
}
const SwipeDrawer = ({isVisible, toggleDrawer, header, children, defaultSnap, snapPoints, styles, classes}: TSwipeProps) => {

    const {mode} = useContext(ColorModeContext);
    const focusRef = useRef<HTMLButtonElement | null>(null);
    const sheetRef = useRef<BottomSheetRef | null>(null);

    // const [expandOnContentDrag, _] = useState<boolean>(true);

    function onDismiss(event?: MouseEvent<HTMLDivElement>) {
        event?.preventDefault();
        event?.stopPropagation();
        toggleDrawer(false)
    }

    return ReactDOM.createPortal(
        <ContainerSheet
            styles={{
                ...styles
            }}
        >
            <SnapMarker
                className="text-white text-opacity-50"
                style={{top: '10vh'}}
            />
            <SnapMarker style={{top: '10vh', ['--size' as any]: '0.5vh'}}/>
            <SnapMarker
                className="text-white text-opacity-50"
                style={{top: '40vh'}}
            />
            <SnapMarker style={{top: '40vh', ['--size' as any]: '0.5vh'}}/>
            <SnapMarker
                className="text-white text-opacity-50"
                style={{top: '75vh'}}
            />
            <SnapMarker style={{top: '75vh', ['--size' as any]: '0.5vh'}}/>
            {
                isVisible && (
                    <Box sx={{
                        position: 'fixed',
                        inset: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(220, 220, 220, 0.2)',
                        backdropFilter: 'blur(3px)'
                    }}
                         onClick={(event) => onDismiss(event)}
                    />
                )
            }
            <BottomSheet
                skipInitialTransition
                open={isVisible}
                ref={sheetRef}
                blocking={false}
                onDismiss={onDismiss}
                initialFocusRef={focusRef}
                defaultSnap={defaultSnap ? defaultSnap : ({maxHeight}) => maxHeight - maxHeight / 20}
                snapPoints={({maxHeight}) => (snapPoints && snapPoints?.length > 0) ? snapPoints : [
                    maxHeight - maxHeight / 20,
                    maxHeight - maxHeight / 5,
                    maxHeight / 4,
                    maxHeight / 3,
                    600,
                    maxHeight * 0.6,
                ]}

                className={(mode === 'dark' ? 'dark' : '') + ' ' + classes}
                // expandOnContentDrag={expandOnContentDrag}
                // Коли це true то ніякі події не працюють
                header={
                    header
                }
                id={'bottomCaplSheet'}
            >
                <SheetContent
                    style={{
                        marginTop: '20px',
                        padding: '8px',
                    }}
                    className={mode === 'dark' ? 'dark' : ''}
                >
                    {children}
                </SheetContent>
            </BottomSheet>
        </ContainerSheet>, document.body
    )
};
export default SwipeDrawer;