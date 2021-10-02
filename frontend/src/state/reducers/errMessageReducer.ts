import { ActionType } from "../action-types";

const initialState = '';

interface Action {
    type: string,
    payload: string
}

const reducer = (state: string = initialState, action: Action): string => {
    switch (action.type) {
        case ActionType.ERROR:
            return `Error: ${action.payload}`;
        default:
            return state;
    }
};

export default reducer;