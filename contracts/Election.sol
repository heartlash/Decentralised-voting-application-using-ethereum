pragma solidity >=0.4.21 <0.6.0;

contract Election {
    
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(string => bool) voters;
    mapping(uint => Candidate) public candidates;
    string[] public allVoters;
    
    uint public candidatesCount;
    string public message;

    event votedEvent(
        string indexed voter
    );

    constructor() public {
        addCandidate("Ruhal");
        addCandidate("Mido");
        
    }

    function initializeVoters(string memory _voter) public {
        allVoters = ["NG067848", "AB067848", "AM067848", "NP067848", "CC067848", "DD067848"];
        allVoters.push(_voter);
        voters[_voter] = false;

    }

    function voterStatus(string memory _voterId) public view returns(uint){
      
        for(uint x = 0; x < allVoters.length; x++){
            if(keccak256(abi.encodePacked(allVoters[x])) == keccak256(abi.encodePacked(_voterId))){
                if(voters[_voterId] == true){
                    return 0;
                }
                else{
                    return 1;
                }

            }
        }

        return 2;

    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount]= Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId, string memory _voterId) public returns(string memory messageVar, uint, string memory voterIdVar) {
        require(!voters[_voterId]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[_voterId] = true;
        candidates[_candidateId].voteCount++;
        emit votedEvent(_voterId);
        message = "Voted Successfully";
        return (message, _candidateId, _voterId);
    }
}