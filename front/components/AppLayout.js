import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import { Input, Menu, Row, Col } from 'antd';
import UserProfile from '../components/UserProfile'
import LoginForm from '../components/LoginForm'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import  Router  from 'next/router';

const SearchInput = styled(Input.Search)`
    vertical-align : middle;
`;


// AppLayout.propTypes = {
//     children : PropTypes.node.isRequired
// };

const AppLayout = ({children}) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const { me } = useSelector(state => state.user)
    
    const [searchInput, onChangeSearchInput] = useInput('');

    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`)
    },[searchInput])

    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput 
                    value={searchInput}
                    onChange={onChangeSearchInput}
                    onSearch={onSearch}
                    enterButton/>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                {/* gutter => col간에 간격 */}
                <Col xs={24} md={6}>
                {me ? <UserProfile />: <LoginForm />}
                </Col>  
                <Col xs={24} md={12}> 
                {children}
                </Col>  
                <Col xs={24} md={6}>
                    <a href="https://www.naver.com" target="_blank" rel="noreferrer noopener">naver</a>
                </Col>  
            </Row>
        </div>
    );
}

export default AppLayout;