import { ActionType, ToastState, Action, ToastColor } from "../action-types";

const initialState = {
    type: 'error' as ToastColor,
    message: ''
};

const reducer = (
    state: ToastState = initialState,
    action: Action
): ToastState => {
    switch (action.type) {
        case ActionType.SET_TOAST:
            return action.payload;
        default:
            return state;
    }
};

export default reducer;