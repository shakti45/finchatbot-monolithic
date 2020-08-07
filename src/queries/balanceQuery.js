let balanceQuery = (userId,...actType) => {
//  let query =   [
//         {
//             '$unwind':'$accounts'
//         },        
//         {
//             '$match': {
//                 'userid' : userId,
//                 'accounts.active' : true,
//                 'accounts.type' : {
//                     '$in': actType
//                     }
//                 }
//         },
//         {
//             '$project' : {
//                 '_id': 0 ,
//                 'password': 0
//                 }
//         }
//     ]
//     return query
}
module.exports = {
    balanceQuery
}