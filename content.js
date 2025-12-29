async function loadData() {
    const apiKey = await fetch(chrome.runtime.getURL("api.key")).then(
        (response) => response.text()
    );

    const config = await fetch(chrome.runtime.getURL("config.json")).then(
        (response) => response.json()
    );

    const currencies = await fetch(chrome.runtime.getURL("currencies.json")).then(
        (response) => response.json()
    );

    init(apiKey, config, currencies);
}

async function init(apiKey, config, currencies) {
    // Create the popup element
    const popup = document.createElement("div");
    popup.className = "currconv-popup";
    popup.dataset.result = "succcess";
    popup.dataset.show = false;

    const loader = document.createElement("div");
    loader.className = "currconv-loader";
    loader.dataset.show = false;
    popup.appendChild(loader);

    const popupMessage = document.createElement("div");
    popupMessage.className = "currconv-popup-message";
    popupMessage.style.fontSize = config.fontSize.message + "pt";
    popup.appendChild(popupMessage);
    document.body.appendChild(popup);
    
    const popupCurrencies = document.createElement("div");
    popupCurrencies.className = "currconv-popup-currencies";
    popupCurrencies.style.fontSize = config.fontSize.currencies + "pt";
    popup.appendChild(popupCurrencies);
    
    const popupUpdated = document.createElement("div");
    popupUpdated.className = "currconv-popup-updated";
    popupUpdated.style.fontSize = config.fontSize.ratesUpdated + "pt";
    popup.appendChild(popupUpdated);
    popupUpdated.style.display = config.displayModule.ratesUpdated ? "block" : "none";

    const popupUsage = document.createElement("div");
    popupUsage.className = "currconv-popup-updated";
    popupUsage.style.fontSize = config.fontSize.usage + "pt";
    popup.appendChild(popupUsage);
    popupUsage.style.display = config.displayModule.usage ? "block" : "none";


    // Display the popup after the user selected something and released the mouse button
    document.addEventListener("mouseup", async () => {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText.length == 0 || !selection.rangeCount) {
            popup.dataset.show = false;
            return;
        }

        popupCurrencies.innerHTML = "";
        popupUpdated.innerHTML = "";
        
        const codes = [...new Set(Object.values(currencies).flat())];
        const symbols = [...Object.keys(currencies)];
        const regexpCodes = codes.map((currency) => RegExp.escape(currency)).join("|");
        const regexpSymbols = symbols.map((currency) => RegExp.escape(currency)).join("|");

        const pattern = RegExp(
            `(?<value>\\d+)\\s*(?<currency>${regexpCodes}|${regexpSymbols})|(?<currency>${regexpCodes}|${regexpSymbols})\\s*(?<value>\\d+)(?!\\s*(${regexpCodes}|${regexpSymbols}))`,
            "i"
        );
        
        const matches = selectedText.match(pattern);
        if (!matches?.groups?.currency || !matches?.groups?.value)
            return;

        const currencySymbol = (matches.groups.currency).toUpperCase();
        const fromCurrency = Object.keys(currencies).includes(currencySymbol)
            ? [currencies[currencySymbol]].flat()
            : [currencySymbol].flat();
        const fromValue = parseInt(matches.groups.value);

        if (!fromCurrency || !fromValue) return;
        
        let errorMessage = "";
        let conversionRates = null;
        let usage = null;
        if (!chrome.runtime?.id) {
            errorMessage = "Please reload the page.";
        } else {
            await (async () => {
                const stored = await chrome.storage.local.get(["conversionRates"]);
                conversionRates = stored.conversionRates;
                
                // The number of hours since the data was last updated
                const passedHours = (new Date() - conversionRates.timestamp * 1000) / 1000 / 60 / 60;
                const fetchRates = !conversionRates || passedHours > config.updateFrequencyHours;

                let usageJson = null;
                if (fetchRates || config.displayModule.usage) {
                    const usageResponse = await fetch(`https://openexchangerates.org/api/usage.json?app_id=${apiKey}`);
                    usageJson = await usageResponse.json();
                    if (usageJson.error) {
                        handleError(usageJson.message, usageJson);
                        return;
                    }
    
                    usage = usageJson.data.usage;
                    console.log("Usage:", usage)
                }

                if (fetchRates) {
                    console.log("CurrConv: Fetching rates");

                    if (usageJson.data.status == "access_restricted" || usageJson.data.usage.requests_remaining == 0) {
                        console.warn(`CurrConv warning: You hit the API access limit. Your quota will reset in ${usageJson.data.usage.days_remaining} days.`);
                        errorMessage = `You hit the API access limit.<br>Your quota will reset in ${usageJson.data.usage.days_remaining} days.`;
                    }

                    loader.dataset.show = true;
                    popupMessage.innerHTML = "Fetching latest rates...";
                    showPopup(selection);
                    
                    const latestResponse = await fetch(
                        `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${codes.join(",")}`
                    )
                    const latestJson = await latestResponse.json();
                    if (latestJson.error) {
                        handleError(latestJson.message, latestJson);
                        return;
                    }
                    console.log("Conversion rates:", latestJson);
                    conversionRates = latestJson;
                    chrome.storage.local.set({ conversionRates: latestJson });
                }

                function handleError(errorCode, response) {
                    switch(errorCode) {
                        case "invalid_app_id":
                            errorMessage = "Invalid API key";
                            console.error(`CurrConv error: Invalid API key. Sign up at https://openexchangerates.org/signup and copy the API key to api.key.`);
                            break;
                        case "missing_app_id":
                            errorMessage = "Missing API key";
                            console.error(`CurrConv error: Missing API key. Sign up at https://openexchangerates.org/signup and copy the API key to api.key.`);
                            break;
                        case "access_restricted":
                            errorMessage = "You hit the access limit";
                            console.error(`CurrConv error: Access restricted. You most likely ran out of your quota. Check the API usage on https://openexchangerates.org/account/usage.`);
                            break;
                        case "not_allowed":
                            errorMessage = "You hit the access limit";
                            console.error(`CurrConv error: Access restricted. You most likely ran out of your quota. Check the API usage on https://openexchangerates.org/account/usage.`);
                            break;
                    }
                    console.error(`CurrConv error: ${response.message} (${response.status}) - ${response.description}`);
                }
            })();
        }

        loader.dataset.show = false;
        popupMessage.innerHTML = errorMessage;

        if (!conversionRates) {
            popup.dataset.result = "error";
            popupMessage.innerHTML = errorMessage || "Something went wrong.<br>Check the devtools console for more info.";
        } else if (errorMessage) {
            popup.dataset.result = "warning";
        } else {
            popup.dataset.result = "success";
        }

        if (conversionRates) {
            let html = "";
            for (const currency of fromCurrency.slice(0, config.maxCurrencies || Infinity)) {
                const valueInUSD = (1 / conversionRates.rates[currency]) * fromValue;
                const valueInTarget = valueInUSD * conversionRates.rates[config.convertTo];
                const convertedValue = valueInTarget.toFixed(config.decimals);

                html += `
                    <div class="currconv-currency-from-value">${fromValue}</div>
                    <div class="currconv-currency-from-currency">${currency}</div>
                    <div class="currconv-currency-equals">=</div>
                    <div class="currconv-currency-to-value">${convertedValue}</div>
                    <div class="currconv-currency-to-currency">${config.convertTo}</div>
                `;
            }
            popupCurrencies.innerHTML = html;

            popupUpdated.innerHTML = new Date(conversionRates.timestamp * 1000).toLocaleString("hu-HU");
        }

        if (usage) {
            popupUsage.innerHTML = `${usage.requests_remaining} requests left.`;
        }

        popup.dataset.show = true;
        showPopup(selection);

        function showPopup(selection) {
            if (!selection.rangeCount) return;

            const rect = selection.getRangeAt(0).getBoundingClientRect();
            
            popup.dataset.show = true;
            if (rect.left + window.scrollX + popup.offsetWidth < window.innerWidth) {
                popup.style.left = `${rect.left + window.scrollX}px`;
            } else {
                popup.style.left = `${rect.right + window.scrollX - popup.offsetWidth}px`;
            }
            if (rect.top + window.scrollY - popup.offsetHeight - 5 > 0) {
                popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight - 5}px`;
            } else {
                popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
            }
        }
    });

    document.addEventListener("mousedown", (e) => {
        if (e.target !== popup) {
            popup.dataset.show = false;
        }
    });
}

loadData();
