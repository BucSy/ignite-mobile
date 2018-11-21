import { IStore } from '../../IStore';
import { createSelector } from 'reselect';

const locale = (state: IStore) => state.app.language;

export const getLocale = createSelector([locale], (locale) => {
    if(locale === 'en') {
        return 'angol';
    } else if (locale === ''){
        return 'alapertelmezett';
    } else if(locale === 'hu') {
        return 'magyar';
    }
});