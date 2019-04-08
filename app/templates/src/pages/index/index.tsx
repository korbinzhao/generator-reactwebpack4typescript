
import * as React from 'react';
import { Suspense, lazy } from 'react';
import * as ReactDOM from 'react-dom';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Loading from 'components/loading';
import { stores } from '../../stores';
import '@babel/polyfill';

import './index.less';

declare global {
    interface Window {
        tracker: {
            log: Function;
        };
    }
}

const Welcome = lazy(() => import('./mod/welcome'));

ReactDOM.render(
    <Provider {...stores}>
        <HashRouter>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route path="/" component={Welcome} exact />
                </Switch>
            </Suspense>
        </HashRouter>
    </Provider>,
    document.getElementById('root'),
);
