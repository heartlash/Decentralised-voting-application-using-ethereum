import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import {BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import TruffleContract from 'truffle-contract';
import Election from '../../build/contracts/Election.json';
import axios from 'axios';
import { Button, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Parallax, Background } from 'react-parallax';
import Modal from 'react-modal';
import { ethers } from 'ethers';



const buildFile = require('../../build/contracts/Election.json');
const history = createBrowserHistory();
const deployConfig = require('../../deployConfig.json');
let contract;

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

const modalStyle = {
  content: {
    height: '50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
   
  }
};

class LandingPage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      VoterIdModalIsOpen: false,
      VoterStatusMessage: '',
      toVote: false,
      otpSents: false,
      phoneNo: '',
    };

    this.openVoterIdModal = this.openVoterIdModal.bind(this);
    this.closeVoterIdModal = this.closeVoterIdModal.bind(this);
    this.getVoterStatus = this.getVoterStatus.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
    
  }

  componentDidMount(props){


    let contractAddress = deployConfig['contractAddress']
   
    let provider = new ethers.providers.JsonRpcProvider("http://192.168.43.218:7545");
    contract = new ethers.Contract(contractAddress, buildFile['abi'], provider);

    provider.listAccounts().then(result => console.log(result));
   
  
  
  }
  openVoterIdModal(){
    this.setState({
      VoterIdModalIsOpen: true
    });
  }

  closeVoterIdModal(){
    this.setState({
      VoterIdModalIsOpen: false
    });
  }

  verifyOtp(){
    
    console.log(document.getElementById('otpInput').value, ":", this.state.otp);
    if(document.getElementById('otpInput').value == this.state.otp){
      axios.get('http://192.168.43.218:4000/check', { crossDomain: true }).then((res) => {
        console.log(res.data.account);
        
        if(res.data.account == 0){
          
        }
      

        this.props.history.push('/vote', {voterId:document.getElementById("voterId").value, account: res.data.account});
      })
      .catch((err) => {
        console.log("something went wrong: ", err);
      }) 
    }
    else{
      console.log("didn't match..");
      this.setState({
        otperror: 'Incorrect OTP'
      });
    }
  }
  getVoterStatus(){
    console.log("getVoterStatus called");
    
    contract.voterStatus(document.getElementById("voterId").value)
    .then((result) => {
      var result = result.toNumber();
      if(result == 0){
        this.setState({
          VoterStatusMessage: "Already voted!"
        });
      }

      else if(result == 1){
        axios.get('http://192.168.43.218:4000/authOtp', {params: {voterId: document.getElementById("voterId").value}}).then((res) => {
          console.log("phone number received: ", res.data);
          this.setState({
            otp: res.data,
            otpSents: true,
            VoterStatusMessage: '',
          });


        });
        //console.log("Enters: ", this.state);
       
    
      }
      else if(result == 2){
        this.setState({
          VoterStatusMessage: "Not a valid Voter Id!"
        });  
      }
  })
    
    
  }

  render() {

    const parallaxStuff = (
      <div style = {styles}>
      <h1 style = {{marginTop: '1em', marginBottom: '1em'}}>SafePoll Voting Solutions</h1>
     <Parallax
            blur={5}
            bgImage={require('./2.png')}
            bgImageAlt="the cat"
            strength={500}
        >
            <div style={{ height: 300 }} >
            <div style={insideStyles}>
        
        <button type="button" onClick = {this.openVoterIdModal} class="btn btn-danger">Vote Now</button></div>
            </div>
        </Parallax>
        <h1>| | |</h1>
      <Parallax
            blur={{ min: -1, max: 3 }}
            bgImage={require('./1.jpg')}
            bgImageAlt="the dog"
            
        >
            
            <div style={{ height: 300 }} >
            <div style={insideStyles}>Safe</div>
            </div>
      </Parallax>
      <h1>| | |</h1>

      <Parallax
       bgImage={require('./3.png')}
      strength={200}
      renderLayer={percentage => (
        <div>
          <div
            style={{
              position: "absolute",
              background: `rgba(255, 125, 0, ${percentage * 1})`,
              left: "50%",
              top: "50%",
              borderRadius: "50%",
              transform: "translate(-50%,-50%)",
              width: percentage * 500,
              height: percentage * 500
            }}
          />
        </div>
      )}
    >
      <div style={{ height: 500 }}>
        <div style={insideStyles}>And trustless</div>
      </div>
    </Parallax>
      
      </div>
    )

    return(
      <div >

        <Modal
          isOpen={this.state.VoterIdModalIsOpen}
          onRequestClose={this.closeVoterIdModal}
          style = {modalStyle}>
            <br/>
            <center>
            <input style={this.state.otpSents ? { display: 'none' } : {}} id = "voterId" type = "text" class="form-control" placeholder = "Enter voter Id"/>
            <small style={this.state.otpSents ? { display: 'none' } : {}} id="emailHelp" class="form-text text-muted">We'll never share your voterId with anyone else.</small>
            <input style={this.state.otpSents ? {} : { display: 'none' }} id = "otpInput" class = "form-control" placeholder = "OTP" type = "text"/>
            <p>{this.state.otperror}</p>
            <br/>
            <p>{this.state.VoterStatusMessage}</p>
            <br/>
            <button style={this.state.otpSents ? { display: 'none' } : {}} id = "voteModalButton" class="btn btn-success" onClick = {this.getVoterStatus}>Confirm</button>
            <button style={this.state.otpSents ? {} : { display: 'none' }} class="btn btn-success" onClick = {this.verifyOtp}>Send</button>

            </center>
          </Modal>
          
          {parallaxStuff}  
 
         
      </div>
    )
    
  }
}

export default withRouter(LandingPage);
