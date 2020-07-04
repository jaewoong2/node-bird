import { all, fork, take, put, takeEvery, takeLatest, throttle, delay, call } from 'redux-saga/effects'
import axios from 'axios';
import { ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_POST_REQUEST, 
    ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST,
     REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
      LOAD_POST_REQUEST, LOAD_POST_FAILURE, LOAD_POST_SUCCESS, 
       LIKE_POST_REQUEST, LIKE_POST_FAILURE, LIKE_POST_SUCCESS,
       UNLIKE_POST_REQUEST, UNLIKE_POST_FAILURE, UNLIKE_POST_SUCCESS, 
       UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
        RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE, 
        LOAD_A_POST_SUCCESS, LOAD_A_POST_FAILURE, LOAD_A_POST_REQUEST, 
        LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
        LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE
        } from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';
    



function addPostAPI(data) {
    return axios.post('/post', data) // data === req.body 
}

function* addPost(action) {
    try { 
    const result = yield call(addPostAPI, action.data); // call은 동기적 결과값을 기다림
    yield put({ // put은 디스패치
        type : ADD_POST_SUCCESS,
        data : result.data
    });
    yield put({
        type : ADD_POST_TO_ME,
        data : result.data.id
    });
    } catch(err) {
        yield put({
            type : ADD_POST_FAILURE,
            error : err.response.data
        });
    }
}

function* watchAddPost() {
      yield takeLatest(ADD_POST_REQUEST, addPost) //2초동안 1번밖에 안됨   
}
//                     에드포스트                  //
//                     에드코멘트                   //

   
function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data)
}

function* addComment(action) {
    try { 
    const result = yield call(addCommentAPI, action.data); // call은 동기적 결과값을 기다림
    yield put({ // put은 디스패치
        type : ADD_COMMENT_SUCCESS,
        data : result.data
    });
    } catch(err) {
        console.error(err)
        yield put({
            type : ADD_COMMENT_FAILURE,
            error : err.response.data
        });
    }
}

function* watchAddComment() {
      yield takeLatest(ADD_COMMENT_REQUEST, addComment) //2초동안 1번밖에 안됨   
}

//                     에드코멘트                //
//                     리므부                   //

function removePostAPI(data) {
    return axios.delete(`/post/${data}`) // delete는 data를 못넣는다
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data)
        yield put({
            type : REMOVE_POST_SUCCESS,
            data : result.data
        });
        yield put({
            type : REMOVE_POST_OF_ME,
            data : action.data
        });
    } catch (err) {
        yield put({
            type: REMOVE_POST_FAILURE,
            error : err.response.data
        });
    }
}
 
function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost)
}


//                     리무브                  //
//                     로드포스트                   //


function loadPostAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId || 0}`) // queryString 이란, ?key=value
}

function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.lastId)
        yield put({
            type : LOAD_POST_SUCCESS,
            data : result.data,
        });

    } catch (err) {
        yield put({
            tpye: LOAD_POST_FAILURE,
            error : err.response.data
        });
    }
}
 
function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost)
}

//                     로드포스트                  //
//                     로드 어 포스트                  //

function loadAPostAPI(data) {
    return axios.get(`/post/${data}`) 
}

function* loadAPost(action) {
    try {
        const result = yield call(loadAPostAPI, action.data)
        yield put({
            type : LOAD_A_POST_SUCCESS,
            data : result.data,
        });

    } catch (err) {
        yield put({
            type: LOAD_A_POST_FAILURE,
            error : err.response.data
        });
    }
}
 
function* watchLoadAPost() {
    yield takeLatest(LOAD_A_POST_REQUEST, loadAPost)
}

//                     로드 어 포스트                  //
//                     로드 유저 포스트                   //


function loadUserPostAPI(data, lastId) {
    return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`) 
}

function* loadUserPost(action) {
    try {
        const result = yield call(loadUserPostAPI, action.data, action.lastId)
        yield put({
            type : LOAD_USER_POSTS_SUCCESS,
            data : result.data,
        });

    } catch (err) {
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error : err.response.data
        });
    }
}
 
function* watchLoadUserPosts() {
    yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPost)
}

//                     로드 유저 포스트              //
//                     로드 해시태그 포스트           //

function loadHashtagAPI(data, lastId) {
    return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`) 
}

function* loadHashtag(action) {
    try {
        const result = yield call(loadHashtagAPI, action.data, action.lastId)
        yield put({
            type : LOAD_HASHTAG_POSTS_SUCCESS,
            data : result.data,
        });

    } catch (err) {
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error : err.response.data
        });
    }
}
 
function* watchLoadHashTagPosts() {
    yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtag)
}

//                     로드 해시태그 포스트              //
//                     라이크                       //

function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`, data)
}

function* likePost(action) {
    try {
        const result  = yield  call(likePostAPI, action.data)
        yield put({
            type : LIKE_POST_SUCCESS,
            data : result.data // PostId, UserId
        })
    } catch (err) {
        console.err(err);
        yield put({
            type : LIKE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost)
}

//                     라이크                   //
//                     언라이크                   //

function unLikePostAPI(data) {
    return axios.delete(`/post/${data}/unlike`)
}

function* unLikePost(action) {
    try {
        const result  = yield  call(unLikePostAPI, action.data)
        yield put({
            type : UNLIKE_POST_SUCCESS,
            data : result.data
        })
    } catch (err) {
        console.error(err);
        yield put({
            type : UNLIKE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function* watchUnLikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unLikePost)
}
//                     언라이크                   //
//                     업로드이미지                   //

function uploadImagesAPI(data) {
    return axios.post('/post/images', data);
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data)
        yield put({
            type : UPLOAD_IMAGES_SUCCESS,
            data : result.data
        })
    } catch (err) {
        // console.err(err);
        yield put({
            type : UPLOAD_IMAGES_FAILURE,
            error : err.response.data
        })
    }
}

function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages)
}
//                     업로드이미지                   //
//                     리트윗                   //

function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
    try {
        const result = yield call(retweetAPI, action.data)
        yield put({
            type : RETWEET_SUCCESS,
            data : result.data
        })
    } catch (err) {
        // console.err(err);
        yield put({
            type : RETWEET_FAILURE,
            error : err.response.data
        })
    }
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet)
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),  
        fork(watchRemovePost),  
        fork(watchAddComment),  
        fork(watchLoadPost), // posts
        fork(watchLoadUserPosts),  
        fork(watchLoadHashTagPosts),  
        fork(watchLikePost),  
        fork(watchUnLikePost),  
        fork(watchUploadImages), 
        fork(watchRetweet), 
        fork(watchLoadAPost)
    ])
}