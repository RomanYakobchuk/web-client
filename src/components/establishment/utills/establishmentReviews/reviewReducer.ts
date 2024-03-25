import {INewReview} from "@/interfaces/common";
import {Reducer} from "react";

type Action =
    | { type: 'SET_SCORE'; payload: number | null }
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_TEXT'; payload: string }
    | { type: 'SET_QUALITY'; payload: number | null }
    | { type: 'SET_ATMOSPHERE'; payload: number | null }
    | { type: 'SET_SERVICE'; payload: number | null }
    | { type: 'SET_CLEAR'; payload: null };
const initialState: INewReview = {
    score: null,
    title: '',
    text: '',
    quality: null,
    atmosphere: null,
    service: null,
};
const reducer: Reducer<INewReview, Action> = (state, action) => {
    switch (action.type) {
        case 'SET_SCORE':
            return {...state, score: action.payload};
        case 'SET_TITLE':
            return {...state, title: action.payload};
        case 'SET_TEXT':
            return {...state, text: action.payload};
        case 'SET_QUALITY':
            return {...state, quality: action.payload};
        case 'SET_ATMOSPHERE':
            return {...state, atmosphere: action.payload};
        case 'SET_SERVICE':
            return {...state, service: action.payload};
        case 'SET_CLEAR':
            return {score: null, title: '', quality: null, service: null, atmosphere: null, text: ''};
        default:
            return state;
    }
};


export {
    reducer,
    initialState,
}

export type {
    Action
}