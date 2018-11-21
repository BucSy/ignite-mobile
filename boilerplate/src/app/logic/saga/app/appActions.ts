import { action } from 'typesafe-actions';

export const TEXT_FROM_INPUTBOX: string = 'TEXT_FROM_INPUTBOX';
export const TEXT_TO_STORE: string = 'TEXT_TO_STORE';
export const CHANGE_LANGUAGE: string = 'CHANGE_LANGUAGE';

export const actions = {
    textInputBox: (payload: string) => action(TEXT_TO_STORE, payload ),
    textToBasictext: () => action(TEXT_FROM_INPUTBOX),
    changeLanguage: (payload: string) => action(CHANGE_LANGUAGE, payload),
}