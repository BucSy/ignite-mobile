import { getText } from '../app/appSelector';

const state = {
    app: {
        textFromInputBox: 'basicstring',
    }
}

describe('App selector', () => {
    it('getLocal selector', () => {
        expect(getText(state)).toEqual('not_basictext');
    })
})