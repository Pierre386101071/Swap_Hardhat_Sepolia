let provider;
let signer;
let contract;

const contractAddress = "0x33a2206f6E37FDeE9b2E386CB6A8694F9AC64778";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_addressToken",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "LiquidityAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_addressTokenFrom",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_addressTokenTo",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "Swapped",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_addressToken",
				"type": "address"
			}
		],
		"name": "TokenAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressToken",
				"type": "address"
			}
		],
		"name": "getLiquidity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressFrom",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_addressTo",
				"type": "address"
			}
		],
		"name": "getSwapRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressFrom",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_addressTo",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "swap",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
];
function showMessage(message) {
  alert(message);
}

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Connected: " + address;
    contract = new ethers.Contract(contractAddress, abi, signer);
	showMessage("wallet connected successfully!");
  } else {
    alert("Install Metamask");
  }
}

async function approve() {
  const tokenFrom = document.getElementById("tokenFrom").value;
  const amount = document.getElementById("amount").value;

  const erc20 = new ethers.Contract(
    tokenFrom,
    ["function approve(address spender, uint amount) public returns(bool)"],
    signer
	
  );

  const tx = await erc20.approve(contractAddress, ethers.parseUnits(amount, 18));
  await tx.wait();
  showMessage("Token approved successfully!");
  document.getElementById("status").innerText = "Approved successfully!";
}


async function swap() {
  const tokenFrom = document.getElementById("tokenFrom").value;
  const tokenTo = document.getElementById("tokenTo").value;
  const amount = document.getElementById("amount").value;

  const tx = await contract.swap(
    tokenFrom,
    tokenTo,
    ethers.parseUnits(amount, 18)
	
  );
  await tx.wait();
  showMessage("Token swapped successfully!");
  document.getElementById("status").innerText = "Swap successful!";
}
