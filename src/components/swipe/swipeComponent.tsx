import {Box, SxProps} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {
    ReactNode,
    useRef,
    TouchEvent,
    forwardRef,
    useImperativeHandle,
    RefObject
} from "react";

type TProps = {
    leftItem?: ReactNode,
    rightItem?: ReactNode,
    leftItemWidth?: number,
    rightItemWidth?: number,
    children: ReactNode,
    isSwipeable?: boolean,
    isSwipeLeft?: boolean,
    isSwipeRight?: boolean,
    style?: SxProps,
    ref?: RefObject<CountdownHandle>
}
const SwipeComponent = forwardRef<CountdownHandle, TProps>(({
                                                                rightItem,
                                                                rightItemWidth,
                                                                leftItemWidth,
                                                                leftItem,
                                                                children,
                                                                isSwipeable = true,
                                                                isSwipeRight = true,
                                                                isSwipeLeft = true,
                                                                style
                                                            }, ref) => {

        return (
            <ItemSwipe
                itemRightWidth={rightItemWidth}
                itemLeftWidth={leftItemWidth}
                isSwipeRight={isSwipeRight}
                isSwipeLeft={isSwipeLeft}
                isSwipeable={isSwipeable}
                style={style}
                ref={ref}
            >
                {
                    leftItem && (
                        <LeftElement
                            sx={{
                                position: 'absolute',
                                left: leftItemWidth ? `${-leftItemWidth}px` : '-100%',
                                height: '100%',
                                width: leftItemWidth
                            }}
                        >
                            {leftItem}
                        </LeftElement>
                    )
                }
                <Box className={'swipeContent'}>
                    {children}
                </Box>
                {
                    rightItem && (
                        <RightElement
                            sx={{
                                position: 'absolute',
                                right: rightItemWidth ? `${-rightItemWidth}px` : '-100%',
                                height: '100%',
                                width: rightItemWidth
                            }}
                        >
                            {rightItem}
                        </RightElement>
                    )
                }
            </ItemSwipe>
        );
    }
);
export default SwipeComponent;

const RightElement = styled('div')({
    minWidth: '55px',
})
const LeftElement = styled('div')({
    minWidth: '55px'
})

type TItem = {
    children: ReactNode,
    itemLeftWidth?: number,
    itemRightWidth?: number,
    isSwipeable: boolean,
    isSwipeLeft: boolean,
    isSwipeRight: boolean,
    style?: SxProps,
    childRef?: RefObject<CountdownHandle>,
    timer?: number
}
export type CountdownHandle = {
    currentHandleCenter: () => void;
};
const ItemSwipe = React.forwardRef<CountdownHandle, TItem>(({
                                                                children,
                                                                itemRightWidth,
                                                                itemLeftWidth,
                                                                isSwipeLeft,
                                                                isSwipeRight,
                                                                isSwipeable,
                                                                style,
                                                                timer = 5000
                                                            }, ref) => {
        const childRef = useRef<HTMLDivElement | null>(null);

        let downX: number;
        const defaultByPoint = () => {
            if (childRef.current) {
                const timerDefault = setTimeout(() => {
                    if (childRef.current) childRef.current.style.transform = "translate(0px)"
                }, timer);
                return () => {
                    clearTimeout(timerDefault);
                    onPointerUp();
                }
            }
        }
        const onVibrate = () => {
            if (window.navigator.vibrate) {
                window.navigator.vibrate([1000])
            }
        }
        const onPointerMove = (e: PointerEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const newX = e.clientX;
            if (e.buttons !== 1) {
                return;
            }
            if (childRef.current) {
                if (isSwipeLeft && e.movementX < 0 && (newX - downX) < -70) {
                    childRef.current.style.transform = `translate(-${itemRightWidth ? itemRightWidth : 55}px)`;
                    defaultByPoint();
                } else if (isSwipeRight && e.movementX >= 0 && (newX - downX) >= -70) {
                    childRef.current.style.transform = `translate(${itemLeftWidth ? itemLeftWidth : 55}px)`;
                    defaultByPoint();
                } else childRef.current.style.transform = "translate(0px)"
            }
        }
        const onPointerUp = () => childRef.current?.removeEventListener('pointermove', onPointerMove);
        const onTouchEnd = () => childRef.current?.removeEventListener('touchmove', (e) => onTouchStart(e as any));
        const onPointerDown = (e: PointerEvent) => {
            e.stopPropagation();
            // e.preventDefault();
            downX = e.clientX
            if (childRef.current) {
                childRef.current?.addEventListener('pointermove', (e) => onPointerMove(e as any));
            }
        };
        const defaultByTouch = () => {
            if (childRef.current) {
                const timerDefault = setTimeout(() => {
                    if (childRef.current) childRef.current.style.transform = "translate(0px)"
                }, 5000);
                return () => {
                    clearTimeout(timerDefault);
                    onTouchEnd();
                }
            }
        }
        const onTouchStart = (e: TouchEvent) => {
            // e.stopPropagation();
            downX = e.touches[0].clientX;
            if (childRef.current) {
                childRef.current?.addEventListener('touchmove', (event) => {
                    event.stopPropagation();
                    // event.preventDefault();
                    const newX = event.touches[0].clientX;
                    const deltaX = event.touches[0].clientX - downX;
                    const toLeft = deltaX < -10;
                    const toRight = deltaX > 10;
                    if (childRef.current) {
                        if (isSwipeLeft && toLeft && (newX - downX) < -70) {
                            childRef.current.style.transform = `translate(-${itemRightWidth}px)`;
                            onVibrate();
                            defaultByTouch();
                        } else if (isSwipeRight && toRight && (newX - downX) >= -70) {
                            childRef.current.style.transform = `translate(${itemLeftWidth}px)`;
                            onVibrate();
                            defaultByTouch();
                        } else childRef.current.style.transform = "translate(0px)"
                    }
                });
            }
        };

        const props = isSwipeable ? {
            onPointerDown: (e: any) => onPointerDown(e),
            onPointerUp: onPointerUp,
            onTouchStart: onTouchStart,
            onTouchEnd: onTouchEnd,
            onDragStart: (e: any) => e.preventDefault(),
            onContextMenu: (e: any) => e.preventDefault()
        } : {}


        useImperativeHandle(ref, () => ({
            currentHandleCenter: () => {
                if (childRef.current) {
                    childRef.current.style.transform = "translate(0px)"
                }
            }
        }))

        return (
            <ItemWrapper
                {...props}
                ref={childRef}
                sx={{
                    position: 'relative',
                    ...style
                }}
            >
                {children}
            </ItemWrapper>
        )
    }
)

const ItemWrapper = styled('div')({
    display: 'flex',
    cursor: 'pointer',
    transition: 'transform 500ms',
    userSelect: 'none',
    "& div.swipeContent": {
        flex: '1 0 100%',
        width: '100%'
    }
})
