/*
let items_tbody_bottom = document.getElementById('items_tbody_bottom')
let items_tbody_top = document.getElementById('items_tbody_top')

let all_recipes = JSON.parse(localStorage.getItem('all_recipes'))
let set_sections = JSON.parse(localStorage.getItem('set_sections'))
let current_recipes_delete_count = localStorage.getItem('current_recipes_delete_count')


let all_recipes_arr = []

for(let key in all_recipes)
{
    all_recipes_arr.push(all_recipes[key])
}

current_currency_mode = localStorage.getItem('current_currency_mode')
currency_per_dollar = JSON.parse(localStorage.getItem('currency_per_dollar'))

let currency_value = 1
let current_symbol = '$'

if(current_currency_mode == 'other')
{
    currency_value = currency_per_dollar.currency_value_per_usd
    current_symbol = currency_per_dollar.currency_symbol
}



// للاقسام
let total_sections = set_sections.length

let total_section_products = 0
for(let i = 0; i < set_sections.length; i++)
{
    total_section_products += +JSON.parse(localStorage.getItem(`set_products${i}`)).length
}

function getProductsSectionTotals(type)
{
    let products_sum = 0
    for(let i = 0; i < set_sections.length; i++)
    {
        for(let a = 0; a < +JSON.parse(localStorage.getItem(`set_products${i}`)).length; a++)
        {
            let set_products = JSON.parse(localStorage.getItem(`set_products${i}`))
            products_sum += +set_products[a][type]
        }

    }
    return products_sum
}

let total_products_buy = `${current_symbol}${parseFloat((getProductsSectionTotals('item_buy') * currency_value).toFixed(2)).toLocaleString()}`;
let total_products_sell = `${current_symbol}${parseFloat((getProductsSectionTotals('item_sell') * currency_value).toFixed(2)).toLocaleString()}`;
let total_products_tax = `${current_symbol}${parseFloat((getProductsSectionTotals('item_taxes') * currency_value).toFixed(2)).toLocaleString()}`;
let total_products_count = getProductsSectionTotals('item_count');
let total_products_price_sum = `${current_symbol}${parseFloat((getProductsSectionTotals('item_buy') * total_products_count).toFixed(2)).toLocaleString()}`
// ==========================


// لسجل الفواتير
let total_working_days = all_recipes_arr.length

let total_receipts = 0
for(let i = 0; i < all_recipes_arr.length; i++)
{
    total_receipts += Object.values(all_recipes_arr[i]).length
}
total_receipts = total_receipts - current_recipes_delete_count


let total_products_sold = 0
for(let i = 0; i < Object.values(all_recipes_arr).length; i++)
{
    for(let a = 0; a < Object.values(all_recipes_arr[i]).length; a++)
    {
        total_products_sold += Object.values(all_recipes_arr[i][a])[0].length
    }
}

function getProductsReceiptTotals(type)
{
    let sum_of_receipts_total = 0
    for(let i = 0; i < Object.values(all_recipes_arr).length; i++)
    {
        for(let a = 0; a < Object.values(all_recipes_arr[i]).length; a++)
        {
            for(let b = 0; b < Object.values(all_recipes_arr[i][a])[0].length; b++)
            {
                sum_of_receipts_total += +Object.values(all_recipes_arr[i][a])[0][b][type] 
            }  
        }
    }
    return sum_of_receipts_total
}

function getProductsCountTotals(type)
{
    let sum_of_receipts_total = 0
    for(let i = 0; i < Object.values(all_recipes_arr).length; i++)
    {
        for(let a = 0; a < Object.values(all_recipes_arr[i]).length; a++)
        {
            for(let b = 0; b < Object.values(all_recipes_arr[i][a])[0].length; b++)
            {
                if(Object.values(all_recipes_arr[i][a])[0][b][type] == "")
                {
                    sum_of_receipts_total += 1
                }
                else
                {
                    sum_of_receipts_total += +Object.values(all_recipes_arr[i][a])[0][b][type]
                }

            }  
        }
    }
    return sum_of_receipts_total
}

let total_price_of_products_sold = `${current_symbol}${parseFloat((getProductsReceiptTotals('product_price') * currency_value).toFixed(2)).toLocaleString()}`;
let total_tax_of_products_sold = `${current_symbol}${parseFloat((getProductsReceiptTotals('product_taxes') * currency_value).toFixed(2)).toLocaleString()}`;
let total_discount_of_products_sold = `${current_symbol}${parseFloat((getProductsReceiptTotals('product_discount') * currency_value).toFixed(2)).toLocaleString()}`;
let total_count_of_products_sold = getProductsCountTotals('product_count');
let total_entries = `${current_symbol}${parseFloat((((+getProductsReceiptTotals('product_price') + +getProductsReceiptTotals('product_taxes')) - +getProductsReceiptTotals('product_discount')).toFixed(2)) * total_count_of_products_sold).toLocaleString()}`; 
// ==========================


let titles_arr_button = [
    'products price average per day',
    'products tax average per day',
    'products discount average per day',
    'products total average per day',
]

let titles_sections_arr = [
    {name: 'total sections', value: total_sections},
    {name: 'total section products', value: total_section_products},
    {name: 'total products buy', value: total_products_buy},
    {name: 'total products sell', value: total_products_sell},
    {name: 'total products tax', value: total_products_tax},
    {name: 'total products count', value: total_products_count},
    {name: 'total products price-sum', value: total_products_price_sum},
]

let titles_receipts_arr = [
    {name: 'total working days', value: total_working_days},
    {name: 'total receipts', value: total_receipts},
    {name: 'total products sold', value: total_products_sold},
    {name: 'total price of products sold', value: total_price_of_products_sold},
    {name: 'total tax of products sold', value: total_tax_of_products_sold},
    {name: 'total discount of products sold', value: total_discount_of_products_sold},
    {name: 'total count of products sold', value: total_count_of_products_sold},
    {name: 'total entries', value: total_entries},
]



window.onload = function()
{
    show_tables()
}


function show_tables()
{
    items_tbody_top.innerHTML += `
    <tr id='space_re_se'>
        <td colspan='2'>Averges</td>
    </tr> `
    for(let i = 0; i < titles_arr_button.length; i++)
    {
        items_tbody_top.innerHTML += `

        <tr class='tbody_tr' id='${i}' onclick='goTo(this)'>
            <td>${titles_arr_button[i]}</td>
            <td>Enter</td>
        </tr>

        `
    }


    items_tbody_bottom.innerHTML += `
    <tr id='space_re_se'>
        <td colspan='2'>Sections</td>
    </tr> `
    for(let i = 0; i < titles_sections_arr.length; i++)
    {
        items_tbody_bottom.innerHTML += `

        <tr>
            <td>${titles_sections_arr[i].name}</td>
            <td>${titles_sections_arr[i].value}</td>
        </tr>

        `
    }


    items_tbody_bottom.innerHTML += `
    <tr id='space_re_se''>
        <td colspan='2'>Receipts</td>
    </tr> `
    for(let i = 0; i < titles_receipts_arr.length; i++)
    {
        items_tbody_bottom.innerHTML += `

        <tr>
            <td>${titles_receipts_arr[i].name}</td>
            <td>${titles_receipts_arr[i].value}</td>
        </tr>

        `
    }


}

function goTo(element)
{
    localStorage.setItem('current_statisitics_page', Number(element.id))
    window.location.href = 'averges.html'
}
*/

let items_tbody_bottom = document.getElementById('items_tbody_bottom')
let items_tbody_top = document.getElementById('items_tbody_top')

// local variables


let allReceiptsData = [];
let allSectionsData = [];
let allProductsData = [];
let groupedReceipts;

let allCurrencyData = [];
let currencyModeData;
let currency_value = 1;
let current_symbol = '$';



async function receipts_api() {
    let response = await fetch('/regmarket/api/receipts/');
    allReceiptsData = await response.json();
}

async function sections_api() {
    let response = await fetch('/regmarket/api/sections/');
    allSectionsData = await response.json();
}

async function products_api() {
    let response = await fetch('/regmarket/api/products/');
    allProductsData = await response.json();
}

async function currency_api() {
    let response = await fetch('/regmarket/api/currency/');
    allCurrencyData = await response.json();
}
async function currency_mode_api() {
    let response = await fetch('/regmarket/api/currency_mode/');
    currencyModeData = await response.json();
}


document.addEventListener('DOMContentLoaded', async function() {
    await receipts_api();
    await sections_api();
    await products_api();
    await currency_api();
    await currency_mode_api();


    const receipts = allReceiptsData.receipts;

    // أولاً نجمع حسب التاريخ
    const groupedByDate = {};

    receipts.forEach(r => {
        const dateOnly = r.date.split(' ')[0];
        if (!groupedByDate[dateOnly]) {
            groupedByDate[dateOnly] = [];
        }
        groupedByDate[dateOnly].push(r);
    });


    groupedReceipts = Object.keys(groupedByDate)
        .sort()
        .map(date => ({
            date: date,
            receipts: groupedByDate[date],
            count: groupedByDate[date].length
        }));

    if(currencyModeData.value == 'other') {
        currency_value = allCurrencyData.current_currency[0].value_per_usd;
        current_symbol = allCurrencyData.current_currency[0].symbol;
    }

    show_items()



});

function show_items() {
    show_tables()
    getTotalReceipts()
   
}

function getTotalProducts(type) {
    let count = 0
    for(let i = 0; i < allProductsData.length; i++) {
        let toCount = +allProductsData[i]['product_count']
        if(type == 'product_count' || type == 'product_total') {toCount = 1}
        
        count += +allProductsData[i][type] * toCount
    }
    return count
}

function getTotalReceipts(type) {
    
    let Receiptsum = 0
    for(let i = 0; i < allReceiptsData.receipts.length; i++) {
        for(let a = 0; a < allReceiptsData.receipts[i].items.length; a++) {
            let ReceiptCount = +allReceiptsData.receipts[i].items[a]['count']
            if(type == 'total' || type == 'count') {ReceiptCount = 1}
            Receiptsum += +allReceiptsData.receipts[i].items[a][type] * +ReceiptCount
        }
    }
    return Receiptsum
}
function getTotalUniqueReceipts() {
    
    let Receiptsum = 0
    for(let i = 0; i < allReceiptsData.receipts.length; i++) {
        for(let a = 0; a < allReceiptsData.receipts[i].items.length; a++) {
            Receiptsum += 1
        }
    }
    return Receiptsum
}


function show_tables()
{
    let titles_arr_button = [
        'products price average per day',
        'products tax average per day',
        'products discount average per day',
        'products total average per day',
    ]

    let titles_sections_arr = [
        {name: 'total sections', value: allSectionsData.length},
        {name: 'total section products', value: allProductsData.length},
        {name: 'total products buy', value: `${current_symbol}${parseFloat((+getTotalProducts('product_buy') * currency_value).toFixed(2)).toLocaleString()}`},
        {name: 'total products sell', value: `${current_symbol}${parseFloat((+getTotalProducts('product_sell') * currency_value).toFixed(2)).toLocaleString()}`},
        {name: 'total products tax', value: `${current_symbol}${parseFloat((+getTotalProducts('product_tax') * currency_value).toFixed(2)).toLocaleString()}`},
        {name: 'total products count', value: +getTotalProducts('product_count')},
        {name: 'total products price-sum', value: `${current_symbol}${parseFloat((+getTotalProducts('product_total') * currency_value).toFixed(2)).toLocaleString()}`},
    ]

    let titles_receipts_arr = [
        {name: 'total working days', value: groupedReceipts.length},
        {name: 'total receipts', value: allReceiptsData.receipts.length},
        {name: 'total unique products sold', value: getTotalUniqueReceipts()},
        {name: 'total price of products sold', value: `${current_symbol}${parseFloat((+getTotalReceipts('price') * currency_value).toFixed(2)).toLocaleString()}`},
        {name: 'total tax of products sold', value: `${current_symbol}${parseFloat((+getTotalReceipts('tax') * currency_value).toFixed(2)).toLocaleString()}`},
        {name: 'total discount of products sold', value: `${current_symbol}${parseFloat((+getTotalReceipts('discount') * currency_value).toFixed(2)).toLocaleString()}`},
        {name: 'total count of products sold', value: getTotalReceipts('count')},
        {name: 'total entries', value: `${current_symbol}${parseFloat((+getTotalReceipts('total') * currency_value).toFixed(2)).toLocaleString()}`},
    ]

    
    items_tbody_top.innerHTML += `
    <tr id='space_re_se'>
        <td colspan='2'>Averges</td>
    </tr> `
    for(let i = 0; i < titles_arr_button.length; i++)
    {
        items_tbody_top.innerHTML += `

        <tr class='tbody_tr' id='${i}' onclick='goTo(this)'>
            <td>${titles_arr_button[i]}</td>
            <td>Enter</td>
        </tr>

        `
    }


    items_tbody_bottom.innerHTML += `
    <tr id='space_re_se'>
        <td colspan='2'>Sections</td>
    </tr> `
    for(let i = 0; i < titles_sections_arr.length; i++)
    {
        items_tbody_bottom.innerHTML += `

        <tr>
            <td>${titles_sections_arr[i].name}</td>
            <td>${titles_sections_arr[i].value}</td>
        </tr>

        `
    }


    items_tbody_bottom.innerHTML += `
    <tr id='space_re_se''>
        <td colspan='2'>Receipts</td>
    </tr> `
    for(let i = 0; i < titles_receipts_arr.length; i++)
    {
        items_tbody_bottom.innerHTML += `

        <tr>
            <td>${titles_receipts_arr[i].name}</td>
            <td>${titles_receipts_arr[i].value}</td>
        </tr>

        `
    }
}

function goTo(element) {
    id = +element.id
    window.location.href = `/regmarket/statisitics/averges/${id}`

}
