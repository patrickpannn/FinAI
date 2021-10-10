import { ActionType, Action, ToastState } from "../action-types";
import { Dispatch } from "react";
import { toast } from "react-toastify";

export type DisplayReturnType = (dispatch: Dispatch<Action>) => void;

export const setToast = ({ 
    type,
    message
 }: ToastState): DisplayReturnType => {
    return (dispatch: Dispatch<Action>): void => {
        dispatch({
            type: ActionType.SET_TOAST,
            payload: {
                type,
                message
            }
        });
        toast[type](message);
    };
};