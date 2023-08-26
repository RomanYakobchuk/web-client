import React, {useEffect, useState} from 'react';
import {useMobile} from "../../../utils";

interface MovingElementProps {
    index: number;
    totalElements: number;
    radius: number;
    duration: number;
}

const MovingElement: React.FC<MovingElementProps> = ({radius, duration, totalElements, index}) => {

    const {width} = useMobile();
    const [angle, setAngle] = useState<number>((2 * Math.PI * index) / totalElements);
    const [isCenter, setIsCenter] = useState<boolean>(true);
    const [distance, setDistance] = useState<number>(radius);
    const [size, setSize] = useState<number>(Math.random() * 50 + width / 10); // Розмір елемента
    const [bR, setBR] = useState<string>(`${Math.floor(Math.random() * (50 - 20 + 1)) + 20}%`); // Розмір елемента
    const [background, setBackground] = useState<string>(
        `linear-gradient(rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}), rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}))`
    ); // Фон елемента

    useEffect(() => {
        const intervalId = setInterval(() => {
            setAngle((prevAngle) => (prevAngle + 0.005) % (2 * Math.PI));
        }, 16); // Запускаємо функцію кожні 16 мс (приблизно 60 кадрів в секунду)

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // const moveTimeout = setTimeout(() => {
        const moveInterval = setInterval(() => {
            setIsCenter((prevIsMoving) => !prevIsMoving); // Змінюємо напрямок руху кожні 5 секунд
        }, 5000);
        // }, )
        return () => clearTimeout(moveInterval);
    }, []);

    useEffect(() => {
        setSize(Math.random() * 50 + width / 10)
    }, [width]);

    useEffect(() => {
        // Оновлена логіка для наближення і віддалення до центру
        setDistance(isCenter ? radius : -radius);
    }, [isCenter, radius]);

    return (
        <div
            style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                background: background,
                borderRadius: bR,
                transition: `transform ${duration / 1000}s linear`,
                transform: `translate(-50%, -50%) translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle) * 1.5}px)`, // Змінено трансформацію
            }}
        ></div>
    );
};

export default MovingElement;
