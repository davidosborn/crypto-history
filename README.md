# Crypto History

A tool to store the history of the cryptocurrency market.
The data comes from [https://coinmarketcap.com/](CoinMarketCap).

## TODO

- In index.js, we have to pass "ignore" to make Babel transpile the modules in node_modules.
- This is questionable because only "davids-server-framework" and other local modules need that behaviour.
- Babel is also ignoring our plugin-propsal-class-properties.
