import React, {Dispatch, ReactNode, SetStateAction, useContext, useRef} from "react";
import {BottomSheet, BottomSheetRef} from "react-spring-bottom-sheet";

import ContainerSheet from "@/components/drawer/swipeDrawer/sheet/containerSheet";
import SheetContent from "@/components/drawer/swipeDrawer/sheet/sheetContent";
import SnapMarker from "@/components/drawer/swipeDrawer/snapMarker";
import {ColorModeContext} from "@/contexts";
import './style.css'

type TSwipeProps = {
    isVisible: boolean,
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    header: ReactNode,
    children: ReactNode,
}
const SwipeDrawer = ({isVisible, toggleDrawer, header, children}: TSwipeProps) => {

    const {mode} = useContext(ColorModeContext);
    const focusRef = useRef<HTMLButtonElement | null>(null);
    const sheetRef = useRef<BottomSheetRef | null>(null);

    // const [expandOnContentDrag, _] = useState<boolean>(true);

    function onDismiss() {
        toggleDrawer(false)
    }

    return (
        <ContainerSheet>
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
            <BottomSheet
                skipInitialTransition
                open={isVisible}
                ref={sheetRef}
                blocking={false}
                onDismiss={onDismiss}
                initialFocusRef={focusRef}
                defaultSnap={({maxHeight}) => maxHeight / 2}
                snapPoints={({maxHeight}) => [
                    maxHeight - maxHeight / 20,
                    maxHeight - maxHeight / 5,
                    maxHeight / 4,
                    maxHeight / 3,
                    maxHeight * 0.6,
                ]}
                className={mode === 'dark' ? 'dark' : ''}
                // expandOnContentDrag={expandOnContentDrag}
                // Коли це true то ніякі події не працюють
                header={
                    header
                }
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
        </ContainerSheet>
    )
};
export default SwipeDrawer;