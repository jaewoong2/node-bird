import { createWrapper } from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from "redux";

import { composeWithDevTools } from 'redux-devtools-extension'
// import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas';


const configureStore = (context) => {
      console.log(context); // 로그확인

    const sagaMiddleware = createSagaMiddleware();
    const middleWares = [sagaMiddleware];

    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middleWares))
    : composeWithDevTools(applyMiddleware(...middleWares))
    const store = createStore(reducer, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

const wrapper = createWrapper(configureStore, 
    { debug : process.env.NODE_ENV === 'development',}// 옵션설정
    )

export default wrapper;