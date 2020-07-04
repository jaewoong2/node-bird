import React, { useCallback, useState, useRef, useEffect } from 'react';
import Form from 'antd/lib/form/Form';
import { Input, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGES } from '../reducers/post';

const PostForm = () => {
    const dispatch = useDispatch();
    const imageInput = useRef();
    const { imagePaths, addPostDone } = useSelector((state) => state.post);

    const [text, setText] = useState('');
    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    },[text])

    const onSubmit = useCallback(() => {
        if(!text || !text.trim()) {
            return message.warn('게시글을 작성하세요')
        }
        const formData = new FormData();
        imagePaths.forEach((p) => {
            formData.append('image', p)
        });
        formData.append('content', text);
        return dispatch({
            type : ADD_POST_REQUEST,
            data : formData
        });
    },[text, imagePaths])

    useEffect(() => {
        if (addPostDone) {
          setText('');
        }
      }, [addPostDone]);


    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    },[imageInput.current])

    const onChangeInput = useCallback((e) => {
        console.log('images', e.target.files) // 우리가 선택한 이미지 정보
        const imageFormData = new FormData(); // multer 가 처리하기 위해
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f); // 키, 값 ( upload.array('image') ) 의 키('images) 값이랑 같아야함
            console.log(imageFormData)
        });
        dispatch({
            type : UPLOAD_IMAGES_REQUEST,
            data : imageFormData
        })
    });

    const onRemoveImage = useCallback((index) => () => {
        dispatch({
            type : REMOVE_IMAGES,
            data : index
        })
    },[])


    return (
        <Form style={{ margin: '10px 0 20px'}} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea 
             value={text}
             onChange={onChangeText}
             maxLength={140}
             placeholder="어떤 신기한 일이 있었나요?"
            />
            <div>
                <input type="file" name='image' multiple hidden ref={imageInput} onChange={onChangeInput}/>
                <Button onClick={onClickImageUpload}>
                    이미지업로드
                </Button>
                <Button type="primary" style={{float:'right'}} htmlType="submit">
                    쨱짹
                </Button>
            </div>
            <div>
                {imagePaths.map((v, i) => {
                  return  <div key={v} style={{ display : 'inline-block'}}>
                        <img src={`http://localhost:3065/${v}`} style={{ width :'200px' }} alt={v}/>
                        <div>
                            <Button onClick={onRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                })}
            </div>
        </Form>
    );
};

export default PostForm;