import { combineReducers, Reducer } from 'redux';
import appReducer from './app/appReducer';
import { IStore } from '../IStore';

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
    app: appReducer,
});

export default rootReducer;