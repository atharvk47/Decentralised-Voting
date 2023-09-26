import { ethers } from "ethers";
import address from "@/artifacts/contractAddress.json"
import abi from "@/artifacts/contracts/Voting.sol/Voting.json"
import { globalActions } from "@/store/globalSlices";
import { store } from "@/store";


const {setWallet} = globalActions
const contractAddress = address.address
const ContractAbi = abi.abi

let ethereum: any
let tx: any

if(typeof window !== 'undefined'){
    ethereum = (window as any).ethereum
}

const connectWallet = async () => {
    try{
        if(!ethereum) return reportError('Please install MetaMask')
        const accounts = await ethereum.request?.({ method: 'eth_requestAccounts'})
        store.dispatch(setWallet(accounts?.[0]))
    }catch(error){
        reportError(error)
    }
}


const checkWallet = async() => {
    try{
        if(!ethereum) return reportError('Please install Metamask')
        const accounts = await ethereum.request?.({method: 'eth_accounts'})

        ethereum.on('chainChanged', async ()=> {
            window.location.reload()
        })

        ethereum.on('accountsChanged', async () => {
            store.dispatch(setWallet(accounts?.[0]))
            await checkWallet()
        })

        if(accounts?.length) {
            store.dispatch(setWallet(accounts?.[0]))
        }else{
            store.dispatch(setWallet(''))           // reporting an error as no wallet is connected
            reportError('Please connect wallet! No account found.')
        }
    }catch(error){

    }
}
const reportError = (error: any) => {
    console.log(error);
}

export {connectWallet, checkWallet}