# NFT 컨트랙트 연습 — 발급 · 스왑

실무(NFT 멤버십 서비스)에서 웹 쪽 NFT 전송을 다루면서, 컨트랙트 레이어를
직접 이해하기 위해 만든 연습 프로젝트입니다.

- **MyNFT.sol** — ERC-721 발급 (OpenZeppelin)
- **ERC721Swap.sol** — 두 소유자 간 NFT 스왑 컨트랙트 (Ownable, ReentrancyGuard)
- Hardhat + Ignition으로 컴파일·배포

## 스택

Solidity 0.8 · Hardhat · OpenZeppelin · ethers v6 · Next.js

## 실행

```bash
npm install
# .env에 PRIVATE_KEY 설정 (테스트넷 전용 키만 사용)
npx hardhat compile
npx hardhat test
```
