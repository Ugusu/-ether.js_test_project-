import { ethers } from './node_modules/ethers/dist/ethers.esm.js';

const btnLogIn = document.querySelector('#btn_log_in');
const btnSend = document.querySelector('#btn_send');
const responseLogIn = document.querySelector('#response_log_in');
const inputSend = document.querySelector('#input_send');
const responseTransaction = document.querySelector('#response_transaction');

const atknAddress = '0x68C458719688Ab27b63E39613074C8B6925Bf4be';

async function logIn() {
  const provider = new ethers.providers.Web3Provider(window.ethereum); // To get MetaMask object
  await provider.send('eth_requestAccounts', []); // To connect to the account

  const signer = provider.getSigner();

  let atknABI = await fetch('atknABI.json'); // Readiing the abi of ATKN
  atknABI = await atknABI.json();

  const atknContract = new ethers.Contract(atknAddress, atknABI, provider); // Connecting to the ATKN contract

  return { provider, signer, atknContract, atknABI };
}

btnLogIn.addEventListener('click', async function () {
  const { provider, signer, atknContract } = await logIn();
  const address = await signer.getAddress(); // Address of the current user

  const balance = `Address: ${address}
  Balance BNB: ${ethers.utils.formatEther(
    await provider.getBalance(address)
  )} BNB
    Balance ATKN: ${ethers.utils.formatUnits(
      await atknContract.balanceOf(address),
      18
    )} ${await atknContract.symbol()}`;

  responseLogIn.classList.remove('hidden');
  responseLogIn.textContent = balance;
});

btnSend.addEventListener('click', async function () {
  const { signer } = await logIn();
  const senderAddress = await signer.getAddress();

  let addressAndValue = inputSend.value;
  addressAndValue = addressAndValue.split(','); // To separete input prompt ('address, value')

  addressAndValue = addressAndValue.map(function (str) {
    return str.trim();
  });

  // Submitting the transaction
  const transaction = await signer.sendTransaction({
    to: addressAndValue[0],
    value: ethers.utils.parseEther(addressAndValue[1]),
  });

  responseTransaction.classList.remove('hidden');
  responseTransaction.textContent = `Sender Address: ${senderAddress}
  Reciever Address: ${addressAndValue[0]}`;
});
