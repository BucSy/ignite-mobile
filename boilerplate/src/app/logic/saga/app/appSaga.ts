import { put, call } from 'redux-saga/effects';
import { TEXT_TO_STORE } from '../app/appActions';

function appTextInputHandler() {
    const text = 'basictext';
    return text;
}

export function* appTextInput() {
    const text = yield call(appTextInputHandler);
    yield put({type: TEXT_TO_STORE, payload: text});
}