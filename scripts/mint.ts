import { ethers } from "hardhat";
import { Sam } from "../typechain-types";

async function main() {
  try {
    const [owner] = await ethers.getSigners();
    console.log("Minting NFT with account:", owner.address);

    // 배포된 컨트랙트 주소
    const CONTRACT_ADDRESS = "0xf2de65f0BcA3869465591Eb609f3b3F5C079f507";
    
    // 컨트랙트 인스턴스 가져오기
    const Sam = await ethers.getContractFactory("Sam");
    const contract = Sam.attach(CONTRACT_ADDRESS) as Sam;

    // NFT 민팅하기
    const tokenURI = "https://daopass-assets.s3.ap-northeast-2.amazonaws.com/metadata.json";
    
    // 현재 nonce 확인
    const currentNonce = await owner.getNonce();
    console.log("Current nonce:", currentNonce);

    // 새로운 민팅 트랜잭션
    const tx = await contract.mintNFT(owner.address, tokenURI);
    
    console.log("Minting transaction sent:", tx.hash);
    await tx.wait();
    console.log("NFT successfully minted!");

  } catch (error) {
    console.error("Minting failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 