// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@1001-digital/erc721-extensions/contracts/RandomlyAssigned.sol";


contract NFT is ERC721, Ownable, RandomlyAssigned{
    using Strings for uint256;
    using SafeMath for uint256;
    
    string public baseURI;
    string public baseExtension = ".json";
    uint256 public price = 0.05 ether;
    uint256 public maxSupply = 20;
    uint256 public maxMintAmount = 5;
    bool public paused = false;
    bool public revealed = false;
    string public notRevealedURI;
    string public constant NFT_PROVENANCE_HASH = "be0a44e332f5b5edf953d128f798716433e24db08165bf00590a8146caf07215";
    mapping(address => bool) public whitelisted;
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    constructor (
    string memory _name,
    string memory _initBaseURI,
    string memory _symbol,
    string memory _initNotRevealedURI
    ) 
     ERC721(_name, _symbol)
     RandomlyAssigned(maxSupply, 0)
    {
        setBaseURI(_initBaseURI);
        setNotRevealedURI(_initNotRevealedURI);
      
    }

     function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        require(index < ERC721.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }



  function setPrice(uint256 _price) public onlyOwner {
    price = _price;
  }

  function setMaxMintAmount(uint256 _maxMintAmount) public onlyOwner {
    maxMintAmount = _maxMintAmount;
  }

  //only owner
  function setReveal(bool _reveal) public onlyOwner {
      revealed = _reveal;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedURI = _notRevealedURI;
  }

   function setBaseExtension(string memory _baseExtension) public onlyOwner {
    baseExtension = _baseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  function whitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
  }

  function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
  }


   // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 tokenCount = tokenCount();
    require(!paused);
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(tokenCount + _mintAmount <= maxSupply);

    if (msg.sender != owner()) {
        if(whitelisted[msg.sender] != true) {
          require(msg.value >= price * _mintAmount);
        }
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
        uint256 tokenId = nextToken();
        _safeMint(_to, tokenId);
    }
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedURI;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  function withdraw() onlyOwner public {
    payable(owner()).transfer(address(this).balance);
  }

  
}