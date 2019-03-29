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

        this.count = 0;
    }

    private count: number;

    private clickHandler = () => {
        const { setName } = this.props.mobxStore!;
        this.count++;
        setName("Bob" + this.count);
    }

    public render() {
        const { greeting } = this.props.mobxStore!;

        return <div>
            <div>
                <Link to="/">home </Link>
                <Link to="/about">about </Link>
                <Link to="/about?id=1">about id=1</Link>
                <Link to="/about?id=2">about id=2</Link>
            </div>
            <div>Welcome222 {greeting}</div>
            <button onClick={this.clickHandler}>Change Greeting</button>
        </div>
    }
}
