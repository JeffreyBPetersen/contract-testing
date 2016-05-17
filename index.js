var fs = require('fs');
var TestRPC = require('ethereumjs-testrpc');
var Web3 = require('web3');
var web3;

// for convenient logging of asynchronous call results
function alog(error, value){
  console.log('error: ', error);
  console.log('value: ', value);
}

function setupDefaultAccount(){
  web3.eth.getAccounts((e, v) => web3.eth.defaultAccount = v[0]);
}

function main(){
  web3 = new Web3();
  web3.setProvider(TestRPC.provider());
  p = new Promise((resolve, reject) =>
    // read the test contract
    fs.readFile('test.sol', 'utf8', (error, value) => error ? reject(error) : resolve(value))
  ).then( // compile it
    solidityCode => new Promise((resolve, reject) =>
      web3.eth.compile.solidity(solidityCode, (error, value) => error ? reject(error) : resolve(value))
    )
  ).then( // prepare for contract deployment
    compilerResults => new Promise((resolve, reject) =>
      web3.eth.getAccounts((error, addresses) => error ? reject(error) : resolve({
        abi: compilerResults.Test.info.abiDefinition,
        deploymentOptions: {
          data: compilerResults.Test.code,
          from: addresses[0],
          gas: 250000 // in excess
        }
      }))
    )
  ).then( // deploy contract
    prepared => new Promise((resolve, reject) =>
      web3.eth.contract(prepared.abi).new(prepared.deploymentOptions, (error, contractInstance) =>
        error ? reject(error) : resolve(contractInstance)
      )
    )
  ).then(
    contractInstance => test = contractInstance
  );
  setupDefaultAccount();
}

main();
