/** @format */

import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
const preferenceAddress = '0xf1EC58139bb64a039E8AdE7FBAE4f7070CFdb8FB';
const preferenceAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_primaryAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_secondaryAddresses',
        type: 'address[]',
      },
      {
        internalType: 'string',
        name: '_chainPreference',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_tokenPreference',
        type: 'string',
      },
    ],
    name: 'registerUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
    ],
    name: 'UserRegistered',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'secondary',
        type: 'address',
      },
    ],
    name: 'getPrimaryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getUserPreferences',
    outputs: [
      {
        internalType: 'address',
        name: 'primaryAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'secondaryAddresses',
        type: 'address[]',
      },
      {
        internalType: 'string',
        name: 'chainPreference',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tokenPreference',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'users',
    outputs: [
      {
        internalType: 'address',
        name: 'primaryAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'chainPreference',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tokenPreference',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const chronicle = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'chronicle',
    outputs: [
      {
        internalType: 'contract IChronicle',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'read',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const chronicleAddress = '0x50D146d26A40721FcE72bcF0AE95d56f5D4Aa7c0';
const web3Modal = new Web3Modal();
const connection = await web3Modal.connect();
const provider = new ethers.providers.Web3Provider(connection);
const signer = provider.getSigner();
const contract = new ethers.Contract(chronicleAddress, chronicle, signer);
export default function SendAssets() {
  const [oracle, setOracle] = useState(false);
  const [enteredAddress, setEnteredAddress] = useState('');
  const [receiverChain, setReceiverChain] = useState('');
  const [preference, setPreference] = useState([]);
  const [correctAddress, setCorrectAddress] = useState('');
  const [inputs, setInputs] = useState(['']);
  const [amount, setAmount] = useState(['']);
  const [liveamount, setLiveamount] = useState(0);

  // Function to handle adding x`a new input field
  const addInput = () => {
    setInputs([...inputs, '']);
  };
  const handleInputChange = async (e) => {
    setEnteredAddress(e.target.value);
  };
  async function handlePriceChange() {
    setOracle(true);
    const txn = await contract.read();
    console.log(Number(txn[0]._hex));
    const livePricee = Number(txn[0]._hex) / 10000000000;
    const livePrice = livePricee / 100000000;
    const equiAmount = amount / livePrice;
    setLiveamount(equiAmount);
  }
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
    console.log(txn);

    if (txn != enteredAddress)
      window.alert(`User's Preferred Address is ${txn}`);
    setCorrectAddress(txn);
  }
  // Function to handle input changes
  const handleInputChangee = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };
  const handleInputChangeee = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setAmount(updatedInputs);
    console.log(amount);
  };

  // Function to handle removing an input field
  const removeInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };
  const [nameData, setNameData] = useState({
    daoName: '',
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };
  async function sendAssets(event) {
    window.alert('Sending 0.265 eth to users preferred address on base goerli');
    event.preventDefault();

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      '0x9684E0642EDad90Fc5ghhj56f564f2FC99F43',
      preferenceAbi,
      signer
    );
    // const txn = await contract.sendAssetsCrosasChain(
    //   '0x50D146d26A40721FcE72bcF0AE95d56f5D4Aa7c0',
    //   preferredChain,
    //   toAddress,amount
    // );
  }
  const deployContract = async (event) => {
    event.preventDefault();
    console.log(nameData.daoName, inputs, selectedOption, selectedCurrency);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      '0x9684E0642EDad90Fc542c56ff2FC99FE435F1238',
      preferenceAbi,
      signer
    );
    const txn = await contract.registerUser(
      nameData.daoName,
      inputs,
      selectedOption,
      selectedCurrency
    );
    await txn.wait();
    console.log(txn);
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
        onSubmit={deployContract}
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
              {inputs.map((input, index) => (
                <>
                  {' '}
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Enter Receiver address
                  </label>
                  <div
                    key={index}
                    className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Enter Address"
                      value={input}
                      onChange={(e) =>
                        handleInputChangee(index, e.target.value)
                      }
                      className="w-64 p-2 border rounded-md mr-2"
                    />
                    <input
                      type="text"
                      placeholder="$50"
                      onChange={(e) =>
                        handleInputChangeee(index, e.target.value)
                      }
                      className="w-16 p-2 border rounded-md mr-2"
                    />
                    <button
                      onClick={() => removeInput(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md">
                      Remove
                    </button>
                    <button
                      onClick={handlePriceChange}
                      className="px-3 py-2 ml-4 mr-6 bg-green-500 text-white rounded-md">
                      Get Equivalent price in Ethers
                    </button>
                    <h1 className="ml-6">{liveamount} ETH</h1>
                  </div>
                </>
              ))}
              <button
                onClick={addInput}
                className="px-3 py-2 bg-blue-500 text-white rounded-md">
                Add Input
              </button>
            </div>
            <button
              onClick={handlePriceChange}
              className="px-3 py-2 ml-4 mr-6 bg-green-500 text-white rounded-md">
             Send Multiple Transactions in a Single Click for free 
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
