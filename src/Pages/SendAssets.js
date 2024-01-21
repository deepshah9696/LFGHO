/** @format */

import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import preferenceAbi from '../abi/preference.json';
import routerAbi from '../abi/router.json';
import erc20Abi from '../abi/ERC20.json';
const preferenceAddress = '0x214436D1541201B127e28F39317bDAe4a8Ee9Bfc';
const sourceRouterAddress = '0x0bf3de8c5d3e8a2b34d2beeb17abfcebaf363a59';
const destinationChainSelector = '3478487238524512106';

const tokenAddress = '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60';
export default function SendAssets() {
  const [enteredAddress, setEnteredAddress] = useState('');
  const [receiverChain, setReceiverChain] = useState('');
  const [assetpref , setAssetpref] = useState('')
  const [preference, setPreference] = useState([]);
  const [correctAddress, setCorrectAddress] = useState('');
const [inputValue, setInputValue] = useState('');
  const [amount, setAmount] = useState(['']);

 
  const handleInputChange = async (e) => {
    setEnteredAddress(e.target.value);
  };

  async function checkAddress() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      preferenceAddress,
      preferenceAbi,
      signer
    );
    const txn = await contract.getPrimaryAddress(enteredAddress);
    const pref = await contract.getUserPreferences(txn);
    console.log(pref);
    setPreference(pref);
    setReceiverChain(pref[2]);
    setAssetpref(pref[3]);
    console.log(txn);

    if (txn != enteredAddress)
    setCorrectAddress(txn);
  }
 
  const bridgeAssets = async (event) => {
    event.preventDefault();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const sourceRouter = new ethers.Contract(
      '0x0bf3de8c5d3e8a2b34d2beeb17abfcebaf363a59',
      routerAbi,
      signer
    );
    const tokenAmounts = [
      {
        token: '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
        amount: '1000000000000000000',
      },
    ];
    const functionSelector = ethers.utils
      .id('CCIP EVMExtraArgsV1')
      .slice(0, 10);
    //  "extraArgs" is a structure that can be represented as [ 'uint256']
    // extraArgs are { gasLimit: 0 }
    // we set gasLimit specifically to 0 because we are not sending any data so we are not expecting a receiving contract to handle data

    const extraArgs = ethers.utils.defaultAbiCoder.encode(['uint256'], [0]);

    const encodedExtraArgs = functionSelector + extraArgs.slice(2);
  const handleInputChange = (event) => {
    // Update the state with the new input value
    setInputValue(event.target.value);
  };
    const message = {
      receiver: ethers.utils.defaultAbiCoder.encode(
        ['address'],
        [correctAddress]
      ),
      data: '0x', // no data
      tokenAmounts: tokenAmounts,
      feeToken: ethers.constants.AddressZero, // If fee token address is provided then fees must be paid in fee token.
      extraArgs: encodedExtraArgs,
    };
    const fees = await sourceRouter.getFee('3478487238524512106', message);
    console.log('hey');
    console.log(`Estimated fees (wei): ${fees}`);
    const erc20 = new ethers.Contract(
      '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
      erc20Abi,
      signer
    );
    console.log(erc20);
    let sendTx, approvalTx;
    approvalTx = await erc20.approve(sourceRouterAddress, "1000000000000000000" );
    await approvalTx.wait(); // wait for the transaction to be mined
    console.log(
      `approved router ${sourceRouterAddress} to spend ${amount} of token ${tokenAddress}. Transaction: ${approvalTx.hash}`
    );

    sendTx = await sourceRouter.ccipSend(destinationChainSelector, message, {
      value: fees,
    });
    const receipt = await sendTx.wait();
    console.log(receipt)// fees are send as value since we are paying the fees in native
  };

  return (
    <div>
      <h1
        style={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          fontSize: '30px',
        }}>
        Send Assets
      </h1>
      <form
        onSubmit={bridgeAssets}
        style={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
        }}>
        <div>
          <div
            className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1"
            style={{
              border: '1px solid #000000',
              borderRadius: '10px', // Adjust this value to control the roundness
              padding: '10px',
            }}>
            <div className="p-4">
              <div className="sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Enter Receiver address
                </label>
                <div className="mt-2">
                  <input
                    id="first-name"
                    autoComplete="given-name"
                    onChange={handleInputChange}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    onClick={checkAddress}
                    className="px-3 mt-4 py-2 bg-blue-500 text-white rounded-md">
                    Check if the address is correct
                  </button>
                </div>
              </div>

              <>
                {' '}
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Receiver's preferred address
                </label>
                <div className="flex items-center mb-2">
                  <div className="w-128 p-2 border rounded-md mr-2">
                    {correctAddress}
                  </div>
                  <input
                    type="text"
                    placeholder="1 GHO"
                    onChange={handleInputChange}
                    className="w-16 p-2 border rounded-md mr-2"
                  />
                </div>
              </>
            </div>
            <button
              onClick={bridgeAssets}
              className="px-3 py-2 ml-4 mr-6 bg-green-500 text-white rounded-md">
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
