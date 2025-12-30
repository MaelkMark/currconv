<div style="text-align: center;">
    <img src="icons/icon128.png" />
    <h1>The CurrConv Chrome Extension</h1>
    <p>v1.0.0</p>
</div>
CurrConv is a local open-source Chrome extension for currency conversion. Select a foreign currency on any webpage and the extension will convert it to your preferred currency.

The currencies are converted with the [Open Exchange Rates](https://openexchangerates.org/) API, therefore the extension requires an API key (free).

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Installation \& Setup](#installation--setup)
  - [Download](#download)
  - [Get an API Key](#get-an-api-key)
  - [Install the extension in Chrome.](#install-the-extension-in-chrome)
- [Updating the extension](#updating-the-extension)
- [Configuration](#configuration)
  - [Settings (`config.json`)](#settings-configjson)
  - [Currencies (`currencies.json`)](#currencies-currenciesjson)
  - [Applying Changes](#applying-changes)


## Installation & Setup

### Download

```
git clone https://github.com/MaelkMark/currconv.git
```

or simply download as ZIP (Code > Download ZIP) and unzip the folder.

### Get an API Key

The extension requires an App ID from [Open Exchange Rates](https://openexchangerates.org/).

1. [Get a free App ID](https://openexchangerates.org/signup/free) from Open Exchange Rates.
2. Create a file named `api.key` in the extension folder.
3. Paste your App ID into the `api.key` file.

**Don't write anything else in that file.** Your code should look similar to this:

`a02cabaf4e85d42fa5fe6de4df3c7b6e` *(this is just an example, not a valid App ID)*

With a free [plan](https://openexchangerates.org/signup), you can send up to **1000 requests per month**, and update the conversion rates every hour.
This means that if you set `updateFrequencyHours` in `config.json` to 2 or higher, **you will never run out of requests**.

### Install the extension in Chrome.
1. Open the chrome extensions page:
   - Enter `chrome://extensions/` in the address bar
   - or click the Extensions menu button (puzzle icon) and select Manage Extensions
   - or click the three dots in the top right corner and select Extensions > Manage extensions

2. Enable the Developer Mode by turning on the Developer Mode checkbox in the top right corner.
3. Click the "Load unpacked" button and select the folder that you downloaded.

Now the extension is installed. You may have to **reload the webpages** in order to use it.

## Updating the extension

If you downloaded the extension with Git, you just have to pull the latest changes.

```
git pull
```

If you didn't, you have to download it as ZIP again and overwrite the files manually.

After you updated the files, open the chrome extensions page and click on the refresh button (next to the on/off toggle of the extension). Before you can use the extension you have to **reload the webpages**.

## Configuration
### Settings (`config.json`)
You can customize the extension by editing the `config.json` file in the extension folder.

```json
{
    "convertTo": "HUF",
    "updateFrequencyHours": 6,
    "decimals": 0,
    "maxCurrencies": null,
    "dateFormat": "hu-HU",
    "displayModule": {
        "ratesUpdated": true,
        "usage": false
    },
    "fontSize": {
        "message": 11,
        "currencies": 11,
        "ratesUpdated": 9,
        "usage": 9
    }
}
```

| Key                    | Type        | Description                                                                                          |
| :--------------------- | :---------- | :--------------------------------------------------------------------------------------------------- |
| `convertTo`            | String      | The 3-letter currency code to convert to (e.g., "USD", "EUR", "HUF").                                |
| `updateFrequencyHours` | Number      | How often (in hours) to fetch new exchange rates. If ≥ 2, you will never run out of free API calls.  |
| `decimals`             | Number      | Number of decimal places to display in the result.                                                   |
| `maxCurrencies`        | Number/null | Limit the number of source currencies displayed if a symbol matches multiple. `null` means no limit. |
| `dateFormat`           | String      | The (BCP 47) locale format for the "Updated at" date (e.g., "en-US", "hu-HU").                       |
| `displayModule`        | Boolean     | Toggle visibility of UI elements (`ratesUpdated`, `usage`).                                          |
| `fontSize`             | Number      | Font sizes (in pt) for different UI parts (`message`, `currencies`, `ratesUpdated`, `usage`).        |

### Currencies (`currencies.json`)
This file maps currency symbols to their corresponding 3-letter ISO codes.

- **Key**: The currency symbol (e.g., `$`, `€`, `kr`, `Ft`).
- **Value**: A single string code (e.g., `"EUR"`) or an array of codes (e.g., `["USD", "CAD", "AUD"]`) if the symbol is used by multiple currencies.

If a selected symbol maps to multiple currencies, the extension will attempt to show conversions for all of them, up to the `maxCurrencies` limit in `config.json`.

### Applying Changes
After changing the `config.json`, `currencies.json`, or `api.key` files, reload the web pages where you want to use the converter.