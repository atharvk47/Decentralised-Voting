import { ethers } from "ethers";
import address from "@/artifacts/contractAddress.json"
import abi from "@/artifacts/contracts/Voting.sol/Voting.json"
import { globalActions } from "@/store/globalSlices";
import { store } from "@/store";
import { PollParams, PollStruct } from "@/utils/types";


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
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts'})
        store.dispatch(setWallet(accounts?.[0]))
    }catch(error){
        reportError(error)
    }
}


const checkWallet = async() => {
    try{
        if(!ethereum) return reportError('Please install Metamask')
        const accounts = await ethereum?.request?.({method: 'eth_accounts'})

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

const getEthereumContract = async() => {
    
    const accounts = await ethereum?.request?.({method: 'eth_accounts'})
    const provider = accounts?.[0] ? 
    new ethers.providers.Web3Provider(ethereum) : new ethers.providers.JsonRpcProvider(process.env.NEXT_APP_RPC_URL)
    
    const wallet = accounts?.[0] ? null : ethers.Wallet.createRandom()
    const signer = provider.getSigner(accounts?.[0] ? undefined : wallet?.address)

    const contract = new ethers.Contract(contractAddress, ContractAbi, signer)
    return contract
}  

const createPoll = async(data: PollParams) => {
    if(!ethereum) {
        reportError('Please install Metamask')
        return Promise.reject(new Error('Metamask is not installed.'))
    }

    try{
        const contract = await getEthereumContract()
        const {image, title, description, startsAt, endsAt} = data
        const tx = await contract.createPoll(image, title, description, startsAt, endsAt)

        await tx.wait()
        return Promise.resolve(tx)

    }catch(error){
        reportError(error)
        return Promise.reject(error)
    }
}

const getPolls = async(): Promise<PollStruct[]> => {
    const contract = await getEthereumContract()
    const polls = await contract.getPolls()
    return structurePolls(polls)
}

const structurePolls = (polls: PollStruct[]): PollStruct[] => 
polls.map((poll) => (
    {
        id: Number(poll.id),
        image: poll.image,
        title: poll.title,
        description: poll.description,
        votes: Number(poll.votes),
        contestants: Number(poll.contestants),
        deleted: poll.deleted,
        director: poll.director.toLowerCase(),
        startsAt: Number(poll.startsAt),
        endsAt: Number(poll.endsAt),
        timestamp: Number(poll.timestamp),
        voters: poll.voters.map((voter: string) => voter.toLowerCase()),
        avatars: poll.avatars
    }
)
)
.sort((a,b) => b.timestamp- a.timestamp)

export {connectWallet, checkWallet, createPoll, getPolls}