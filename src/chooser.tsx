import * as React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { ipcRenderer } from 'electron';

export class Chooser extends React.Component<undefined, undefined> {

    static LeftColumnStyle: React.CSSProperties = {
        'WebkitAppRegion': 'drag', // this allows the region to be draggable
        'height': '100vh'
    };

    static TitleStyle: React.CSSProperties = {
        'fontSize': '30px',
        'textAlign': 'center'
    };

    static RecentTitleStyle: React.CSSProperties = {
        'fontSize': '20px',
        'fontWeight': 300,
        'textAlign': 'center',
    };

    static VersionStyle: React.CSSProperties = {
        'fontSize': '14px',
        'fontWeight': 'lighter',
        'textAlign': 'center',
        'display': 'block'
    };

    static LogoStyle: React.CSSProperties = {
        'height': '100px',
        'width': '100px',
        'margin': 'auto',
        'display': 'block',
        'paddingTop': '15px'
    };

    static RightColumnStyle: React.CSSProperties = {
        'background': '#f5f4f5'
    };

    createRealmFileButtonDidClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        ipcRenderer.send('create-realm-file');
    }

    openRealmFileButtonDidClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        ipcRenderer.send('open-realm-files');
    }

    connectToRealmFileButtonDidClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        ipcRenderer.send('connect-to-realm-server');
    }

    render() {
        return (
            <div className="container-fluid no-gutters">
                <div className="row">
                    <div className="col-sm-7 px-0" style={Chooser.LeftColumnStyle}>
                        <div className="row justify-content-center">
                            <div className="col-sm-9">
                                <h3 className="display-4" style={Chooser.TitleStyle} >Realm Studio</h3>
                                <small style={Chooser.VersionStyle}>Version 1.0.0-alpha.1</small>
                                <img src="./img/logo.svg" style={Chooser.LogoStyle} />
                                <br/>
                                <button onClick={this.createRealmFileButtonDidClick}  className="btn btn-primary btn-block">Create a Realm File</button>
                                <button onClick={this.openRealmFileButtonDidClick}  className="btn btn-primary btn-block">Open a Realm File</button>
                                <button onClick={this.connectToRealmFileButtonDidClick} className="btn btn-primary btn-block">Connect to a Realm Server</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5 px-0" style={Chooser.RightColumnStyle}>
                        <span style={Chooser.RecentTitleStyle}>Recent Realms</span>
                        <ListGroup>
                            <ListGroupItem>
                                <i className="fa fa-database" />
                                ~/data/myrealm.realm
                            </ListGroupItem>
                            <ListGroupItem>realms://mapapp.com/globalusers</ListGroupItem>
                            <ListGroupItem>realms://localhost:9080/root</ListGroupItem>
                            <ListGroupItem>realms://localhost:9080/root</ListGroupItem>
                            <ListGroupItem>~/data/samplerealm.realm</ListGroupItem>
                            <ListGroupItem>~/data/androidralm2.realm</ListGroupItem>
                            <ListGroupItem>~/data/iosrealm.realm</ListGroupItem>
                            <ListGroupItem>~/data/kea33.realm</ListGroupItem>
                            <ListGroupItem>~/data/kea33.realm</ListGroupItem>
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}
