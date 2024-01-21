/** @format */

import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';

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
export default function Create() {
  const [inputs, setInputs] = useState(['']);

  // Function to handle adding a new input field
  const addInput = () => {
    setInputs([...inputs, '']);
  };

  // Function to handle input changes
  const handleInputChangee = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
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

  const deployContract = async (event) => {
    event.preventDefault();
    console.log(nameData.daoName, inputs, selectedOption, selectedCurrency);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      '0xf1EC58139bb64a039E8AdE7FBAE4f7070CFdb8FB',
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNameData((prevNameData) => ({
      ...prevNameData,
      [name]: value,
    }));
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
          Set your preferences
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
              <div className="sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Primary Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="daoName"
                    id="first-name"
                    value={nameData.daoName}
                    autoComplete="given-name"
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="p-4">
                {inputs.map((input, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Enter Secondary Address"
                      value={input}
                      onChange={(e) =>
                        handleInputChangee(index, e.target.value)
                      }
                      className="w-64 p-2 border rounded-md mr-2"
                    />
                    <button
                      onClick={() => removeInput(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md">
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addInput}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md">
                  Add Input
                </button>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Choose your preferred chain to get your assets on
                </label>
                <div className="mt-2">
                  <select
                    value={selectedOption}
                    onChange={handleOptionChange}
                    autoComplete="country-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                    <option value="sepolia">Ethereum Sepolia</option>
                    <option value="mumbai">Polygon Mumbai</option>
                    <option value="Base Goerli">Base Goerli</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Choose your preferred currency token
                </label>
                <div className="mt-2">
                  <select
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    autoComplete="country-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                    <option value="usdt">USDT</option>
                    <option value="usdc">USDC</option>
                    <option value="eth">ETH/WETH</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Save your prefernces on chain
              </button>
            </div>
          </div>
        </form>
      </div>
  
  );
}
