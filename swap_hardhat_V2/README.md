# Swap hardhat project by Cassagnettes Pierre (Pierre386101071 on github)

This project demonstrates a basic Hardhat use case. It comes with a swap contract, a test for that contract, and a Hardhat Ignition module that deploys that contract. There is also an interface with html so the user can try this contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

or run index_V2.html with live server for example 
you can also run owner.html with live server but you won't be able to use all functions as far as you are not the owner.

I deployed 2 tokens to test this swap :

token 1 : 0x5793148dbF3c90c3780580171046Beb667E19A88
token 2 : 0x0D7b4315EC06948cac0b57b32cC40cEfFF0fc61E

you can mint some on the page to test swap (swap rate : T1 = 2 * T2)
