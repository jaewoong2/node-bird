import React, { useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { message } from 'antd';
import wrapper from '../store/cofigureStore';
import { END } from 'redux-saga';
import axios from 'axios';

const Home = () => {
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector((state) => state.post);
    const myRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if(retweetError){
            return message.warn(retweetError)
        }
    }, [retweetError])

        useEffect(() => {
            function onScroll() {
                if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                    if(hasMorePost && !loadPostLoading) {
                        const lastId = mainPosts[mainPosts.length - 1]?.id;
                        dispatch({
                            type : LOAD_POST_REQUEST,
                            lastId,
                        });
                    }
                }
            }
            window.addEventListener('scroll', onScroll);
            return () => {
                window.removeEventListener('scroll', onScroll);
                // useEffect에서 window.addEvnetListener 를 하면 
                // 항상 리턴으로 지워줘야함 | 데이터가 쌓여서
            };
        },[hasMorePost, loadPostLoading, mainPosts]) 
    
  
    return (
        <div ref={myRef}>
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post, idx) => <PostCard key={post.id} post={post}/>)}
        </AppLayout>
        </div>
    );
};

export const getServerSideProps = wrapper.getServerSideProps( async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 로그인 전에는 쿠키 제거
    //로그인이 공유되는 것을 주의해야함 (내 쿠키값이 한번 넣어지고 그게 저장되서)
    if(context.req && cookie) { // 로그인 하고나서는
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END); // dispatch가 끝나는것을 기다려줌
    await context.store.sagaTask.toPromise(); // saga 서버사이드를 위해서
}); // 이부분이 home 보다 먼저 시작된다


export default Home;