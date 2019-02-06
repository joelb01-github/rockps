const Web3 = require('web3');
const web3 = new Web3(window.web3.currentProvider);

const signMsg = async (msg) => {
  var msg = web3.sha3(msg);
  var signature = web3.eth.sign(web3.eth.accounts[0], msg);
  var r = signature.slice(0, 66)
  var s = '0x' + signature.slice(66, 130)
  var v = '0x' + signature.slice(130, 132)
  v = web3.toDecimal(v)
  msg = '0x' + msg

  console.log(r, s, v, msg);
}

signMsg('hello');