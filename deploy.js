let ethers = require('ethers')
let fs =require('fs');
const buildFile = require('./build/contracts/Election.json');


let provider = new ethers.providers.JsonRpcProvider("http://192.168.43.218:7545");

provider.listAccounts().then(result => console.log(result));

let privateKey = '1bf0a419914ef821de9cc51c9fe325d3acedf025d676ccecbf0a5f84c200d66a';
let signer = provider.getSigner(0);
let wallet = new ethers.Wallet(privateKey, provider);
let factory = new ethers.ContractFactory(buildFile['abi'], buildFile['bytecode'], wallet);
factory.deploy().then((contract) => {
  console.log("see the contract type: ", contract.address);
  var obj = {contractAddress: contract.address, contract: contract};
  var jsonString = JSON.stringify(obj, null, 4);
  fs.writeFileSync("deployConfig.json", jsonString);
 
});