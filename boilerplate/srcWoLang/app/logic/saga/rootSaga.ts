import { takeEvery } from 'redux-saga/effects';
import { TEXT_FROM_INPUTBOX } from './app/appActions';
import { appTextInput } from './app/appSaga';

export function* rootSaga() {
    yield takeEvery([TEXT_FROM_INPUTBOX], appTextInput);
}