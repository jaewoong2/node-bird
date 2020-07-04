import { all, fork,  put, takeLatest, delay, call } from 'redux-saga/effects'
import axios from 'axios';
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, FOLLOW_REQUEST, UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE, FOLLOW_FAILURE, FOLLOW_SUCCESS, SIGN_UP_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, CHANGE_NICKNAME_REQUEST, CHANGE_NICKNAME_FAILURE, CHANGE_NICKNAME_SUCCESS, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE, REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE } from '../reducers/user';



function loadMyInfoAPI() {
    return axios.get('/user')
}

function* loadMyInfo() {
    try { 
    const result = yield call(loadMyInfoAPI); // action.data = {email, password}
    yield put({ // put은 디스패치
        type : LOAD_MY_INFO_SUCCESS,
        data : result.data
    });
    } catch(err) {
        yield put({
            type : LOAD_MY_INFO_FAILURE,
            error : err.response.data
        });
    }
}

function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);

}

////////////////////// 내정보 받기
////////////////////// 유저정보 받기

function loadUserAPI(data) {
    return axios.get(`/user/${data}`)
}

function* loadUser(action) {
    try { 
    const result = yield call(loadUserAPI, action.data); // action.data = {email, password}
    yield put({ // put은 디스패치
        type : LOAD_USER_SUCCESS,
        data : result.data
    });
    } catch(err) {
        yield put({
            type : LOAD_USER_FAILURE,
            data : err.response.data
        });
    }
}

function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, loadUser);

}

/////////////////////로그인확인///////////////////////
/////////////////////로그인///////////////////////


function loginAPI(data) {
    return axios.post('/user/login', data)
}

function* logIn(action) {
    try { 
    const result = yield call(loginAPI, action.data); // action.data = {email, password}
    yield put({ // put은 디스패치
        type : LOG_IN_SUCCESS,
        data : result.data
    });
    } catch(err) {
        yield put({
            type : LOG_IN_FAILURE,
            data : err.response.data
        });
    }
}

function* watchLogin() {
    yield takeLatest(LOG_IN_REQUEST, logIn);

}

/////////////////////로그인///////////////////////
/////////////////////로그인///////////////////////


function logoutAPI() { // generate가 아니다
    return axios.post('/user/logout')
}

function* logOut() {
    try { 
    const result = yield call(logoutAPI); // call은 동기적 결과값을 기다림
    // yield delay(1000);
    yield put({ // put은 디스패치
        type : LOG_OUT_SUCCESS,
        // data : result.data
    });
    } catch(err) {
        yield put({
            type : LOG_OUT_FAILURE,
            error : err.response.data
        });
    }
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

/////////////////////로그아웃///////////////////////
/////////////////////로그아웃///////////////////////


function signUpApi(data) {
    return axios.post('/user', data)
}

function* signUp(action) {
    try { 
    const result = yield call(signUpApi, action.data); // call은 동기적 결과값을 기다림
    console.log(result)
    yield put({ // put은 디스패치
        type : SIGN_UP_SUCCESS,
    });
    } catch (err) {
        yield put({
            type : SIGN_UP_FAILURE,
            // error: err.response.data,
        });
    }
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

/////////////////////회원가입///////////////////////
/////////////////////팔로우///////////////////////

function followApi(data) {
    return axios.patch(`/user/${data}/follow`)
}

function* follow(action) {
    try { 
    const result = yield call(followApi, action.data); // call은 동기적 결과값을 기다림
    yield put({ // put은 디스패치
        type : FOLLOW_SUCCESS,
        data : result.data
    });
    } catch(err) {
        yield put({
            type : FOLLOW_FAILURE,
            error : err.response.data
        });
    }
}

function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow);
}


/////////////////////팔로우///////////////////////
/////////////////////언팔로우///////////////////////


function unFollowApi(data) {
    return axios.delete(`/user/${data}/follow`)
}

function* unfollow(action) {
    try { 
    const result = yield call(unFollowApi, action.data); // call은 동기적 결과값을 기다림
    yield put({ // put은 디스패치
        type : UNFOLLOW_SUCCESS,
        data : result.data
    });
    } catch(err) {
        yield put({
            type : UNFOLLOW_FAILURE,
            error : err.response.datas
        });
    }
}

function* watchUnFollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}


/////////////////////언팔로우///////////////////////
/////////////////////닉네임 변경///////////////////////

function changeNickNameAPI(data) {
    return axios.patch('/user/nickname', data)
}

function* changeNickName(action) {
    try {
        const result = yield call(changeNickNameAPI, action.data);
        yield put({
            type : CHANGE_NICKNAME_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            error : err.response.data
        })
    }
}


function* watchChangeNickName() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickName);
}


/////////////////////닉네임 변경///////////////////////
/////////////////////팔로우리스트///////////////////////

function loadFollowersAPI(data) {
    return axios.get('/user/followers', data)
}

function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data);
        yield put({
            type : LOAD_FOLLOWERS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error : err.response.data
        })
    }
}


function* watchLoadFollowers() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

/////////////////////팔로워 리스트///////////////////////
/////////////////////팔로잉 리스트///////////////////////

function loadFollowingsAPI(data) {
    return axios.get('/user/followings', data)
}

function* loadFollowings(action) {
    try {
        const result = yield call(loadFollowingsAPI, action.data);
        yield put({
            type : LOAD_FOLLOWINGS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error : err.response.data
        })
    }
}


function* watchLoadFollowings() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

/////////////////////팔로워 리스트///////////////////////
/////////////////////팔로워 제거///////////////////////

function removeFollowerAPI(data) {
    return axios.delete(`/user/follower/${data}`)
}

function* removeFollower(action) {
    try {
        const result = yield call(removeFollowerAPI, action.data);
        yield put({
            type : REMOVE_FOLLOWER_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error : err.response.data
        })
    }
}


function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}


export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogOut),
        fork(watchSignUp),
        fork(watchLoadUser),
        fork(watchFollow),
        fork(watchUnFollow),
        fork(watchChangeNickName),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
        fork(watchLoadMyInfo),
    ])
}