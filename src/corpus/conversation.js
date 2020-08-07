let conversation = {
    'userID' : 'shakti45@gmail.com',
    'conversations': [
        {
            'sessionID': 1,
            'timestamp': new Date(),
            'event': 'login'
        },
        {
            'sessionID': 1,
            'sessionStatus':true,
            'timestamp': new Date(),
            'event':'newMessage',
            'from': 'Bot',
            'to' : 'shakti45@gmail.com',
            'text': 'Hello',
            'template': 'balance',
            'intent': 'balance.check.savings',
            'data':[
                {
                'type':'savings',
                'balance': 5000,
                'nextIntent': 'transactions.savings'
                }
            ]
        },
        {
            'sessionID':1,
            'event': 'disconnect',
            'timestamp': new Date()
        }
    ]
}