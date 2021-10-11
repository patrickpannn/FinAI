export type ToastColor = 'info' | 'error' | 'success' | 'warning';

export enum ActionType {
    SET_TOAST = 'SET_TOAST'
};

export interface ToastState {
    type: ToastColor
    message: string
};

export interface Action {
    type: string,
    payload: ToastState
};