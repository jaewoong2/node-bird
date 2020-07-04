import React, { useEffect } from 'react';
import { Card, Button, Popover, Avatar, List, Comment, message } from 'antd';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux';
import PostImges from './PostImges';
import { useState } from 'react';
import { useCallback } from 'react';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';

moment.locale('ko');


const PostCard = ({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.user);
    const { removePostLoading, retweetError } = useSelector((state) => state.post);
    const id = me?.id; // me && me.id

 

    const onLike = useCallback(() => {
        if(!id) {
             message.warn('로그인이 필요합니다');
        }
        return dispatch({
            type : LIKE_POST_REQUEST,
            data : post.id,
        })
    },[])
    const onUnLike = useCallback(() => {
        if(!id) {
             message.warn('로그인이 필요합니다');
        }
        return  dispatch({
            type: UNLIKE_POST_REQUEST,
            data : post.id
        })
    },[])

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    },[])


    const onClickRemove = useCallback(() => {
        if(!id) {
             message.warn('로그인이 필요합니다');
        }
        return dispatch({
                type: REMOVE_POST_REQUEST,
                data : post.id
            })
        },[])

    const onRetweet = useCallback(() => {
        if(!id) {
             message.warn('로그인이 필요합니다');
        }
        return dispatch({
            type : RETWEET_REQUEST,
            data : post.id
        })
    },[id])

    const liked = post.Likers ? post.Likers.find(v => v.id === id) : false
        // 좋아요 한 게시물을 삭제 하면 사라지는듯..?

    return (
        <div style={{ marginBottom : '20'}}>
            <Card
                cover={post.Images[0] && <PostImges images={post.Images}/>}
                actions={[
                    <RetweetOutlined onClick={onRetweet} key="retweet" />,
                    liked 
                     ? <HeartTwoTone  twoToneColor="#eb2f96" onClick={onUnLike} key="heart" />
                     : <HeartOutlined key="heart" onClick={onLike} />,
                    <MessageOutlined key="comment" onClick={onToggleComment}/>,
                    <Popover key="more" content={(
                        <Button.Group>
                            {id && post.User.id === id ? (
                            <>
                            <Button>수정</Button>
                            <Button type="danger" loading={removePostLoading} onClick={onClickRemove}>삭제</Button>
                            </>
                            ) : (
                            <>
                            <Button>신고</Button>
                            </>
                            )
                            }
                        </Button.Group>
                    )}>
                        <EllipsisOutlined key="more"/>
                    </Popover>,
                ]}
                
                extra={id && post.User.id !== me.id && id && <FollowButton post={post} />}
            >
               {post.RetweetId && post.Retweet
               ? (
                <Card
                title={`'${post.User.nickname}' 님이 '${post.Retweet.User.nickname}' 님의 게시물을 리트윗 하였습니다`}
                cover={post.Retweet.Images[0] && <PostImges images={post.Retweet.Images} />}
              >
                  <div style={{ float : 'right'}}>{moment(post.createdAt).format("YYYY.MM.DD")}</div>
                <Card.Meta
                  avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`}>
                      <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                  )}
                  title={post.Retweet.User.nickname}
                  description={<PostCardContent postData={post.Retweet.content} />}
                />
              </Card>
               ) : 
               (
                <>
                <div style={{ float : 'right'}}>{moment(post.createdAt).fromNow()}</div>
                <Card.Meta
                avatar={(
                <Link href={`/user/${post.User.id}`}>
                <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                  </Link>
                  )}
                title={post.User.nickname}
                description={<PostCardContent postData={post.content}/>} 
                />
                </>
                )}
                </Card>
            {commentFormOpened && (
                <div>
                <CommentForm post={post}/>
                 <List
                    header={`${post.Comments.length}개의 댓글`}
                    itemLayout="horizontal"
                    dataSource={post.Comments}
                    renderItem={(item) => (
                        <li>
                            <Comment
                                author={item.User.nickname}
                                avatar={(
                                <Link href={`/user/${item.User.id}`}>
                                <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                                </Link>
                                )}
                                content={item.content}
                            />
                        </li>
                    )}
                 />
                </div>
            )}
            {/* <CommentFrom />
            <Commnts /> */}
        </div>
    );
};

export default PostCard;