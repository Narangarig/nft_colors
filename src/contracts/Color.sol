// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

//import "./ERC721.sol";
import "./ERC721Enumerable.sol";

contract Color is ERC721Enumerable {

    string[] public colors;
    mapping(string => bool) _colorExists;

    constructor() ERC721("Color", "COLOR") {

    }

    function mint(string memory _color) public {
        require(!_colorExists[_color]);
        colors.push(_color);
        uint _id = colors.length;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }
}