import React, { useMemo } from 'react';
import { List, Button, Card } from 'antd';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons'
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import { useDispatch } from 'react-redux';

const FollowList = ({ header, data, onClickMore, loading }) => {
    const dispatch = useDispatch();
    const onCancel = (id) => () => {
        if(header === '팔로잉') {
            dispatch({
                type: UNFOLLOW_REQUEST,
                data : id
            })
        } else {
            dispatch({
                type: REMOVE_FOLLOWER_REQUEST,
                data : id
            })
        }
    }


    return (
        <List
            style={{ marginBottom : 20}}
            grid={{gutter : 4, xs: 2, md: 3}}
            size="small"
            header={<div>{header}</div>}
            loadMore={<div style={{textAlign : 'center', margin : '10px 0'}}><Button loading={loading} onClick={onClickMore}>더 보기</Button></div>}
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item style={{ marginTop : 20}}>
                    <Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)}/>]} >
                    <Card.Meta description={item.nickname} />
                </Card>
                </List.Item>
            )}
         />
    );
};

FollowList.propTypes = {
    header : PropTypes.string.isRequired,
    data : PropTypes.array.isRequired,
}

export default FollowList;


