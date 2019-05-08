import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './LandingPage';
import VotePage from './VotePage';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import Footer from './footer';

import { Button, Navbar, Nav, Form, FormControl } from 'react-bootstrap';



class App extends React.Component {

  constructor(props){
    super(props);
  }

 
  render() {
    const navBar = (
      <Navbar bg="dark" variant="dark" expand = "lg">
        <Navbar.Brand href="/">SafePoll</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/admin">Admin</Nav.Link>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
        {this.props.location == '/vote' ?
        <Navbar.Text>
          VoterId: <a href="#login">{this.props.location.state.voterId}</a>
        </Navbar.Text>
        :
        <Navbar.Text>
          Powered by: <a href="#login">Blockchain</a>
        </Navbar.Text>
        }
        
  </Navbar.Collapse>
  </Navbar>
    );
    
      
    return(
      <div className = "App" width = "100%">
        {navBar}
        <Router>
          <Switch>
            <Route exact path = "/" component = {LandingPage} />
            <Route exact path = "/vote" component = {VotePage} />
            <Route exact path = "/admin" component = {AdminLogin} />
            <Route exact path = "/admin/panel" component = {AdminPage} />
          </Switch>
        </Router>
      
      </div>
    )
    
  }
}

export default App;

