import { combineReducers } from 'redux';
import toastReducer from './toastReducer';

const reducers = combineReducers({
    toastReducer: toastReducer
});

export default reducers;
export type State = ReturnType<typeof reducers>;