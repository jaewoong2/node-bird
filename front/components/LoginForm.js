import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction, LOG_IN_REQUEST } from '../reducers/user';
import { useEffect } from 'react';
const ButtonWrapper = styled.div`
    margin-top : 10px;
`;

const FormWrapper = styled(Form)`
    padding : 10px;
`


const LoginForm = () => {
    const { loginLoading, loginError } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmitForm = useCallback(() => {
        dispatch({
            type : LOG_IN_REQUEST,
            data : { email, password},
        })
    },[email, password])

    useEffect(() => {
        if(loginError) {
            alert(loginError)
        }
    },[loginError])



    return (
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-email">이메일</label>
                <br />
                <Input name="user-email" value={email} onChange={onChangeEmail} required/>
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input 
                type="password"
                name="user-password"
                value={password} 
                onChange={onChangePassword} 
                required/>
            </div>
            <ButtonWrapper>
                {/* 태그안에 직접 style={{}} 하면 객체라서 리랜더링 될때마다 새롭게 리랜더링됨 */}
                <Button type="primary" htmlType="submit" loading={loginLoading}>
                    로그인
                </Button>
                    <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>
        </FormWrapper>
        
    );
}

export default LoginForm;