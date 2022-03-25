const { expect } = require("chai");
const { ethers } = require("hardhat");


let currentToken;
let message1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';// '0x079f1BaC0025ad71Ab16253271ceCA92b222C614';
let message2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

let messageHash1 = ethers.utils.solidityKeccak256(['string'], [message1]);
let messageHash2 = ethers.utils.solidityKeccak256(['string'], [message2]);

if (true == true)
    describe("SuitsOnSuits", function () {
        let buyer, owner, hashValue;
        before(async () => {
            const [owner, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20] = await ethers.getSigners();
            console.log("Owner Address: " + owner.address);
            console.log("Owner Address: " + _1.address);
            let ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            console.log("Start Balance: " + ethBalance);

            const MonstersCommunity = await ethers.getContractFactory("SuitsOnSuits");
            currentToken = await MonstersCommunity.deploy(
                '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                'https://techoshiprojects.s3.amazonaws.com/MonstersCommunity/images/',
                'https://techoshiprojects.s3.amazonaws.com/MonstersCommunity/assets/reveal.json');
            await currentToken.deployed();

            await currentToken.toggleCooking();

            ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            console.log("After Deploy Balance" + ethBalance);

            // // Include process module
            // const process = require('process');

            // // Printing process.env property value
            // console.log(process.env);
        });

        it("Update Vault", async function () {
            await currentToken.setVaultAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
        });

        it("Get Signature", async function () {
            const [adminWallet, userWallet] = await ethers.getSigners();
            let message = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

            let messageHash = ethers.utils.solidityKeccak256(['string'], [message]);
            let signature = await adminWallet.signMessage(ethers.utils.arrayify(messageHash2));

            console.log("Address")
            console.log(adminWallet.address)
            console.log("Message Hash")
            console.log(messageHash)
            console.log("Signature")
            console.log(signature)
        });

        it("Mints a token from Dapp", async function () {

            const PurchaseArray = [
                { amount: 1, value: "0.07" },
                { amount: 2, value: "0.14" },
                { amount: 18, value: "7" },
                // { amount: 5, value: "0.35" },
                // { amount: 10, value: "0.7" },
                //{ amount: 100, value: "7" }                
            ];

            const [adminWallet, userWallet] = await ethers.getSigners();
            const timestamp = Date.now();

            let signature1 = await adminWallet.signMessage(ethers.utils.arrayify(messageHash1));
            let signature2 = await adminWallet.signMessage(ethers.utils.arrayify(messageHash2));
            console.log("messageHash2: " + messageHash2)
            console.log("singature2: " + signature2)
            let messageHash3 = ethers.utils.solidityKeccak256(['string'], [message1]);

            //Step 4: Turn on Sales
            const PreMintCount = await currentToken.balanceOf(adminWallet.address)
            const totalSupply = await currentToken.totalSupply();

            TotalAmount = +PreMintCount;

            for (let index = 0; index < PurchaseArray.length; index++) {
                const element = PurchaseArray[index];
                await currentToken.openMonsterMint(messageHash3, element.amount, { value: ethers.utils.parseEther(element.value) });
                TotalAmount = TotalAmount + element.amount;
            }

            const PostMintCount = await currentToken.balanceOf(adminWallet.address);
            const totalSupply2 = await currentToken.totalSupply();

            expect(parseInt(totalSupply)).to.lessThan(parseInt(totalSupply2));
        });



        it("Mints a presale token from Dapp", async function () {

            //Enable Mint Whitelist
            await currentToken.togglePresaleCooking();
            await currentToken.togglePresaleCooking();

            const [adminWallet, userWallet] = await ethers.getSigners();

            let signature1 = await adminWallet.signMessage(ethers.utils.arrayify(messageHash1));
            let signature2 = await userWallet.signMessage(ethers.utils.arrayify(messageHash2));
            console.log("messageHash2: " + messageHash2)
            console.log("singature2: " + signature2)
            let messageHash3 = ethers.utils.solidityKeccak256(['string'], [message1]);
            const totalSupply = await currentToken.totalSupply();
            //await currentToken.afterHoursMonsterMint(false, messageHash1, signature1, messageHash2, signature2, 2, { value: ethers.utils.parseEther("0.11") });
            await currentToken.afterHoursMonsterMint(messageHash3, 10, { value: ethers.utils.parseEther("0.55") });
            const totalSupply2 = await currentToken.totalSupply();
            expect(parseInt(totalSupply)).to.lessThan(parseInt(totalSupply2));
        });

        it("Will not allow mint over threshold", async function () {

            const PurchaseArray = [
                { amount: 101, value: "7.07" }
            ];

            const [adminWallet, userWallet] = await ethers.getSigners();

            let signature1 = await adminWallet.signMessage(ethers.utils.arrayify(messageHash1));
            let signature2 = await userWallet.signMessage(ethers.utils.arrayify(messageHash2));
            let messageHash3 = ethers.utils.solidityKeccak256(['string'], [message1]);
            //Step 4: Turn on Sales
            //    const PreMintCount = await currentToken.balanceOf(adminWallet.address)
            //      const totalSupply = await currentToken.totalSupply();

            //  TotalAmount = +PreMintCount;

            for (let index = 0; index < PurchaseArray.length; index++) {
                const element = PurchaseArray[index];
                await expect(currentToken.openMonsterMint(messageHash3, element.amount, { value: ethers.utils.parseEther(element.value) })).to.be.revertedWith('Mint amount too large');
                TotalAmount = TotalAmount + element.amount;
            }

            //        const PostMintCount = await currentToken.balanceOf(adminWallet.address)
            //          const totalSupply2 = await currentToken.totalSupply()4

            //            expect(parseInt(totalSupply)).to.lessThan(parseInt(totalSupply2));
        });

        it("Gets Total Supply", async function () {
            const [adminWallet, userWallet] = await ethers.getSigners();

            const totalSupply = await currentToken.totalSupply();

            expect(parseInt(totalSupply)).to.greaterThan(0);

            console.log("Total Supply: " + parseInt(totalSupply))
        });

        it('Transfer four tokens to destination account', async () => {
            const [adminWallet, userWallet] = await ethers.getSigners();

            const howManyToTransfer = 5;
            const FirstBalance = await currentToken.balanceOf(adminWallet.address);
            const SecondBalance = await currentToken.balanceOf(userWallet.address);

            for (let index = 1; index <= howManyToTransfer; index++) {
                await currentToken.transferFrom(adminWallet.address, userWallet.address, index);
            }

            expect(await currentToken.balanceOf(adminWallet.address)).to.eq(FirstBalance - howManyToTransfer);
            expect(await currentToken.balanceOf(userWallet.address)).to.eq(SecondBalance + howManyToTransfer);
        });

        it("Mints free token", async function () {

            const PurchaseArray = [
                { amount: 1, value: "0.07" },
                { amount: 2, value: "0.14" },
                { amount: 100, value: "7" },
                // { amount: 5, value: "0.35" },
                // { amount: 10, value: "0.7" },
                //{ amount: 100, value: "7" }                
            ];

            const [adminWallet, userWallet] = await ethers.getSigners();

            const totalSupply = await currentToken.totalSupply();

            for (let index = 0; index < PurchaseArray.length; index++) {
                const element = PurchaseArray[index];
                await currentToken.monsterMint(userWallet.address, element.amount);
                TotalAmount = TotalAmount + element.amount;
            }
            ;
            const totalSupply2 = await currentToken.totalSupply();

            expect(parseInt(totalSupply)).to.lessThan(parseInt(totalSupply2));
        });

        it('Set reveal address', async () => {
            const hiddenMetadataUri = await currentToken.setHiddenMetadataUri(1);
        });

        it('Will set Base URI and check the first token', async () => {
            const [adminWallet, userWallet] = await ethers.getSigners();

            await currentToken.setBaseURI("ipfs://google.com/");
            await currentToken.setRevealed(true);
            const tokenURI = await currentToken.tokenURI(1);
            expect(tokenURI).to.eq("ipfs://google.com/1.json");
        });

        it("Burn Token", async function () {

            //Enable Mint Whitelist
            await currentToken.togglePresaleCooking();

            const [adminWallet, userWallet] = await ethers.getSigners();

            let signature = await adminWallet.signMessage(ethers.utils.arrayify(messageHash1));

            const totalSupply = await currentToken.totalSupply();
            await currentToken.burn(1);
            const totalSupply2 = await currentToken.totalSupply();
            //expect(parseInt(totalSupply)).to.greaterThan(parseInt(totalSupply2));
        });

        it("Set Multiple Parameters", async function () {
            await currentToken.setParams('70000000000000000', '50000000000000000', '20', '5', true, true);
        });

        it("Get Money Withdraw", async function () {
            const [owner, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20] = await ethers.getSigners();

            let ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));

            console.log("Pre Withdrawal Balance: " + ethBalance);

            let contractEthBalance = ethers.utils.formatEther(await ethers.provider.getBalance(currentToken.address));
            console.log("Contract Balance: " + contractEthBalance);

            await currentToken.withdraw();

            ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));

            console.log("Final Balance: " + ethBalance);

            contractEthBalance = ethers.utils.formatEther(await ethers.provider.getBalance(currentToken.address));
            console.log("Contract Balance: " + contractEthBalance);
        });
    })
