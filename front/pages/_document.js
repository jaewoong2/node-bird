import React, { Component } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
    static async getInitialProps(context) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = context.renderPage;

        try {
            context.renderPage = () => originalRenderPage({
                enhanceApp : (App) => (props) => sheet.collectStyles(<App {...props}/>)
            })
            const initialProps = await Document.getInitialProps(context || {});
            return {
                ...initialProps,
                styles : (
                    <>
                    {initialProps.styles}
                    {sheet.getStyleElement()}
                    </>
                )
            }
        } catch (err) {
            console.error(err)
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
      <Html>
          <Head />
          <body>
              <Main/>
              <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
              <NextScript/>
          </body>
      </Html>
        )
    }
}
