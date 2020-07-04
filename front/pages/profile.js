import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import NickNameEditForm from '../components/NickNameEditForm';
import FollowList from '../components/FollowList';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import Router from 'next/router'; // 이렇게 해야함
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/cofigureStore'
import axios from 'axios'
import { LOAD_POST_REQUEST } from '../reducers/post';
import { END } from 'redux-saga';
import useSWR from 'swr';


const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data)

const Profile = (props) => {
    // 더미데이터 
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    
    const [followersLimit, setFollowersLimit] = useState(3)
    const [followingsLimit, setFollowingsLimit] = useState(3)

    const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher)
    const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher)

    useEffect(() => {
        if (!(me && me.id)) {
            message.warn('로그인 하지 않았습니다');
            Router.push('/')
        }
    }, [me && me.id]);

    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit(prev => prev + 3)
    },[])
    
    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit(prev => prev + 3)
    },[])

    if (!me) {
        return <div>내 정보 로딩중</div>;
    }

    if (followerError && followingError) {

        console.log(followerError || followingError);
        return <div>팔로워/팔로잉 로딩 중 에러가 발생</div>
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8"></meta>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NickNameEditForm />
                <FollowList header="팔로잉 목록" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError}/>
                <FollowList header="팔로워 목록" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError}/>
            </AppLayout>
        </>
    );
}


export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 로그인 전에는 쿠키 제거
    //로그인이 공유되는 것을 주의해야함 (내 쿠키값이 한번 넣어지고 그게 저장되서)
    if (context.req && cookie) { // 로그인 하고나서는
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


export default Profile;