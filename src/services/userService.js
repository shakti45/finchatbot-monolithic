
let queries = require('../queries')


let getIntentResult = async (intent,userID) => {
    //console.log('Case Intent',intent)
    let result
    let nextUtteranceMap = new Map()
    nextUtteranceMap.set('balance.check.all','I want to know my recent transactions')
    nextUtteranceMap.set('balance.check.savings','I want to know my recent transactions from savings account')
    nextUtteranceMap.set('balance.check.creditCard','I want to know my recent transactions from credit account')
    nextUtteranceMap.set('balance.check.current','current account transactions')
    switch(intent){
        case 'balance.check.all' :
            result = await queries.getAllAccountBalanceQuery(userID)
            break
        case 'balance.check.savings' : 
            result = await queries.getAccountBalanceQuery(userID,'savings')
            break
        case 'balance.check.creditCard' : 
            result = await queries.getAccountBalanceQuery(userID,'creditCard')
            break
        case 'balance.check.current' : 
            result = await queries.getAccountBalanceQuery(userID,'current')
            break
        case 'transaction.all' :
            result = [
                {
                    trxnID :1,
                    type : 'shopping',
                    account : 'savings',
                    to : 'Zara',
                    amount : 1000,
                    date : '12-05-2020'
                },
                {
                    trxnID :2,
                    type : 'fundTransfer',
                    account : 'savings',
                    to : 'mom',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :3,
                    type : 'billPayment',
                    account : 'savings',
                    to : 'BESCOM',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :4,
                    type : 'shopping',
                    account : 'savings',
                    to : 'Dominos',
                    amount : 1000,
                    date : '12-05-2020'
                },
                {
                    trxnID :5,
                    type : 'shopping',
                    account : 'credit',
                    to : 'gucci',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :6,
                    type : 'billPayment',
                    account : 'savings',
                    to : 'AIRTEL',
                    amount : 100,
                    date : '12-05-2020'
                },
                {
                    trxnID :7,
                    type : 'shopping',
                    account : 'savings',
                    to : 'Zara',
                    amount : 1000,
                    date : '12-05-2020'
                },
                {
                    trxnID :8,
                    type : 'fundTransfer',
                    account : 'current',
                    to : 'apple-vendor',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :9,
                    type : 'billPayment',
                    account : 'current',
                    to : 'BESCOM',
                    amount : 500,
                    date : '12-05-2020'
                }                
            ]
            break
        case 'transaction.savings' :
            result = [
                {
                    trxnID :1,
                    type : 'shopping',
                    account : 'savings',
                    to : 'Zara',
                    amount : 1000,
                    date : '12-05-2020'
                },
                {
                    trxnID :2,
                    type : 'fundTransfer',
                    account : 'savings',
                    to : 'mom',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :3,
                    type : 'billPayment',
                    account : 'savings',
                    to : 'BESCOM',
                    amount : 500,
                    date : '12-05-2020'
                }
            ]
            // await getPastStatementsQuery(userID,n)
            break
        case 'transaction.creditCard' :
            result =  [
                {
                    trxnID :4,
                    type : 'shopping',
                    account : 'creditCard',
                    to : 'Dominos',
                    amount : 1000,
                    date : '12-05-2020'
                },
                {
                    trxnID :5,
                    type : 'shopping',
                    account : 'creditCard',
                    to : 'gucci',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :6,
                    type : 'billPayment',
                    account : 'creditCard',
                    to : 'AIRTEL',
                    amount : 100,
                    date : '12-05-2020'
                }
            ]
            break
        case 'transaction.current' :
            result =[
                {
                    trxnID :7,
                    type : 'shopping',
                    account : 'current',
                    to : 'Zara',
                    amount : 1000,
                    date : '12-05-2020'
                },
                {
                    trxnID :8,
                    type : 'fundTransfer',
                    account : 'current',
                    to : 'apple-vendor',
                    amount : 500,
                    date : '12-05-2020'
                },
                {
                    trxnID :9,
                    type : 'billPayment',
                    account : 'current',
                    to : 'BESCOM',
                    amount : 500,
                    date : '12-05-2020'
                }
            ]
            break
        default : 
            result = null
            break
    }
    for(let i in result){
        //console.log('next utterance',result[i]['type'])
        let nextUtr = 'balance.check.'+result[i]['type']
        //console.log('nextUtterance',nextUtr)
        result[i]['nextIntent'] = nextUtteranceMap.get(nextUtr)
        result[i]['trigger'] = intent.split('.')[0]=='balance'?true:false
    }
    return result
}
let onBoardUser = async(userID) => {
    let checkUser = await queries.checkUserQuery(userID)
    if(!checkUser){
        let createUser = await queries.createUserQuery(userID)
        let createUserConversation = await queries.createUserConversationQuery(userID)
        //console.log(createUser,createUserConversation)
        if ((createUser)&&(createUserConversation)){
            return true
        }
        return false
    }
    return true
} 
let saveConversation = async(userID,message) => {
    let result = await queries.updateUserConversationQuery(userID,message)
    if(result){
        return true
    }
    return false
}
let getSession = async(userID) => {
    let result = await queries.getSessionCounterQuery(userID)
    return result
}
let saveSession  = async(userID) => {
    let result = await queries.updateSessionCounterQuery(userID)
    return result 
}
let getLastEvent = async(userID,sessionID) => {
    let result = await queries.getLastEventQuery(userID,sessionID)
    return result
}
module.exports =  {
    onBoardUser,
    getIntentResult,
    saveConversation,
    getSession,
    saveSession,
    getLastEvent
}