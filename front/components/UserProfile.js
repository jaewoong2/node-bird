import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { me, isLoggingOut } = useSelector((state) => state.user);

    const onLogout = useCallback(() => {
        dispatch(logoutRequestAction());
    }, [])


    return (
        <div>
            <Card
                actions={[
                    <div key="twit"><Link href={`/user/${me.id}`}><a>글 수<br />{me.Posts ? me.Posts.length : 'O'}</a></Link></div>,
                    <div key="followings"><Link href={`/profile`}><a>팔로잉<br />{me.Followings ? me.Followings.length : '0'}</a></Link></div>,
                    <div key="followers"><Link href={`/profile`}><a>팔로워<br />{me.Followers ? me.Followers.length : '0'}</a></Link></div>
                ]}>
                <Card.Meta title={me.nickname} avatar={<Link href={`/user/${me.id}`}><a><Avatar>{me.nickname[0]}</Avatar></a></Link>} />
                <Button onClick={onLogout} loading={isLoggingOut}>로그아웃</Button>
            </Card>
        </div>
    );
}

export default UserProfile;


