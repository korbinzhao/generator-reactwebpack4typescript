import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { CustomMobxStore } from '../../../../stores/mobx-store';

interface Props {
    mobxStore?: CustomMobxStore;
}
@inject('mobxStore')
@observer
export default class Welcome extends React.Component<Props>{
    public constructor(props: Props) {
        super(props);
    }

    public componentDidMount(){
        console.log('did mount', window.location.hash);
    }

    public render() {
        return <div>
            <Link to="/">home </Link>
            <Link to="/about">about </Link>
             <Link to="/about?id=1">about id=1</Link>
                <Link to="/about?id=2">about id=2</Link>
        </div>
    }
}
