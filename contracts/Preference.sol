// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract Preference {
    address primary;
    struct User {
        address primaryAddress;
        address[] secondaryAddresses;
        string chainPreference;
        string tokenPreference;
    }
    mapping(address => User) public users;
    event UserRegistered(address indexed userAddress);

    function registerUser(
        address _primaryAddress,
        address[] memory _secondaryAddresses,
        string memory _chainPreference,
        string memory _tokenPreference
    ) public {
        users[msg.sender] = User({
            primaryAddress: _primaryAddress,
            secondaryAddresses: _secondaryAddresses,
            chainPreference: _chainPreference,
            tokenPreference: _tokenPreference
        });

        emit UserRegistered(msg.sender);
    }

    function getUserPreferences(
        address _userAddress
    )
        public
        view
        returns (
            address primaryAddress,
            address[] memory secondaryAddresses,
            string memory chainPreference,
            string memory tokenPreference
        )
    {
        User storage user = users[_userAddress];

        return (
            user.primaryAddress,
            user.secondaryAddresses,
            user.chainPreference,
            user.tokenPreference
        );
    }

    function getPrimaryAddress(
        address secondary
    ) public view returns (address) {
        User storage user = users[msg.sender];
        if (user.primaryAddress == secondary) {
            return secondary; // The provided secondary address is the primary address
        }

        for (uint256 i = 0; i < user.secondaryAddresses.length; i++) {
            if (user.secondaryAddresses[i] == secondary) {
                return user.primaryAddress; // Return the primary address
            }
        }
        revert("Secondary address not found");
    }
}
