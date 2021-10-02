import { ActionType } from "../action-types";
import { Dispatch } from "react";

interface Action {
    type: string,
    payload: string
}

export type DisplayReturnType = (dispatch: Dispatch<Action>) => void;

export const displayErrorMessage = (msg: string): DisplayReturnType => {
    return (dispatch: Dispatch<Action>): void => {
        dispatch({
            type: ActionType.ERROR,
            payload: msg
        });
    };
};