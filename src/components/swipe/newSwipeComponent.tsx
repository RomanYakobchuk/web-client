import TinyGesture from "tinygesture";
import {useEffect, ReactNode, FC, useRef} from "react";
import {Box} from "@mui/material";

interface SwipeProps {
    children: ReactNode;
    uniqueValue?: string
}

type NewTinyGesture = TinyGesture<HTMLElement> & {
    [key: string]: any
}

export const NewSwipeComponent: FC<SwipeProps> = ({children, uniqueValue}) => {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {

        // const target = document.querySelector(`#${uniqueValue}.swipe-item`.toString()) as HTMLElement | null;
        //
        // if (!target) return;
        if (!ref.current) return;
        const target = ref.current;

        let swiped: boolean | number = false;
        let startOffset: boolean | number = 0;
        const decelerationOnOverflow = 4;
        const revealWidth = 100;
        const snapWidth = revealWidth / 1.5;
        const isLeft = true;
        const isRight = false;

        const gesture = new TinyGesture(target) as NewTinyGesture;
        const defaultFrame = () => window.requestAnimationFrame(() => {
            (target as HTMLElement).style.transition = 'transform .2s ease-in';
            swiped = false;
            startOffset = 0;
            (target as HTMLElement).style.transform = 'unset';
        });
        gesture.on('panmove', () => {
            if (gesture.animationFrame) {
                return;
            }
            gesture.animationFrame = window.requestAnimationFrame(() => {
                let getX = (x: number): number => {
                    let returnValue = 0;
                    if (x < revealWidth && x > -revealWidth) {
                        return x;
                    }
                    if (x < -revealWidth) {
                        returnValue = (x + revealWidth) / decelerationOnOverflow - revealWidth;
                        if (!isRight) {
                            setTimeout(() => defaultFrame(), 300);
                        }
                        return returnValue;
                    }
                    if (x > revealWidth) {
                        returnValue = (x - revealWidth) / decelerationOnOverflow + revealWidth;
                        if (!isLeft) {
                            setTimeout(() => defaultFrame(), 300);
                        }
                        return returnValue;
                    } else returnValue = 0;
                    return returnValue;
                };
                const gTouchMoveX = gesture?.touchMoveX as number || 0;
                let newX = 0;
                if (typeof startOffset === 'number') {
                    newX = getX(startOffset + gTouchMoveX);
                }
                (target as HTMLElement).style.transform = `translateX(${newX}px)`;
                if (newX && (newX >= snapWidth || newX <= -snapWidth)) {
                    swiped = newX < 0 ? -revealWidth : revealWidth;
                } else {
                    swiped = false;
                }
                window.requestAnimationFrame(() => {
                    (target as HTMLElement).style.transition = 'unset';
                });
                gesture.animationFrame = null;
            });
        });

        gesture.on('panend', () => {
            window.cancelAnimationFrame(gesture.animationFrame);
            gesture.animationFrame = null;
            window.requestAnimationFrame(() => {
                (target as HTMLElement).style.transition = 'transform .2s ease-in';
                if (!swiped) {
                    startOffset = 0;
                    (target as HTMLElement).style.transform = 'unset';
                } else {
                    startOffset = swiped;
                    (target as HTMLElement).style.transform = `translateX(${swiped}px)`;
                }
            });
            setTimeout(() => {
                defaultFrame();
            }, 7000)
        });
        gesture.on('doubletap', () => {
            defaultFrame();
        });
    }, [uniqueValue, ref?.current]);

    return <Box ref={ref} className="swipe-item" id={uniqueValue} sx={{
        touchAction: 'none',
        width: '100%',
        userSelect: 'none',
    }}>{children}</Box>
};