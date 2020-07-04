import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Form, Checkbox, Input, Button, message } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import Router from 'next/router';
import { LOAD_POST_REQUEST } from '../reducers/post';
import wrapper from '../store/cofigureStore';
import axios from 'axios'
import { END } from 'redux-saga';


const ErrorMessage = styled.div`
    color : red;
`
const SignUp = () => {
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [nickname, onChangeNickName] = useInput('');

    const { signUpLoading, signUpDone, signUpError, me } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false);
    
    const onChangePasswordCheck = useCallback((e) => { 
        setPasswordCheck(e.target.value)
        setPasswordError(e.target.value !== password);
    },[password])
    
    useEffect(() => {
        if(me && me.id) {
            Router.replace('/');
        }
    },[me && me.id])


    useEffect(() => {
        if(signUpDone) {
            Router.replace('/');
        }
    },[signUpDone])

    useEffect(() => {
        if(signUpError) {
            message.error(signUpError);
        }
    },[signUpError])

    
    const onSubmit = useCallback(() => {
        if(password !== passwordCheck) {
            return setPasswordError(true);
        }
        if(!term) {
            return setTermError(true);
        }

        const variables = {
            email : email,
            password : password, 
            nickname : nickname 
        }

        dispatch({
            type: SIGN_UP_REQUEST,
            data : variables
        })

    }, [email, password, passwordCheck, term]);

    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false)
    },[])
    
        return (
        <AppLayout>
        <Head>
        <meta charSet="utf-8"></meta>
            <title> 회원가입 | NodeBird</title>
        </Head>
            <Form onFinish={onSubmit}>
            <div>
                <label htmlFor="user-id">이메일</label>
                <br />
                <Input type="email" name="user-email" value={email} onChange={onChangeEmail} required/>
            </div>
            <div>
                <label htmlFor="user-nick">닉네임</label>
                <br />
                <Input name="user-nick" value={nickname} onChange={onChangeNickName} required/>
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input type="password" name="user-password" value={password} onChange={onChangePassword} required/>
            </div>
            <div>
                <label htmlFor="user-password-check">비밀번호 확인</label>
                <br />
                <Input  type="password" name="user-password-check" value={passwordCheck} onChange={onChangePasswordCheck} required/>
                {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
            </div>
            <div>
                <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>약관동의</Checkbox>
                {termError && <ErrorMessage>약관에 동의 하셔야 합니다</ErrorMessage>}
            </div>
            <div style={{ marginTop : 10}}>
                <Button type='primary' htmlType="submit" loading={signUpLoading}>가입하기</Button>
            </div>
            </Form>
        </AppLayout>
    );  
}


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



export default SignUp;