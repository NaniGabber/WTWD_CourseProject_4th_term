class CurrencyData {
    #data;

    getCurrencyValueList() {
        if (this.#data)
            return this.#data.exchangeRate.map(e => e.currency);
        else console.error("Privatbank dataset is null")
    }

    getSaleByUAH(currency = "USD") {
        if (currency.length == 3 && /[A-Z]/.test(currency)) {
            const rate = this.#data.exchangeRate.find(e => e.currency == currency);
            if (rate.saleRate) return rate.saleRate;
            else return rate.saleRateNB;
        }
        else console.error("Error! Wrong currency parameter");
    }

    getPurchaseByUAH(currency = "USD") {
        if (currency.length == 3 && /[A-Z]/.test(currency)) {
            const rate = this.#data.exchangeRate.find(e => e.currency == currency)
            if (rate.purchaseRate) return rate.purchaseRate;
            else return rate.purchaseRateNB;

        }
        else console.error("Error! Wrong currency parameter");
    }

    async fetchCurrencyDataByDate(date) {
        let formatted_date = date.toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        let proxyUrl = "https://proxy.cors.sh/";
        let url = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${formatted_date}`;

        console.log("Request URL:", url);

        this.#data = await fetch(proxyUrl + url, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'x-cors-api-key': 'temp_17943ba2c2d0863a1f943cb325a209b0'
            }
        })
            .then(response => {
                console.log(response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Failed to fetch data:", error);
            });
    }

    fillDocumentSelect(querySelector) {
        const select = document.querySelector(querySelector);
        //Очистка від попередніх значень
        select.innerHTML = "";

        //Перезапис
        this.getCurrencyValueList().forEach((currency) => {
            select.add(new Option(currency, currency));
        });
    }
}
const today = new Date().toISOString().split('T')[0];
const currencyData = new CurrencyData();
document.querySelector("#date").setAttribute("max", today);


const wait_window = document.querySelector('.currency_convertor .wait');

async function handleDateChange(value) {//реакція на зміну дати
    let date = new Date(value);

    let input = document.querySelector("#input_curr");
    let output = document.querySelector("#output_curr");
    
    if (date.getFullYear() > 2000) {
        wait_window.style.display = "flex";
        input.placeholder = "Зачекайте...";
        input.disabled = true;
        output.placeholder = "Зачекайте...";

        await currencyData.fetchCurrencyDataByDate(date).then(() => {
            currencyData.fillDocumentSelect("#input_curr_s");
            currencyData.fillDocumentSelect("#output_curr_s");

            //Трошки вигляду
            input.placeholder = "";
            input.disabled = false;
            output.placeholder = "";
            wait_window.style.display= "none";
            document.querySelectorAll("select").forEach(e => e.disabled = false);}
        );
    }
}
document.querySelectorAll(".currency_convertor select").forEach(
    e => e.onchange = function handleCurrencySelectChange() {
    handleCurrencyValueChange(document.querySelector("#input_curr").value);
});


function handleCurrencyValueChange(value) {
    //рахуємо курс
    let output = document.querySelector("#output_curr");
    let inputCurrSelectedValue = document.querySelector("#input_curr_s").value;
    let outputCurrSelectedValue = document.querySelector("#output_curr_s").value;
    let buySaleToggle = document.querySelector("#currency_move").value;

    let inputPriceByUAH, outputPriceByUAH;

    if (buySaleToggle == "sell") {
        inputPriceByUAH = currencyData.getPurchaseByUAH(inputCurrSelectedValue);
        outputPriceByUAH = currencyData.getSaleByUAH(outputCurrSelectedValue);
    }
    if (buySaleToggle == "buy") {
        inputPriceByUAH = currencyData.getPurchaseByUAH(inputCurrSelectedValue);
        outputPriceByUAH = currencyData.getSaleByUAH(outputCurrSelectedValue);
    }
    output.value = inputPriceByUAH / outputPriceByUAH * value;

}

function swapCurrencyButton() {
    const input = document.querySelector("#input_curr_s");
    const output = document.querySelector("#output_curr_s");
    [input.value, output.value] = [output.value, input.value];
    handleCurrencyValueChange(document.querySelector("#input_curr").value);
}
//by default
handleDateChange(today).then(() => {
    document.querySelector('#date').value = today;
    document.querySelector('#input_curr_s').value = 'USD';
    document.querySelector('#output_curr_s').value = 'UAH';
    document.querySelector('#input_curr').value = 1;
    document.querySelector("#currency_move").value = 'buy';
    handleCurrencyValueChange(1)
});
