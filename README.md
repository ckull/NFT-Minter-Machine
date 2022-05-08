# NFT Minter Machine

A simple ERC721 minter machine that implemented with [ERC721_extended](https://github.com/fluorish/ERC721_extended) contract.

Feature:
- Wallet support: Metamask, WalletConnect
- Mint random token id
- Whitelist 
- Provenance Hash 
- Reveal and Not reveal option, something similar to gacha system

# Demo on Rinkeby
![Annotation 2022-05-08 170619](https://user-images.githubusercontent.com/33544356/167291390-0ddf1d19-5a95-45f6-97f1-ceee8c8fa266.png)

## Revealed
- frontend: https://friendly-skull-reveal.netlify.app/
- opensea: https://testnets.opensea.io/collection/friendly-skull-reveal
- contract address: https://rinkeby.etherscan.io/address/0x37024de4385928a511e79be8c74e9f0a00a00a7d

## Not Revealed
- frontend: https://friendly-skull-not-reveal.netlify.app/
- opensea: https://testnets.opensea.io/collection/friendly-skull-not-reveal
- contract address: https://rinkeby.etherscan.io/address/0x401bd94f62128144ae0d1ae0c9b672ac032358ed

# Note 
  In order to guarantee randomness, you need to set reveal URI after all tokens were minted.

# Ref

Provenance Hash: https://medium.com/coinmonks/the-elegance-of-the-nft-provenance-hash-solution-823b39f99473

NFT_REVEAL: https://github.com/HashLips/solidity_smart_contracts/blob/main/contracts/NFT/NFT_REVEAL.sol

Artwork: https://opensea.io/collection/friendly-skull
