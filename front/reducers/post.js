import produce from 'immer';
import shortid from "shortid";
// import faker from 'faker'


// export const generateDummyPost = (number) => 
//     Array(number).fill().map(() => ({
//     id : shortid.generate(),
//     User : {
//         id : shortid.generate(),
//         nickname : faker.name.findName()
//     },
//     content: faker.lorem.paragraph(),
//     Images : [{
//         src : faker.image.image(),
//     }],
//     Comments : [{
//         User : {
//             id: shortid.generate(),
//             nickname : faker.name.findName()
//         },
//         content : faker.lorem.sentence(),
//     }],
// }));

export const initalState = {
    mainPosts: [],
    imagePaths: [],

    hasMorePost: true,

    addPostLoading: false,
    addPostDone: false,
    addPostError: null,

    loadPostLoading: false,
    loadPostDone: false,
    loadPostError: null,

    loadAPostLoading: false,
    loadAPostDone: false,
    loadAPostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,

    removePostLoading: false,
    removePostDone: false,
    removePostError: null,

    likePostLoading: false,
    likePostDone: false,
    likePostError: null,

    unLikePostLoading: false,
    unLikePostDone: false,
    unLikePostError: null,

    uploadImagesLoading: false,
    uploadImagesDone: false,
    uploadImagesError: null,

    retweetLoading: false,
    retweetDone: false,
    retweetError: null,

    removeImages: false,
    onePost: {},
};

export const LOAD_A_POST_REQUEST = 'LOAD_A_POST_REQUEST';
export const LOAD_A_POST_SUCCESS = 'LOAD_A_POST_SUCCESS';
export const LOAD_A_POST_FAILURE = 'LOAD_A_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_IMAGES = 'REMOVE_IMAGES';


export const addPost = (data) => ({
    type: ADD_POST_REQUEST,
    data
});


export const addComment = () => ({
    type: ADD_COMMENT_REQUEST,
    data
});

const dummyComment = (data) => ({
    id: shortid.generate(),
    content: data,
    User: {
        id: 1,
        nickname: '제로초',
    }
})

//이전상태를 액션상태로 다음상태로 만들어준다 단 불변성은 지킨다
const reducer = (state = initalState, action) => produce(state, (draft) => {
    switch (action.type) {
        case ADD_POST_REQUEST:
            draft.addPostLoading = true;
            draft.addPostDone = false;
            draft.addPostError = null;
            break;

        case ADD_POST_SUCCESS:
            draft.addPostLoading = false;
            draft.addPostDone = true;
            draft.mainPosts.unshift(action.data);
            draft.imagePaths = [];
            break;


        case ADD_POST_FAILURE:
            draft.addPostLoading = false;
            draft.addPostError = action.error;
            break;
        // Post 생성 

        case ADD_COMMENT_REQUEST:
            draft.addCommentLoading = true;
            draft.addCommentDone = false;
            draft.addCommentError = null;
            break;

        case ADD_COMMENT_SUCCESS: {
            const post = draft.mainPosts.find(v => v.id === action.data.PostId);
            post.Comments.unshift(action.data);
            draft.addCommentLoading = false;
            draft.addCommentDone = true;
            break;
        }

        case ADD_COMMENT_FAILURE:
            draft.addCommentLoading = false;
            draft.addCommentError = action.error;
            break;


        case REMOVE_POST_REQUEST:
            draft.removePostLoading = true;
            draft.removePostDone = false;
            draft.removePostError = null;
            break;


        case REMOVE_POST_SUCCESS:
            draft.removePostLoading = false;
            draft.removePostDone = true;
            draft.mainPosts = draft.mainPosts.filter(v => v.id !== action.data.PostId)
            break;

        case REMOVE_POST_FAILURE:
            draft.removePostLoading = false;
            draft.removePostError = action.error;
            break;
        // 게시글 삭제

        case LOAD_POST_REQUEST:
            draft.loadPostLoading = true;
            draft.loadPostDone = false;
            draft.loadPostError = null;
            break;

        case LOAD_POST_SUCCESS:
            draft.loadPostLoading = false;
            draft.loadPostDone = true;
            draft.mainPosts = draft.mainPosts.concat(action.data)
            draft.hasMorePost = draft.mainPosts.length === 10;
            break;

        case LOAD_POST_FAILURE:
            draft.loadPostLoading = false;
            draft.loadPostError = action.error;
            break;
        //데이터 가져오기
        case LOAD_USER_POSTS_REQUEST:
            draft.loadPostsLoading = true;
            draft.loadPostsDone = false;
            draft.loadPostsError = null;
            break;
        case LOAD_USER_POSTS_SUCCESS:
            draft.loadPostsLoading = false;
            draft.loadPostsDone = true;
            draft.mainPosts = draft.mainPosts.concat(action.data);
            draft.hasMorePosts = action.data.length === 10;
            break;
        case LOAD_USER_POSTS_FAILURE:
            draft.loadPostsLoading = false;
            draft.loadPostsError = action.error;
            break;
        case LOAD_HASHTAG_POSTS_REQUEST:
            draft.loadPostsLoading = true;
            draft.loadPostsDone = false;
            draft.loadPostsError = null;
            break;
        case LOAD_HASHTAG_POSTS_SUCCESS:
            draft.loadPostsLoading = false;
            draft.loadPostsDone = true;
            draft.mainPosts = draft.mainPosts.concat(action.data);
            draft.hasMorePosts = action.data.length === 10;
            break;
        case LOAD_HASHTAG_POSTS_FAILURE:
            draft.loadPostsLoading = false;
            draft.loadPostsError = action.error;
            break;

        case LOAD_A_POST_REQUEST:
            draft.loadAPostLoading = true;
            draft.loadAPostDone = false;
            draft.loadAPostError = null;
            break;

        case LOAD_A_POST_SUCCESS:
            draft.loadAPostLoading = false;
            draft.loadAPostDone = true;
            draft.onePost = action.data
            break;

        case LOAD_A_POST_FAILURE:
            draft.loadAPostLoading = false;
            draft.loadAPostError = action.error;
            break;
        //데이터 가져오기

        case LIKE_POST_REQUEST:
            draft.likePostLoading = true;
            draft.likePostDone = false;
            draft.likePostError = null;
            break;

        case LIKE_POST_SUCCESS: {
            // action.data => PostId , UserId
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Likers.push({ id: action.data.UserId });
            draft.likePostLoading = false;
            draft.likePostDone = true;
            break;
        }

        case LIKE_POST_FAILURE:
            draft.likePostLoading = false;
            draft.likePostError = action.error;
            break;
        // 라이크 작성

        case UNLIKE_POST_REQUEST:
            draft.unLikePostLoading = true;
            draft.unLikePostDone = false;
            draft.unLikePostError = null;
            break;

        case UNLIKE_POST_SUCCESS: {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Likers = post.Likers.filter(v => v.id !== action.data.UserId);
            draft.unLikePostLoading = false;
            draft.unLikePostDone = true;
            break;
        }

        case UNLIKE_POST_FAILURE:
            draft.unLikePostLoading = false;
            draft.unLikePostError = action.error;
            break;
        // 언라이크 작성

        case UPLOAD_IMAGES_REQUEST:
            draft.uploadImagesLoading = true;
            draft.uploadImagesDone = false;
            draft.uploadImagesError = null;
            break;

        case UPLOAD_IMAGES_SUCCESS: {
            draft.uploadImagesLoading = false;
            draft.uploadImagesDone = true;
            draft.imagePaths = action.data
            break;
        }

        case UPLOAD_IMAGES_FAILURE:
            draft.uploadImagesLoading = false;
            draft.uploadImagesError = action.error;
            break;
        // 이미지 업로드

        case RETWEET_REQUEST:
            draft.retweetLoading = true;
            draft.retweetDone = false;
            draft.retweetError = null;
            break;

        case RETWEET_SUCCESS: {
            draft.retweetLoading = false;
            draft.retweetDone = true;
            draft.mainPosts.unshift(action.data)
            break;
        }

        case RETWEET_FAILURE:
            draft.retweetLoading = false;
            draft.retweetError = action.error;
            break;
        // 리트윗

        case REMOVE_IMAGES:
            draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data)

        default:
            break;
    }
});

export default reducer;