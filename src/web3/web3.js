// configuration of web3
import Web3 from 'web3';

// hijacking the provider from metamask instance of web3
// this provider has been configured to access the Rinkeby network but also has access to my accounts
const web3 = new Web3(window.web3.currentProvider);

export default web3;