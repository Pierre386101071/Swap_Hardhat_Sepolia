const contractAddress = "0xd39eC66632493646c9cFf4911f677A989d94d7fd";
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

const erc20Abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "sender", "type": "address" },
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

const tokenAbi = [
  "function mint(address to, uint256 amount) public",
  "function decimals() public view returns (uint8)"
];

let signer;
let contract;
const loader = document.getElementById('loader');

function showLoader() {
  loader.style.display = 'flex';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showSuccess(message) {
  const toast = document.getElementById("successToast");
  toast.innerText = "✔️ " + message;
  toast.classList.remove("show");  
  void toast.offsetWidth;          
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


async function handleAction(fn, successMsg) {
  showLoader();
  try {
    await fn();
    showSuccess(successMsg);
  } catch (err) {
    console.error(err);
    alert("❌ Erreur : " + (err.message || err));
  } finally {
    hideLoader();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const connectBtn = document.getElementById('connectBtn');
  const addTokenBtn = document.getElementById('addTokenBtn');
  const addLiquidityBtn = document.getElementById('addLiquidityBtn');
  const getLiquidityBtn = document.getElementById('getLiquidityBtn');
  const getRateBtn = document.getElementById('getRateBtn');
  const addTokenContractBtn = document.getElementById('addTokenContractBtn');
  const swapBtn = document.getElementById('swapBtn');
  const mintBtn = document.getElementById('mintBtn');

  if (connectBtn) connectBtn.addEventListener('click', () => handleAction(connect, "Wallet connecté"));
  if (addTokenBtn) addTokenBtn.addEventListener('click', () => handleAction(addToken, "Token ajouté à MetaMask"));
  if (addLiquidityBtn) addLiquidityBtn.addEventListener('click', () => handleAction(addLiquidity, "Liquidité ajoutée"));
  if (getLiquidityBtn) getLiquidityBtn.addEventListener('click', () => handleAction(getLiquidity));
  if (getRateBtn) getRateBtn.addEventListener('click', () => handleAction(getRate));
  if (addTokenContractBtn) addTokenContractBtn.addEventListener('click', () => handleAction(addTokenContract, "Token ajouté au contrat"));
  if (swapBtn) swapBtn.addEventListener('click', () => handleAction(swap, "Swap effectué"));
  if (mintBtn) mintBtn.addEventListener('click', () => handleAction(mintToken, "Token minté avec succès"));
});



async function connect() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Connected: " + address;
	console.log("Wallet connected, contract ready:", contract);
  } catch (error) {
    console.error(error);
  }
}


async function mintToken() {
  try {
    if (!window.ethereum) {
      alert("MetaMask non détecté !");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tokenAddress = document.getElementById("tokenAddress").value.trim();
    const to = document.getElementById("mintTo").value.trim();
    const amountRaw = document.getElementById("mintAmount").value.trim();

    if (!ethers.utils.isAddress(tokenAddress) || !ethers.utils.isAddress(to) || !amountRaw) {
      alert("Champs invalides.");
      return;
    }

    const token = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const decimals = await token.decimals();
    const amount = ethers.utils.parseUnits(amountRaw, decimals);

    const tx = await token.mint(to, amount);
    await tx.wait();

  } catch (err) {
    console.error(err);
    alert("Erreur mint : " + (err.message || err));
  }
}


async function addTokenContract() {
  try {
    console.log("addTokenContract called");

    const tokenAddress = document.getElementById("tokenAddress_add").value.trim();
    const tokenPriceRaw = document.getElementById("tokenPrice").value.trim();
    const tokenName = document.getElementById("tokenName").value.trim();

    if (!contract) {
      alert("Contract not connected");
      return;
    }

    if (!tokenAddress || !tokenPriceRaw || !tokenName) {
      alert("Tous les champs doivent être remplis");
      return;
    }

    if (!ethers.utils.isAddress(tokenAddress)) {
      alert("Adresse du token invalide");
      return;
    }

    let tokenPrice;
    try {
      tokenPrice = ethers.BigNumber.from(tokenPriceRaw);
      console.log("tokenPrice BigNumber:", tokenPrice.toString());
    } catch (conversionError) {
      alert("Prix du token invalide (doit être un entier)");
      console.error("Erreur conversion tokenPrice:", conversionError);
      return;
    }

    console.log("Appel contract.addToken avec:", tokenAddress, tokenPrice.toString(), tokenName);
    const tx = await contract.addToken(tokenAddress, tokenPrice, tokenName);
    console.log("Transaction envoyée :", tx);

    await tx.wait();

  } catch (error) {
    console.error("Erreur dans addTokenContract:", error);
    alert("Erreur : " + (error.message || error));
  }
}





async function addTokenToMetaMask(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {
  if (!window.ethereum) {
    alert("MetaMask n'est pas détecté");
    return;
  }
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage, 
        },
      },
    });
    if (wasAdded) {
    } else {
      alert(`Ajout de ${tokenSymbol} annulé.`);
    }
  } catch (error) {
    alert('Erreur lors de l’ajout du token : ' + error.message);
  }
}

async function addToken() {
  try {
    const tokenAddress = document.getElementById("tokenAddressInput").value.trim();
    const tokenName = document.getElementById("tokenNameInput").value.trim();

    if (!tokenAddress  || !tokenName) {
      showMessage("Merci de remplir tous les champs");
      return;
    }


    await addTokenToMetaMask(
  	tokenAddress, 
  	tokenName,
  	18,
  	"https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
	);

  } catch (error) {
    console.error(error);
    showMessage("Erreur lors de l'ajout du token : " + (error.message || error));
  }
}



async function addLiquidity() {
  if (!window.ethereum) {
  alert("MetaMask n'est pas détecté");
  return;
  }
  try {
	const address = document.getElementById("liqTokenAddress").value;
	console.log("Adresse token reçue :", address);
	const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
	const token = new ethers.Contract(address, erc20Abi, signer);
	const decimals = await token.decimals();
  const amountRaw = document.getElementById("liqAmount").value;
  if (!address || !amountRaw) {
  alert("Adresse du token ou montant manquant");
  return;
  }
	const amount = ethers.utils.parseUnits(amountRaw, decimals); 
	const approvalTx = await token.approve(contractAddress, amount);
  await approvalTx.wait();

	const tx1 = await contract.addLiquidity(address, amount, { gasLimit: 500000 });
	await tx1.wait();
  } catch (error) {
    console.error(error);
    alert("Error adding liquidity");
  }
}


async function getLiquidity() {
  try {
    const address = document.getElementById("getLiqAddress").value;
    const liquidity = await contract.getLiquidity(address);
    document.getElementById("liqResult").innerText = "Liquidity: " + (liquidity/1e18).toString();
  } catch (error) {
    console.error(error);
    showMessage("Error fetching liquidity");
  }
}

async function getRate() {
  try {
    const from = document.getElementById("rateFrom").value;
    const to = document.getElementById("rateTo").value;
    const rate = await contract.getSwapRate(from, to) / 1e18;
    document.getElementById("rateResult").innerText = "Rate: " + rate.toString();
  } catch (error) {
    console.error(error);
    alert("Error fetching rate");
  }
}



async function swap() {
  if (!window.ethereum) {
  alert("MetaMask n'est pas détecté");
  return;
  }
  const tokenFrom = document.getElementById("tokenFrom").value;
  const tokenTo = document.getElementById("tokenTo").value;
  const amountRaw = document.getElementById("amount").value;
  const amount = ethers.utils.parseUnits(amountRaw, 18);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
	const token = new ethers.Contract(tokenFrom, erc20Abi, signer);
  const approvalTx = await token.approve(contractAddress, amount);
  await approvalTx.wait();
  const tx = await contract.swap(
    tokenFrom,
    tokenTo,
    amount
	
  );
  await tx.wait();
  document.getElementById("status").innerText = "Swap successful!";
}


