import * as React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

export class Chooser extends React.Component<undefined, undefined> {

    static LeftColumnStyle =  {
        background: 'red',
         '-webkit-app-region': 'drag'
    };

    render() {
        return (
            <div className="container-fluid no-gutters">
                <div className="row">
                    <div className="col-md-7 px-0" style={ Chooser.LeftColumnStyle }>
                        <h2>Realm Studio</h2>
                    </div>
                    <div className="col-md-5 px-0">
                        <ListGroup>
                            <ListGroupItem>~/data/myrealm.realm</ListGroupItem>
                            <ListGroupItem>realms://mapapp.com/globalusers</ListGroupItem>
                            <ListGroupItem>Morbi leo risus</ListGroupItem>
                            <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
                            <ListGroupItem>Vestibulum at eros</ListGroupItem>
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}
