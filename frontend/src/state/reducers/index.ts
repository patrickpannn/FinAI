import { combineReducers } from 'redux';
import errMessageReducer from './errMessageReducer';

const reducers = combineReducers({
    errMessage: errMessageReducer
});

export default reducers;
export type State = ReturnType<typeof reducers>;