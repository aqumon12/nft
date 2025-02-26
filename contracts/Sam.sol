// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sam is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;

    // ERC721 생성자에 이름과 심볼 전달
    constructor() ERC721("Sam", "SAM") Ownable(msg.sender) {
        tokenIdCounter = 0; // 초기화
    }

    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        require(to != address(0), "Invalid address");
        require(bytes(tokenURI).length > 0, "Empty tokenURI");
        
        uint256 tokenId = tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenIdCounter++;
    }
}