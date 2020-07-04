import React from 'react';
import 'antd/dist/antd.css'
import Head from 'next/head'
import PropTypes from 'prop-types';
import wrapper from '../store/cofigureStore';
// import withReduxSaga from 'next-redux-saga';



const NodeBird = ( { Component, pageProps } ) => {
    return (
        <div>
        <Head>
            <meta charSet="utf-8"></meta>
            <title>NodeBird</title>
        </Head>
            <Component {...pageProps}/>
        </div>
    );
};

// export default wrapper.withRedux(withReduxSaga(NodeBird));
export default wrapper.withRedux(NodeBird);