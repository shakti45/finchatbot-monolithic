## finchatbot-monolithic
This is a financial chatbot project. Developed as part of tech assessment process by FinchatBot.

## demo
![APP DEMO](./assets/demo.webm)

## Flow
![APP FLOW](./assets/FinchatBot_Flow.png)

``1) chatUI- This is the UI service which will interact with user, connect to server socket.

2) chatBackend - this service is the actual interface between chatUIService and backend. So It will forward information to bot service and will receive intent and answer as response. Now once information is returned, it will map intent to any desired action to be performed i.e like perform balance check.

3) botservice - This is the service for taking input i.e utterances and returning processed intents and answer. 

4) finchatbot-userFinservice - This service does processing based on intent i.e regarding balance check or past statement.

``
## Installation
``
git clone
npm install
npm start
``

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
## License
[GNU](https://google.com/)
