import {KeyboardEvent} from 'react';
export const handleKeyDownBlockEnter = (event: KeyboardEvent<HTMLInputElement | HTMLDivElement>, text: string) => {
    if (event.key === 'Enter' && text.length === 0) {
        event.preventDefault(); // Блокуємо подію Enter, якщо довжина тексту рівна 0
    }
};