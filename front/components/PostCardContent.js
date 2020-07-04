import React from 'react';
import Link from 'next/link'
const PostCardContent = ({ postData }) => { // 첫뻔째 게시글 #해시태그 #익스프래스
    return (
        <div>
            {postData && postData.split(/(#[^\s#]+)/g).map(((v, i) => {
                if (v.match(/(#[^\s#]+)/g)) {
                    return <Link
                        href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                        as={`/hashtag/${v.slice(1)}`}
                        key={v}
                    ><a>{v}</a></Link>
                }
                return v;
            }))}
        </div>
    );
};

export default PostCardContent;