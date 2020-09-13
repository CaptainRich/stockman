
////////////////////////////////////////////////////////////////////////////
// Global Variable Definitions

var stock = [];
    // { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },

    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" }    

var cryptos = [];
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" } ];



var indexes = [4];       // Indexes are: S&P, NASDAQ, NYSE, DOW

var stockSymbol;
var index;               // the index into the 'stock' array
var dailyCheckStocks;    // if "true", the daily parameters have been obtained, no need to request again.
var dailyCheckCyrptos;   // if "true", the daily parameters have been obtained, no need to request again.
var dataVal;             // generic data value.
var checkSymbol;         // symbol for the "alert" columns

// Tab button queries
var tabListEl = document.querySelector("#tab-list");
var activeTab = document.querySelector("#general-tab");

// Modal close button queries
var modalCloseBtnEl = document.querySelector("#error-close");
modalCloseBtnEl.addEventListener("click", closeModal);

///////////////////////////////////////////////////////////////////////////
// API URLs
var urlKeyStockAlphaAdvantage    = "&apikey=XMDSSBDY4JYPVPPD";
var apiStockParamsUrl       = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";

var urlKeyFinancialModeling = "a107f24e0f6aaac5f180293fa869cd10";
var apiMarketIndexUrl       = "https://financialmodelingprep.com/api/v3/quotes/index?apikey=";

var urlKeyFinnhub           = "&token=btdd1gf48v6t4umjmegg";
var apiFinnhubStockPriceUrl = "https://finnhub.io/api/v1/quote?symbol=";

var urlKeyNomics            = "25f6ac7783932e08f376ee60095ddd35";
var apiNomicsCryptoPrice    = "https://cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/ticker?key=";

var apiNomicsIds            = "&ids=";
var apiNomicsInterval       = "&interval=1d&convert=USD";

///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified stock
var getStockParameters = function (stockSymbol) 
{
    stockValues = 
    {
        name : "",
        symbol : "",
        exchange : "",
        eps : "",
        epsMin : "",
        epsMax : "",
        beta : "",
        betaMin : "",
        betaMax : "",
        pe : "",
        peMin : "",
        peMax : "",
        target : "",
        targetMin : "",
        targetMax : "",
        f50Avg : "",
        f50AvgMin : "",
        f50AvgMax : "",
        t200Avg : "",
        t200AvgMin : "",
        t200AvgMax : ""
    };

    finalUrl = apiStockParamsUrl + stockSymbol + urlKeyStockAlphaAdvantage;
    // Make the request for the stock's data
    fetch(finalUrl).then(function (response) 
    {
        return response.json();
    }).then(function (response)
    {
        // Verify that data was acquired
        if (!response.Name)
        {
            throw "Error: Symbol not found.";
        }

        // Put the stock's data in the return variables.
        stockValues.symbol   = stockSymbol;
        stockValues.exchange = response.Exchange;
        stockValues.eps      = response.EPS;
        stockValues.beta     = response.Beta;
        stockValues.pe       = response.PERatio;
        stockValues.name     = response.Name;
        stockValues.target   = response.AnalystTargetPrice;
        stockValues.f50Avg   = response["50DayMovingAverage"];
        stockValues.t200Avg  = response["200DayMovingAverage"];

        stock.push(stockValues);

        // Update the HTML page with these values
        showOneStock(stock.length - 1);

        return true;
    }).then(function () 
    {
        
        // Construct the finished URL to obtain the market index values (once only)
        finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

        // Make the request for the stock's data
        fetch(finalUrl).then(function (response) 
        {
            return response.json();
        }).then(function (response) 
        {
            // Verify that data was acquired
            if (response.cod == 404) 
            {
                returnValue = -1;
                return (returnValue);
            }

            // Get the index values and put them in the return variables.
            indexes[0] = response[7].price;     // S&P 500
            indexes[1] = response[19].price;    // NASDAQ
            indexes[2] = response[12].price;    // NYSE
            indexes[3] = response[31].price;    // DOW

            // Update the HTML page with these values
            showEquityIndexes( index );

            updateStockTable();
            saveInvestments();

            return;
        }).then(function() 
        {
            // Construct the finished URL to obtain the current stock price.
            var finalUrl = apiFinnhubStockPriceUrl + stockSymbol + urlKeyFinnhub;

            // Make the request for the stock's price
            fetch(finalUrl).then(function(response) 
            {
                return response.json();
            }).then(function(response) 
            {
                console.log(response);
                // Verify that data was acquired
                if (!response.c)
                {
                    console.log("error");
                    return false;
                }
        
                // Put the stock's price data in the return variable.
                stockValues.price = response.c;
        
                // Update the HTML page with this value
                dataVal = document.querySelector("#stock-price .current");
                dataVal.textContent = response.c;
                
                return true;
            });
        });
    }).catch(function (error) 
    {
        // Notice this `.catch()` is chained onto the end of the `.then()` method
        // alert("Unable to connect to AlphaAdvantage for stock data.");
        console.log(error);
        invalidStock();
        return;
    });
}

///////////////////////////////////////////////////////////////////////////
// Function to update the  data for a specified stock. This assumes the 
// stock is already in the array.
var updateStockParameters = function (index) 
{
    // Get the stock symbol from the array.
    var stockSymbol = stock[index].symbol;

    // Construct the finished URL to obtain the current stock price.
    var finalUrl = apiFinnhubStockPriceUrl + stockSymbol + urlKeyFinnhub;

    // Make the request for the stock's price
    fetch(finalUrl).then(function (response) 
    {
        return response.json();

    }).then(function (response) 
    {
        console.log(response);
        // Verify that data was acquired
        if (!response.c) {
            console.log("error");
            return false;
        }

        // Put the stock's updated price data in the array.
        stock[index].price = response.c;

        return true;

    }).then(function () 
    {

        // Construct the finished URL to obtain the market index values 
        finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

        // Make the request for the stock's data
        fetch(finalUrl).then(function (response) {
            return response.json();

        }).then(function (response) {
            // Verify that data was acquired
            if (response.cod == 404) {
                returnValue = -1;
                return (returnValue);
            }

            // Get the index values and put them in the return variables.
            indexes[0] = response[7].price;     // S&P 500
            indexes[1] = response[19].price;    // NASDAQ
            indexes[2] = response[12].price;    // NYSE
            indexes[3] = response[31].price;    // DOW

            // Update the HTML page with these values
            showEquityIndexes(index);

            return;

        }).then(function (response) 
        {
            // Check the "dailyCheck" flag, so the basic stock parameters
            // are only checked once a day - since they won't be changed 
            // until after the market closes.

            if (dailyCheckStocks) {
                saveInvestments();
                return;
            }

            finalUrl = apiStockParamsUrl + stockSymbol + urlKeyStockAlphaAdvantage;

            // Make the request for the stock's data (updated daily)
            fetch(finalUrl).then(function (response) {
                return response.json();

            }).then(function (response) 
            {
                // Verify that data was acquired
                if (!response.Name) {
                    throw "Error: Symbol not found.";
                }

                // Put the stock's updated data back in the array.
                // stockValues.symbol   = stockSymbol;
                // stockValues.exchange = response.Exchange;
                // stockValues.name     = response.Name;
                stock[index].eps     = response.EPS;
                stock[index].beta    = response.Beta;
                stock[index].pe      = response.PERatio;
                stock[index].target  = response.AnalystTargetPrice;
                stock[index].f50Avg  = response["50DayMovingAverage"];
                stock[index].t200Avg = response["200DayMovingAverage"];

                // Reset the "dailyCheck" flag, so this is only done once.
                dailyCheckStocks = true;

                // This save is necessary because we updated the stock parameters.
                saveInvestments();

                return true;
            })
        })
    }).catch(function (error) {
        // Notice this `.catch()` is chained onto the end of the `.then()` methods
        console.log(error);
        invalidStock();
        return;
    });
        
}

///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified cryptocurrency
var getCryptoParameters = function (cryptoSymbol, index) {

    // Construct the finished URL to obtain the current cryptocurrency data.
    var finalUrl = apiNomicsCryptoPrice + urlKeyNomics + apiNomicsIds + cryptoSymbol + apiNomicsInterval;
    console.log(finalUrl);
    cryptoValues = 
    {
        name: "",
        symbol: "",
        price: "",
        priceMin: "",
        priceMax: "",
        volume: "",
        volumeMin: "",
        volumeMax: "",
        supply: "",
        supplyMin: "",
        supplyMax: "",
        marcap: "",
        marcapMin: "",
        marcapMax: ""
    };

    // Make the request for the currency's data
    fetch(finalUrl).then(function (response) 
    {
        return response.json();
    }).then(function (response) 
    {
        // Verify that data was acquired
        // if (response.cod == 404) {
        //     returnValue = -1;
        //     return (returnValue);
        // }
        console.log(response[0].name);
        if(!response[0].name)
        {
            throw "not found";
        }
        console.log("different error");

        // Put the currency's  data in the return variables.
        cryptoValues.name      = response[0].name;
        cryptoValues.symbol    = response[0].symbol;
        cryptoValues.price     = response[0].price;
        cryptoValues.volume    = response[0].circulating_supply;
        cryptoValues.supply    = response[0].max_supply;
        cryptoValues.marcap    = response[0].market_cap;

        cryptos.push(cryptoValues);

        updateCryptoTable();

        showOneCrypto(cryptos.length - 1);
        saveInvestments();

        return;
    })
    .catch(function (error) 
    {
        console.log(error);
        invalidCrypto();
        return;
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to update the current data for a specified cryptocurrency.  This assumes the 
// cryptocurrency is already in the array.
var updateCryptoParameters = function (index) 
{
    // Construct the finished URL to obtain the current cryptocurrency data.
    var finalUrl = apiNomicsCryptoPrice + urlKeyNomics + apiNomicsIds + cryptoSymbol + apiNomicsInterval;
    console.log(finalUrl);

    // Make the request for the currency's data
    fetch(finalUrl).then(function (response) 
    {
        return response.json();
    }).then(function (response) 
    {
        console.log(response[0].name);
        if(!response[0].name)
        {
            throw "not found";
        }
        console.log("different error");

        // Put the currency's  data in the return variables.
        cryptos[index].price     = response[0].price;
        cryptos[index].volume    = response[0].circulating_supply;
        cryptos[index].supply    = response[0].max_supply;
        cryptos[index].marcap    = response[0].market_cap;

        showOneCrypto(cryptos.length - 1);
        saveInvestments();

        return;
    })
    .catch(function (error) 
    {
        console.log(error);
        invalidCrypto();
        return;
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for one equity.
var showOneStock = function( index ) {

    // Display the data from the 'object'
    
    dataVal = document.querySelector("#stock-price .current");
    dataVal.textContent = parseFloat(stock[index].price).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-price .min");
    dataVal.textContent = parseFloat(stock[index].priceMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-price .max");
    dataVal.textContent = parseFloat(stock[index].priceMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    checkSymbol = verifyInvestmentItem( stock[index].price, stock[index].priceMin, stock[index].priceMax );
    dataVal = document.querySelector("#stock-price .alert");
    dataVal.textContent = checkSymbol;

    dataVal = document.querySelector("#stock-eps .current");
    dataVal.textContent = parseFloat(stock[index].eps).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-eps .min");
    dataVal.textContent = parseFloat(stock[index].epsMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-eps .max");
    dataVal.textContent = parseFloat(stock[index].epsMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});;
    checkSymbol = verifyInvestmentItem( stock[index].eps, stock[index].epsMin, stock[index].epsMax );
    dataVal = document.querySelector("#stock-eps .alert");
    dataVal.textContent = checkSymbol;
    

    dataVal = document.querySelector("#stock-beta .current");
    dataVal.textContent = stock[index].beta;
    dataVal = document.querySelector("#stock-beta .min");
    dataVal.textContent = stock[index].betaMin;
    dataVal = document.querySelector("#stock-beta .max");
    dataVal.textContent = stock[index].betaMax;
    checkSymbol = verifyInvestmentItem( stock[index].beta, stock[index].betaMin, stock[index].betaMax );
    dataVal = document.querySelector("#stock-beta .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-per .current");
    dataVal.textContent = stock[index].pe;
    dataVal = document.querySelector("#stock-per .min");
    dataVal.textContent = stock[index].peMin;
    dataVal = document.querySelector("#stock-per .max");
    dataVal.textContent = stock[index].peMax;
    checkSymbol = verifyInvestmentItem( stock[index].pe, stock[index].peMin, stock[index].peMax );
    dataVal = document.querySelector("#stock-per .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-target .current");
    dataVal.textContent = parseFloat(stock[index].target).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-target .min");
    dataVal.textContent = parseFloat(stock[index].targetMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-target .max");
    dataVal.textContent = parseFloat(stock[index].targetMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    checkSymbol = verifyInvestmentItem( stock[index].target, stock[index].targetMin, stock[index].targetMax );
    dataVal = document.querySelector("#stock-target .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-50avg .current");
    dataVal.textContent = parseFloat(stock[index].f50Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-50avg .min");
    dataVal.textContent = parseFloat(stock[index].f50AvgMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-50avg .max");
    dataVal.textContent = parseFloat(stock[index].f50AvgMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    checkSymbol = verifyInvestmentItem( stock[index].f50Avg, stock[index].f50AvgMin, stock[index].f50AvgMax );
    dataVal = document.querySelector("#stock-50avg .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-200avg .current");
    dataVal.textContent = parseFloat(stock[index].t200Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-200avg .min");
    dataVal.textContent = parseFloat(stock[index].t200AvgMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-200avg .max");
    dataVal.textContent = parseFloat(stock[index].t200AvgMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    checkSymbol = verifyInvestmentItem( stock[index].t200Avg, stock[index].t200AvgMin, stock[index].t200AvgMax );
    dataVal = document.querySelector("#stock-200avg .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector( "#stock-name" );
    dataVal.textContent = stock[index].name; 
    dataVal = document.querySelector( "#stock-symbol" );
    dataVal.textContent = stock[index].symbol;
    dataVal = document.querySelector( "#stock-exchange" );
    dataVal.textContent = stock[index].exchange;

}



//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for one cryptocurrency.
var showOneCrypto = function( index ) {
    // Display the data from the 'object'
    dataVal = document.querySelector("#crypto-price .current");
 
    var displayString = parseFloat(cryptos[index].price).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 4, maximumFractionalDigits:4});
    dataVal.textContent = displayString;
    dataVal = document.querySelector("#crypto-price .min");
    dataVal.textContent = parseFloat(cryptos[index].priceMin).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 4, maximumFractionalDigits:4});
    dataVal = document.querySelector("#crypto-price .max");
    dataVal.textContent = parseFloat(cryptos[index].priceMax).toLocaleString('en-US', {style:'currency', currency:'USD',  minimumFractionDigits: 4, maximumFractionalDigits:4});
    checkSymbol = verifyInvestmentItem( cryptos[index].price, cryptos[index].priceMin, cryptos[index].priceMax );
    dataVal = document.querySelector("#crypto-price .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#crypto-volume .current");
    dataVal.textContent = parseFloat(cryptos[index].volume).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-volume .min");
    dataVal.textContent = parseFloat(cryptos[index].volumeMin).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-volume .max");
    dataVal.textContent = parseFloat(cryptos[index].volumeMax).toLocaleString('en-US');
    checkSymbol = verifyInvestmentItem( cryptos[index].volume, cryptos[index].volumeMin, cryptos[index].volumeMax );
    dataVal = document.querySelector("#crypto-volume .alert");
    dataVal.textContent = checkSymbol;

  
    dataVal = document.querySelector("#crypto-supply .current");
    dataVal.textContent = parseFloat(cryptos[index].supply).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-supply .min");
    dataVal.textContent = parseFloat(cryptos[index].supplyMin).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-supply .max");
    dataVal.textContent = parseFloat(cryptos[index].supplyMax).toLocaleString('en-US');  
    checkSymbol = verifyInvestmentItem( cryptos[index].supply, cryptos[index].supplyMin, cryptos[index].supplyMax );
    dataVal = document.querySelector("#crypto-supply .alert");
    dataVal.textContent = checkSymbol;

      
    dataVal = document.querySelector("#crypto-marcap .current");
    dataVal.textContent = parseFloat(cryptos[index].marcap).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});
    dataVal = document.querySelector("#crypto-marcap .min");
    dataVal.textContent = parseFloat(cryptos[index].marcapMin).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});
    dataVal = document.querySelector("#crypto-marcap .max");
    dataVal.textContent = parseFloat(cryptos[index].marcapMax).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});  
    checkSymbol = verifyInvestmentItem( cryptos[index].marcap, cryptos[index].marcapMin, cryptos[index].marcapMax );
    dataVal = document.querySelector("#crypto-marcap .alert");
    dataVal.textContent = checkSymbol;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for the equity indexes.
var showEquityIndexes = function() {

    // Display the data from the 'object'

    dataVal = document.querySelector("#sp500_raw");
    dataVal.textContent = indexes[0];
    dataVal = document.querySelector("#nasdaq_raw");
    dataVal.textContent = indexes[1];
    dataVal = document.querySelector("#nyse_raw");
    dataVal.textContent = indexes[2];
    dataVal = document.querySelector("#dow_raw");
    dataVal.textContent = indexes[3];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Define the function to verify that the 'current value' is within the range defined by
// the 'minValue' and 'maxValue'.
verifyInvestmentItem = function( value, valueMin, valueMax ) {

    // Need to make sure both min/max values are defined.
    if( valueMin == ""  ||  valueMax == "" ) {
        return "?";
    }
    else if( value < valueMin  ||  value > valueMax ) {
        return "*";
    }
    else {
        return " ";
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to save the investment data to local storage.
var saveInvestments = function() {

    // Save the array of stock objects
    localStorage.setItem( "investmentStocks", JSON.stringify( stock ) );

    // save the array of cryptocurrency objects
    localStorage.setItem( "investmentCryptos", JSON.stringify( cryptos ) );

    // Save the array of market index values
    localStorage.setItem( "investmentIndexes", JSON.stringify( indexes ) );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to save the investment data to local storage.
var retrieveInvestments = function() {
    
    // Retrieve the array of stock objects
    var stocksRead = [];
    stocksRead     = JSON.parse( localStorage.getItem( "investmentStocks" ) );

    if( stocksRead != null ) {
        stock = stocksRead;
    }

    // Retrieve the array of cryptocurrency objects
    var cryptosRead = [];
    cryptosRead     = JSON.parse( localStorage.getItem( "investmentCryptos" ) );

    if( cryptosRead != null ) {
        cryptos = cryptosRead;
    }

    // Retrieve the array of market indexes
    var indexesRead = [];
    indexesRead     = JSON.parse( localStorage.getItem( "investmentIndexes" ) );

    if( indexesRead != null ) {
        indexes = indexesRead;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to obtain the current data, save to local storage if necessary and set the
// update flag.

var getCurrentDay = function() {

    // Get the current day 
    var today = moment().format( 'L' );

    // Try to retrieve the date from local storage. 
    var earlierDate = localStorage.getItem( "savedDate" );

    // If the earlierDate exists, compare it to the current date.  If the dates match, set
    // the flag indicating today's "daily" data has been obtained.  If the date doesn't 
    // match set the flag indicating today's daily data has not been obtained.

    if( earlierDate ) {
        if( today === earlierDate ) {
            dailyCheckStocks  = true;
            dailyCheckCryptos = true;
            //return;   /////  For debugging purposes only /////////  Remove this comment on the return for production //   
        }
        else {
            dailyCheckStocks  = false;
            dailyCheckCryptos = false;
        }
    }

    ///////////  For debugging purposes only //////////////  Remove this for production ////////////
    dailyCheckCyrptos = false;
    dailyCheckStocks  = false;
    ///////////  For debugging purposes only ..............  Remove this for production ///////////

    // For no earlier date, or a different date, save the current date to local storage
    // for the next time this application is run.

    localStorage.setItem( "savedDate", today );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to play the 'alert' sound for the user, indicating a parameter is out of range.
// var playAlert = function() {
//     var alertSound = new Audio( "./assets/sounds/alarm07.wav" );
//     alertSound.play();

// }

// Temporary search buttons and event listeners, will delete later.
var searchStockEl = document.querySelector("#stock-search-btn");
var searchCryptoEl = document.querySelector("#crypto-search-btn");
searchStockEl.addEventListener("click", searchStock);
searchCryptoEl.addEventListener("click", searchCrypto);

// Search functions
function searchStock()
{
    // Take value from searchbar textcontent
    var stockVal = document.querySelector("#stock-search").value;

    // Search for stock data
    getStockParameters(stockVal);

    // Save function
    saveInvestments();
}
function searchCrypto()
{
    // Take value from searchbar text content
    var cryptoVal = document.querySelector("#crypto-search").value;

    // Search for crypto data
    getCryptoParameters(cryptoVal);

    // Save function
    saveInvestments();
}
function invalidStock()
{
    // Clear stock search bar
    document.querySelector("#stock-search").value = "";

    // Query for error modal
    var errorModalEl = document.querySelector("#error-modal");

    // Set modal to active
    errorModalEl.classList.add("is-active");
}
function invalidCrypto()
{
    // Clear crypto search bar
    document.querySelector("#crypto-search").value = "";

    // Query for error modal
    var errorModalEl = document.querySelector("#error-modal");

    // Set modal to active
    errorModalEl.classList.add("is-active");
}
function closeModal()
{
    // Query for error modal.
    var errorModalEl = document.querySelector("#error-modal");
    
    // Remove active from modal
    errorModalEl.classList.remove("is-active");
}
// Update functions
function updateStockTable()
{
    // Get general stock table element.
    var generalStockTableEl = document.querySelector("#general-stock-table");

    // Clear table.
    generalStockTableEl.innerHTML = "";

    // Add title row to table.
    var titleRowEl = document.createElement("tr");
    var titleEl = document.createElement("th");
    titleEl.setAttribute("colspan","3");
    titleEl.classList.add("has-text-centered");
    titleEl.textContent = "Equities";
    titleRowEl.appendChild(titleEl);
    generalStockTableEl.appendChild(titleRowEl);

    // Add header row to table.
    var headerRowEl = document.createElement("tr");
    var nameHeaderEl = document.createElement("th");
    nameHeaderEl.textContent = "Name";
    headerRowEl.appendChild(nameHeaderEl);
    var symbolHeaderEl = document.createElement("th");
    symbolHeaderEl.textContent = "Symbol";
    headerRowEl.appendChild(symbolHeaderEl);
    var alertHeaderEl = document.createElement("th");
    alertHeaderEl.textContent = "Alert";
    headerRowEl.appendChild(alertHeaderEl);
    generalStockTableEl.appendChild(headerRowEl);

    // Add data for each stock.
    stock.forEach(function(value)
    {
        var dataRowEl = document.createElement("tr");
        var nameEl = document.createElement("td");
        var symbolEl = document.createElement("td");
        var alertEl = document.createElement("td");

        nameEl.textContent = value.name;
        symbolEl.textContent = value.symbol;
        // Add in alert data

        dataRowEl.appendChild(nameEl);
        dataRowEl.appendChild(symbolEl);
        dataRowEl.appendChild(alertEl);
        
        generalStockTableEl.appendChild(dataRowEl);
    });

    if(stock.length < 5)
    {
        var searchRowEl = document.createElement("tr");

        var searchEl = document.createElement("td");
        searchEl.setAttribute("colspan", "3");

        var searchContainerEl = document.createElement("div");
        searchContainerEl.classList.add("field", "is-grouped");

        var inputContainerEl = document.createElement("p");
        inputContainerEl.classList.add("control", "is-expanded");
        var inputEl = document.createElement("input");
        inputEl.classList.add("input");
        inputEl.setAttribute("type", "text");
        inputEl.setAttribute("placeholder", "Enter stock symbol");
        inputEl.id = "stock-search";
        inputContainerEl.appendChild(inputEl);
        searchContainerEl.appendChild(inputContainerEl);

        var btnContainerEl = document.createElement("p");
        btnContainerEl.classList.add("control");
        var btnEl = document.createElement("a");
        btnEl.classList.add("button", "is-info");
        btnEl.id = "stock-search-btn";
        btnEl.textContent = "Search";
        btnEl.addEventListener("click", searchStock);
        btnContainerEl.appendChild(btnEl);
        searchContainerEl.appendChild(btnContainerEl);

        searchEl.appendChild(searchContainerEl);
        searchRowEl.appendChild(searchEl);

        generalStockTableEl.appendChild(searchRowEl);
    }
}
function updateCryptoTable()
{
    // Get general stock table element.
    var generalCryptoTableEl = document.querySelector("#general-crypto-table");

    // Clear table.
    generalCryptoTableEl.innerHTML = "";

    // Add title row to table.
    var titleRowEl = document.createElement("tr");
    var titleEl = document.createElement("th");
    titleEl.setAttribute("colspan","3");
    titleEl.classList.add("has-text-centered");
    titleEl.textContent = "Cryptocurrency";
    titleRowEl.appendChild(titleEl);
    generalCryptoTableEl.appendChild(titleRowEl);

    // Add header row to table.
    var headerRowEl = document.createElement("tr");
    var nameHeaderEl = document.createElement("th");
    nameHeaderEl.textContent = "Name";
    headerRowEl.appendChild(nameHeaderEl);
    var symbolHeaderEl = document.createElement("th");
    symbolHeaderEl.textContent = "Symbol";
    headerRowEl.appendChild(symbolHeaderEl);
    var alertHeaderEl = document.createElement("th");
    alertHeaderEl.textContent = "Alert";
    headerRowEl.appendChild(alertHeaderEl);
    generalCryptoTableEl.appendChild(headerRowEl);

    console.log("cryptos length", cryptos.length);
    console.log(cryptos);
    // Add data for each stock.
    cryptos.forEach(function(value)
    {
        var dataRowEl = document.createElement("tr");
        var nameEl = document.createElement("td");
        var symbolEl = document.createElement("td");
        var alertEl = document.createElement("td");

        nameEl.textContent = value.name;
        symbolEl.textContent = value.symbol;
        // Add in alert data

        dataRowEl.appendChild(nameEl);
        dataRowEl.appendChild(symbolEl);
        dataRowEl.appendChild(alertEl);
        
        generalCryptoTableEl.appendChild(dataRowEl);
    });

    if(cryptos.length < 5)
    {
        var searchRowEl = document.createElement("tr");

        var searchEl = document.createElement("td");
        searchEl.setAttribute("colspan", "3");

        var searchContainerEl = document.createElement("div");
        searchContainerEl.classList.add("field", "is-grouped");

        var inputContainerEl = document.createElement("p");
        inputContainerEl.classList.add("control", "is-expanded");
        var inputEl = document.createElement("input");
        inputEl.classList.add("input");
        inputEl.setAttribute("type", "text");
        inputEl.setAttribute("placeholder", "Enter cryptocurrency symbol");
        inputEl.id = "crypto-search";
        inputContainerEl.appendChild(inputEl);
        searchContainerEl.appendChild(inputContainerEl);

        var btnContainerEl = document.createElement("p");
        btnContainerEl.classList.add("control");
        var btnEl = document.createElement("a");
        btnEl.classList.add("button", "is-info");
        btnEl.id = "crypto-search-btn";
        btnEl.textContent = "Search";
        btnEl.addEventListener("click", searchCrypto);
        btnContainerEl.appendChild(btnEl);
        searchContainerEl.appendChild(btnContainerEl);

        searchEl.appendChild(searchContainerEl);
        searchRowEl.appendChild(searchEl);

        generalCryptoTableEl.appendChild(searchRowEl);
    }
}

// Change tabs event listener
tabListEl.addEventListener("click", function(event)
{
    // Getting list element that was clicked on.
    affectedEl = event.target.parentElement;

    // Checks to see if they just clicked on the container or the active tab.
    if(affectedEl.nodeName !== "LI" || affectedEl.classList.contains("is-active"))
    {
        return;
    }
    else
    {
        // Change active element to clicked element.
        affectedEl.classList.add("is-active");
        activeTab.classList.remove("is-active");

        // Hide content from previous tab.
        document.querySelector("#" + activeTab.id.replace("-tab", "page")).classList.add("hidden");

        // Show content from new active tab.
        document.querySelector("#" + affectedEl.id.replace("-tab", "page")).classList.remove("hidden");

        // Set active tab equal to new active tab.
        activeTab = affectedEl;
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start a timer to update the stock and cryptocurrency pages every 10 minutes.
var updateAll = setInterval( function() {

    console.log( "In 10-min update function.");
    
    // Update the data in the 'stock' array.
    stock.forEach(function(value, index)
    {
        updateStockParameters(index);
    });

    // Update the data in the 'cryptos' array.
    cryptos.forEach(function(value, index)
    {
        updateCryptoParameters(index);
    });

}, (1000 * 60 * 10) );   // 1000 milliseconds/second * 60 seconds/minute * 10 minutes.