import App from 'next/app';

import 'bulma/css/bulma.css';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return <Component {...pageProps} />;
    }
}

export default MyApp;
