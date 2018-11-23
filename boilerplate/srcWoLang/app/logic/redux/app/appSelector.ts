import { IStore } from '../../IStore';
import { createSelector } from 'reselect';

const textInput = (state: IStore) => state.app.textFromInputBox;

export const getText = createSelector([textInput], (textInput) => {
    if(textInput === 'basictext') {
        return 'basic';
    } else {
        return 'not_basictext';
    }
});