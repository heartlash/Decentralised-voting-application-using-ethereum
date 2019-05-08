import React from 'react';
import ReactDOM from 'react-dom';

import { Parallax, Background } from 'react-parallax';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
 
};

const insideStyles = {
  background: "white",
  padding: 20,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)"
};


class AdminLogin extends React.Component {

  constructor(props){
    super(props);
    this.checkCred = this.checkCred.bind(this);
    
  }

  checkCred(){
      if(document.getElementById('user').value == 'admin' && document.getElementById('pass').value == 'admin'){
          this.props.history.push('/admin/panel');
      }
  }
 
  render() {

    const parallaxStuff = (
      <div style = {styles}>
      <h1 style = {{marginTop: '1em', marginBottom: '1em'}}></h1>
     <Parallax
            blur={5}
            bgImage={require('./6.jpg')}
            bgImageAlt="the cat"
            strength={500}
        >
            <div style={{ height: 300 }} >
              <div style={insideStyles}>
              <div className = "container">
        <form onSubmit={this.checkCred}>
        <div class="form-group">
            <input type = "text" class="form-control" id = "user" placeholder = "Admin username"/>
        </div>
        <div class="form-group">
            <input type = "password" class="form-control" id = "pass" placeholder = "Admin password"/>
            </div>
            <button type = "submit" class="btn btn-success">LogIn</button>
        </form>
        </div>
              
              
            </div>
                    </div>
          </Parallax>
          <h1>| | |</h1>
        <Parallax
              blur={{ min: -1, max: 3 }}
              bgImage={require('./7.jpg')}
              bgImageAlt="the dog"
              
          >
              
              <div style={{ height: 300 }} >
              <div style={insideStyles}></div>
              </div>
        </Parallax>
        <h1>| | |</h1>

     
      
        </div>
    )


    return(
      <div>
       
       {parallaxStuff}
      </div>
    )
    
  }
}

export default AdminLogin;

