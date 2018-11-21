import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './redux/reducers';
import { rootSaga } from './saga/rootSaga';
import 'intl';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer,
   compose(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

export default store;