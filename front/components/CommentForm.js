import { Button, Form, Input } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST  } from '../reducers/post';

const CommentForm = ({ post }) => {
  const id = useSelector((state)=> state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if(addCommentDone) {
      setCommentText('');
    }
  },[addCommentDone])

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data : {content : commentText, postId: post.id, userId : id},
    })
  }, [commentText, id]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
      <div>
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
        <Button style={{ position: 'absolute', right: 0, bottom: -40, zIndex :1 }} type="primary" htmlType="submit" loading={addCommentLoading}>삐약</Button>
      </Form.Item>
    </Form>
      </div>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
