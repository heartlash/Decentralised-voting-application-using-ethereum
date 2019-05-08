import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import {BrowserRouter as Router, Route, withRouter} from 'react-router-dom';
import TruffleContract from 'truffle-contract';
import Election from '../../build/contracts/Election.json';
import Modal from 'react-modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { Parallax, Background } from 'react-parallax';

const deployConfig = require('../../deployConfig.json');

const buildFile = require('../../build/contracts/Election.json');

let provider;
let contract;
let event;
let fromHere;

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

class VotePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        privateKey: this.props.location.state.account.privateKey,
    
        candidates: [],
        voting: false,
        voted: false,
        
      
      }; 
    
    
      this.redirectFraud = this.redirectFraud.bind(this);
    this.casteVote = this.casteVote.bind(this);
    this.runCounter = this.runCounter.bind(this);
    
  }

  componentDidMount(props){

  
   
    console.log("See the data here: ", this.props.location);
    let contractAddress = deployConfig['contractAddress']
   
    provider = new ethers.providers.JsonRpcProvider("http://192.168.43.218:7545");
    contract = new ethers.Contract(contractAddress, buildFile['abi'], provider);
 
    let filterEvents = contract.filters.votedEvent(this.props.location.state.voterId);
    contract.on(filterEvents, (fromAddress, toAddress, value, event) => {
      console.log("inside the contract on thing: ", fromAddress, ":", this.props.location.state.account.publicAddress );
      
      this.setState({
        voting: false,
        candidates: [],
        voted: true,
      });
      contract.candidatesCount().then((cand) => {
        for(var i=1; i<=cand.toNumber(); i++){
        contract.candidates(i).then((candidate) => {
          const candidates = [...this.state.candidates]
          candidates.push({
              id: candidate[0],
              name: candidate[1],
              voteCount: candidate[2]
          });
          this.setState({candidates: candidates}, function(){
            console.log("state in the vote page after event: ", this.state);
          })
        });
        }
        
      });
  });
  
   contract.candidatesCount().then((cand) => {
     for(var i=1; i<=cand.toNumber(); i++){
      contract.candidates(i).then((candidate) => {
        const candidates = [...this.state.candidates]
        candidates.push({
            id: candidate[0],
            name: candidate[1],
            voteCount: candidate[2]
        });
        this.setState({candidates: candidates}, function(){
          console.log("state in the vote page: ", this.state);
        })
      });
     }
     
   });

  }


  casteVote(){
    this.setState({
      voting: true
    });
    console.log("this method is being called and see the voting state here: ", this.state.voting);
    var candidateId = document.getElementById('choosenCandidate').value;
    var voterId = this.props.location.state.voterId;
    console.log("see the candidateId and the voterId here: ", candidateId, voterId);
    let wallet = new ethers.Wallet(this.state.privateKey, provider);
    let contractWithSigner = contract.connect(wallet);
    console.log("see the state just before calling the contract to vote: ", this.state.voting);

    contractWithSigner.vote(candidateId, voterId)
    .then((tx) => {
      console.log("see the transaction: ", tx);
      fromHere = true;
      console.log("see the states after transaction: ", this.state);
      axios.get('http://192.168.43.218:4000/release', { params : {account: this.props.location.state.account.publicAddress}})
      .then((res) => {
        console.log("res: ", res);
        setTimeout(() => {
          this.props.history.push('/');
        }, 10000).bind(this);
      })

     });
  }

  showCandidateData(){
  
    let table = [];
    let candidateInfo = [];
    for(var c in this.state.candidates){
      candidateInfo.push(<td>{this.state.candidates[c].id.toNumber()}</td>)
      candidateInfo.push(<td>{this.state.candidates[c].name}</td>)
        //candidateInfo.push(<td style={this.state.voted ? {} : { display: 'none' }}>{this.state.candidates[c].voteCount.toNumber()}</td>)
        table.push(<tr>{candidateInfo}</tr>);
        candidateInfo = []
      }

      return table;
      
  }

  chooseCandidate(){
    let select = []
    let candidate = [];
    for(var c in this.state.candidates){
      select.push(<option value = {this.state.candidates[c].id}>{this.state.candidates[c].name}</option>);
    }

    return select;
   
  }

  runCounter(){
    console.log("Enters here anyway: ", this.state);
    if(this.state.voted){
      let seconds = 5;
      var self = this;
      var x = setInterval(function(){
        document.getElementById('counter').innerHTML = "";
        document.getElementById('counter').innerHTML = seconds;
        seconds = seconds -1;
        if(!fromHere){
          console.log("so it came inside the real thing");
          document.getElementById("afterCast").innerHTML = "Concurrent voting detected";
          document.getElementById('counter').innerHTML = "";
          clearInterval(x);
          self.redirectFraud();
        }
        else if(seconds< 0){
          //document.getElementById("afterCast").innerHTML = "Malpractice suspected";
          clearInterval(x);
          /*setTimeout(() => {
            this.props.history.push('/');
          }, 10000).bind(this);*/
        }
      }, 1000);

     
    }
  }
 
  redirectFraud(){
    /*
    console.log("redirect fraud called: ");
      setTimeout(() => {
        this.props.history.push('/');
      }, 3000).bind(this);
      */
     axios.get('http://192.168.43.218:4000/release', { params : {account: this.props.location.state.account.publicAddress}})
      .then((res) => {
        console.log("res: ", res);
        setTimeout(() => {
          this.props.history.push('/');
        }, 4000).bind(this);
      })
    }
  
  render() {

    const parallaxStuff = (
      <div style = {styles}>
      <h1 style = {{marginTop: '1em', marginBottom: '1em'}}></h1>
     <Parallax
            blur={5}
            bgImage={require('./4.png')}
            bgImageAlt="the cat"
            strength={500}
        >
            <div style={{ height: 300 }} >
              <div style={insideStyles}>
          
              <div class = "container">
          
        


                <table class = "table table-hover">
                <thead class = "thead-light">
                  <th scope = "col">Candidate Id</th>
                  <th scope = "col">Candidate Name</th>
                  {/*<th scope = "col" style={this.state.voted ? {} : { display: 'none' }}>Candidate Vote Count</th>*/}
                </thead>
                <tbody>
                  {this.showCandidateData()}
                </tbody>
                </table>
                {this.state.voting ? <div><h2>Just a few moments..</h2></div>
                :
                <div style={this.state.voted ? {display: 'none'} : {}}> 
                <select id = "choosenCandidate">
              
                  {this.chooseCandidate()}
                </select>
                <button onClick = {this.casteVote} class="btn btn-dark">Vote</button>
                </div>
                }
                {
        this.state.voted ? <div><h2 id ="afterCast">You have successfully voted, logging you out in: </h2><h2 id ="counter"></h2></div> : null
      }
              </div>
            </div>
                    </div>
          </Parallax>
          <h1>| | |</h1>
        <Parallax
              blur={{ min: -1, max: 3 }}
              bgImage={require('./5.jpg')}
              bgImageAlt="the dog"
              
          >
              
              <div style={{ height: 300 }} >
              <div style={insideStyles}><p>VoterId: {this.props.location.state.voterId}</p>
        <p>Mapped to public address: {this.props.location.state.account.publicAddress}</p></div>
              </div>
        </Parallax>
        <h1>| | |</h1>

     
      
        </div>
    )

    return(
      <div>
        
        <div>{this.runCounter()}</div>
       
       {parallaxStuff}
      </div>
    )
    
  }
}

export default withRouter(VotePage);