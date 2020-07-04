import { all, fork} from 'redux-saga/effects'
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true; // 쿠키를 주고받기 위함

export default function* rootSaga() { //generate 문법
    yield all([ // 배열을 받고 배열에 있는것 들을 다 실행 시킨다
        fork(postSaga), // fork 는 함수를 실행한다는 뜻 (비동기적)
        // call도 함수를 실행 하는 거지만 fork 와 차이가 있다.
        fork(userSaga),
    ])
}