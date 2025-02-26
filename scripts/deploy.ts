import { ethers } from "hardhat";

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const sam = await ethers.getContractFactory("Sam");
    console.log("Deploying Sam NFT...");
    
    const samContract = await sam.deploy();
    
    // 컨트랙트 배포 트랜잭션이 마이닝될 때까지 대기
    await samContract.waitForDeployment();
    const address = await samContract.getAddress();
    

  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 