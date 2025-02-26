// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ERC721Swap is Ownable(msg.sender), ReentrancyGuard {
    // 스왑 요청 구조체
    struct SwapRequest {
        address requester; // 요청자
        address requesterTokenContract; // 요청자가 보유한 토큰 컨트랙트 주소
        uint256 requesterTokenId; // 요청자가 보유한 토큰 ID
        address counterparty; // 상대방
        address counterpartyTokenContract; // 상대방의 토큰 컨트랙트 주소
        uint256 counterpartyTokenId; // 상대방의 토큰 ID
    }

    // 스왑 요청 ID -> 요청 정보 매핑
    mapping(uint256 => SwapRequest) public swapRequests;
    uint256 public nextSwapRequestId;

    event SwapRequested(
        uint256 requestId,
        address indexed requester,
        address indexed counterparty,
        address requesterTokenContract,
        uint256 requesterTokenId,
        address counterpartyTokenContract,
        uint256 counterpartyTokenId
    );

    event SwapExecuted(
        uint256 requestId,
        address indexed requester,
        address indexed counterparty
    );

    event SwapCancelled(uint256 requestId, address indexed requester);

    /**
     * @notice 스왑 요청 생성
     */
    function requestSwap(
        address _counterparty,
        address _requesterTokenContract,
        uint256 _requesterTokenId,
        address _counterpartyTokenContract,
        uint256 _counterpartyTokenId
    ) external {
        // 요청자가 토큰 소유자인지 확인
        IERC721 requesterToken = IERC721(_requesterTokenContract);
        require(
            requesterToken.ownerOf(_requesterTokenId) == msg.sender,
            "You do not own the token"
        );

        // 새로운 요청 생성
        swapRequests[nextSwapRequestId] = SwapRequest({
            requester: msg.sender,
            requesterTokenContract: _requesterTokenContract,
            requesterTokenId: _requesterTokenId,
            counterparty: _counterparty,
            counterpartyTokenContract: _counterpartyTokenContract,
            counterpartyTokenId: _counterpartyTokenId
        });

        emit SwapRequested(
            nextSwapRequestId,
            msg.sender,
            _counterparty,
            _requesterTokenContract,
            _requesterTokenId,
            _counterpartyTokenContract,
            _counterpartyTokenId
        );

        nextSwapRequestId++;
    }

    /**
     * @notice 스왑 요청 실행
     */
    function executeSwap(uint256 _requestId) external nonReentrant {
        SwapRequest storage request = swapRequests[_requestId];
        
        // 요청이 존재하는지 확인하는 검증 로직 추가 필요
        require(request.requester != address(0), "Swap request does not exist");

        // 요청이 유효한지 확인
        require(request.counterparty == msg.sender, "Not authorized to execute");

        // 요청자와 상대방이 모두 토큰 소유자인지 확인
        IERC721 requesterToken = IERC721(request.requesterTokenContract);
        IERC721 counterpartyToken = IERC721(request.counterpartyTokenContract);

        require(
            requesterToken.ownerOf(request.requesterTokenId) == request.requester,
            "Requester does not own the token"
        );
        require(
            counterpartyToken.ownerOf(request.counterpartyTokenId) == request.counterparty,
            "Counterparty does not own the token"
        );

        // 승인 여부 확인
        require(
            requesterToken.getApproved(request.requesterTokenId) == address(this),
            "Contract not approved by requester"
        );
        require(
            counterpartyToken.getApproved(request.counterpartyTokenId) == address(this),
            "Contract not approved by counterparty"
        );

        // 토큰 스왑
        requesterToken.safeTransferFrom(
            request.requester,
            request.counterparty,
            request.requesterTokenId
        );
        counterpartyToken.safeTransferFrom(
            request.counterparty,
            request.requester,
            request.counterpartyTokenId
        );

        // 요청 삭제
        delete swapRequests[_requestId];

        emit SwapExecuted(_requestId, request.requester, request.counterparty);
    }

    /**
     * @notice 스왑 요청 취소
     */
    function cancelSwap(uint256 _requestId) external {
        SwapRequest memory request = swapRequests[_requestId];
        
        // 요청이 존재하는지 확인하는 검증 로직 추가 필요
        require(request.requester != address(0), "Swap request does not exist");

        // 요청자가 요청 취소할 권한이 있는지 확인
        require(request.requester == msg.sender, "Not authorized to cancel");

        // 요청 삭제
        delete swapRequests[_requestId];

        emit SwapCancelled(_requestId, msg.sender);
    }
}