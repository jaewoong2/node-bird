// dynamic routing
import React, { useEffect } from 'react';
import Router , { useRouter }  from "next/router";
import axios from 'axios';
import { LOAD_A_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import wrapper from '../../store/cofigureStore';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import Head from 'next/head';
import { message } from 'antd';

const Post = () => {
    const router = useRouter();
    const { onePost } = useSelector(state => state.post);
    const { id } = router.query;

    useEffect(() => {
        if(!onePost.nickname) {
            message.error('게시물이 없습니다');
            Router.replace('/');
        }
    },[onePost.nickname])
  


    return (
        onePost.nickname ?
            <AppLayout>
                <Head>
                    <title>
                        {onePost.User.nickname} 님의 글
                    </title>
                    <meta name="description" content={onePost.content}/>
                    <meta property="og:title" content={`${onePost.User.nickname} 님의 글`}/>
                    <meta property="og:description" content={onePost.content}/>
                    <meta property="og:image" content={onePost.Images[0] ? onePost.Images[0].src :'localhost:3000/favicon.ico'}/>
                    {/* https://nodebird.com */}
                    <meta property="og:url" content={`http://nodebird.com/post/${id}`}/>
                </Head>
                <PostCard post={onePost}/>
            </AppLayout> :
        <AppLayout/>     
    )
};

export const getServerSideProps = wrapper.getServerSideProps( async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 로그인 전에는 쿠키 제거
    //로그인이 공유되는 것을 주의해야함 (내 쿠키값이 한번 넣어지고 그게 저장되서)
    if(context.req && cookie) { // 로그인 하고나서는
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_A_POST_REQUEST,
        data : context.params.id
    });
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END); // dispatch가 끝나는것을 기다려줌
    await context.store.sagaTask.toPromise(); // saga 서버사이드를 위해서
}); // 이부분이 home 보다 먼저 시작된다


export default Post;