import React, { useMemo, useCallback } from 'react';
import { Input, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';


const NickNameEditForm = () => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user); 
    const [nickname, onChangeNickName] = useInput(me?.nickname || '');
    const style = useMemo(() => {
        return {
            marginBottom : '20px',
            border : '1px solid #d9d9d9',
            padding : '30px',
        }
    },[])

    const onSubmit = useCallback(() => {
        dispatch({
            type : CHANGE_NICKNAME_REQUEST,
            data : {nickname  : nickname}
        })
    },[nickname])


    return (
        <Form style={style}  onFinish={onSubmit}>
            <Input.Search addonBefore="닉네임" enterButton="수정" value={nickname} onChange={onChangeNickName}
                onSearch={onSubmit}
             />
        </Form>
    );
};

export default NickNameEditForm;