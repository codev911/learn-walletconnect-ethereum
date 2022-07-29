import { Component } from '@angular/core';
import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/ethereum-provider";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private web3provider: any | undefined;

  async ngOnInit(): Promise<void> {
    const provider = new WalletConnectProvider({
      chainId: 4,
      infuraId: "9aa3d95b3bc440fa88ea12eaa4456161", // Required
    });

    provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
    });
    
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
    });
    
    // Subscribe to session connection
    provider.on("connect", () => {
      console.log("connect");
    });
    
    // Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
    });

    await provider.enable();

    this.web3provider =  new ethers.providers.Web3Provider(provider);

    const signers = await this.web3provider.getSigner(provider.accounts[0]);
    const gasPrice = await this.web3provider.getGasPrice();
    const gasLimit = ethers.BigNumber.from('21000');

    console.log(provider.accounts[0])

    try{
      const tx = {
        from: provider.accounts[0],
        to: "0xd6dCF3eCf1f56a49Fd4DDBCcbCf6E37105d9eA5B",
        value: ethers.BigNumber.from('2100000'),
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        nonce: this.web3provider.getTransactionCount(provider.accounts[0]),
      };
      const sendTx = await signers.sendTransaction(tx);
      await sendTx.wait();
      console.log(sendTx);
    }catch(e: any){
      console.log(e)
    }
  }
}
