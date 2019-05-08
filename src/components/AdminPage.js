import React from 'react';
import ReactDOM from 'react-dom';

import { Parallax, Background } from 'react-parallax';

import {BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();


const buildFile = require('../../build/contracts/Election.json');

const deployConfig = require('../../deployConfig.json');
let contract;
let provider;
let contractWithSigner;


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


class AdminPage extends React.Component {

  constructor(props){
    super(props);
    this.loadVoters = this.loadVoters.bind(this);
    this.sendVoters = this.sendVoters.bind(this);
    this.sendHelper = this.sendHelper.bind(this);
    this.showResults = this.showResults.bind(this);
    this.showCandidateData = this.showCandidateData.bind(this);
   
    this.state = {
      contents: [],
      privateKey: "1bf0a419914ef821de9cc51c9fe325d3acedf025d676ccecbf0a5f84c200d66a",
      candidates: [],
      showRes: false,
    }
    
  }
  componentDidMount(props){


    let contractAddress = deployConfig['contractAddress']
   
    provider = new ethers.providers.JsonRpcProvider("http://192.168.43.218:7545");
    contract = new ethers.Contract(contractAddress, buildFile['abi'], provider);

  }

  showResults(){
    this.setState({
      showRes: true
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
  }

  showCandidateData(){
  
    let table = [];
    let candidateInfo = [];
    for(var c in this.state.candidates){
      candidateInfo.push(<td>{this.state.candidates[c].id.toNumber()}</td>)
      candidateInfo.push(<td>{this.state.candidates[c].name}</td>)
        candidateInfo.push(<td>{this.state.candidates[c].voteCount.toNumber()}</td>)
        table.push(<tr>{candidateInfo}</tr>);
        candidateInfo = []
      }

      return table;
      
  }

  sendVoters(contents){
    console.log("send voters called");
    var arrayContents = contents.split('\n');
    let wallet = new ethers.Wallet(this.state.privateKey, provider);
    contractWithSigner = contract.connect(wallet);
    for(var i=0; i < arrayContents.length; i++){
      this.sendHelper(arrayContents[i]);
    }
  }

  sendHelper(item){
    contractWithSigner.initializeVoters(item)
    .then((tx) => {
      console.log("see the transaction: ", tx);
    })
  }
  loadVoters(){
    
    console.log("this function is called");
    var file = document.getElementById('upload').files[0];
    let contents;
    var fileReader = new FileReader();
    fileReader.onload = (function(e){
      contents = e.target.result;
      console.log(contents);
      this.sendVoters(contents);
      document.getElementById('allVoters').innerHTML = contents;
      
     this.setState({
        contents: contents
      });

   
    }).bind(this);
    
    fileReader.readAsText(file, "UTF-8");
    
    console.log("see the value of contents: ", this.state.contents);
    
    
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
              <input id="upload" type="file"   accept="text" onChange = {this.loadVoters}/>
           
            <button onClick = {this.loadVoters} class="btn btn-success">Done</button>
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
              <div style={insideStyles}>
              <div className = "container">
              <table class = "table table-hover">
                <thead class = "thead-light">
                  <th scope = "col">Candidate Id</th>
                  <th scope = "col">Candidate Name</th>
                  <th scope = "col">Candidate Vote Count</th>
                </thead>
                <tbody>
                  {this.showCandidateData()}
                </tbody>
                </table>
                <button style={this.state.showRes ? {display: 'none' } : {insideStyles}} class = "btn btn-warning" onClick = {this.showResults}>Show Results</button>
              </div>
              </div>
              
            
    </div>
              {/*<div style={{ height: 300 }} >
              <div style={this.state.showRes ? {display: 'none' } : {insideStyles}}><button onClick = {this.showResults}>Show Results</button></div>
              
              <div style={this.state.showRes ? {insideStyles} : {display: 'none' }}>
              <table class = "table table-hover">
                <thead class = "thead-light">
                  <th scope = "col">Candidate Id</th>
                  <th scope = "col">Candidate Name</th>
                  <th scope = "col">Candidate Vote Count</th>
                </thead>
                <tbody>
                  {this.showCandidateData()}
                </tbody>
                </table>
              </div>
    </div>*/}
        </Parallax>
        <h1>| | |</h1>

     
      
        </div>
    )

    return(
      <div className = "App">
        {parallaxStuff}
      
           
            
       
      </div>
    )
    
  }
}

export default withRouter(AdminPage);

