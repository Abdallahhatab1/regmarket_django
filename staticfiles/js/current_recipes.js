
let items_tbody = document.querySelector('.items_tbody')
let search_input = document.getElementById('search_input')


let pathParts = window.location.pathname.split('/');
let currentId = +pathParts[pathParts.length - 2];

let allReceiptsData = [];
let groupedReceipts = [];

let currency_value = 1;
let current_symbol = '$';
let allCurrencyData = [];
let currencyModeData;

// --- دالة جلب البيانات من API ---
async function receipts_api() {
    let response = await fetch('/regmarket/api/receipts/');
    allReceiptsData = await response.json();
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
    await currency_api();
    await currency_mode_api();

    const receipts = allReceiptsData.receipts;
    if(receipts.length == 0) {window.location.href = '/regmarket/receipts_history/'}

    // أولاً نجمع حسب التاريخ
    const groupedByDate = {};

    receipts.forEach(r => {
        const dateOnly = r.date.split(' ')[0]; // نأخذ فقط اليوم بدون الوقت
        if (!groupedByDate[dateOnly]) {
            groupedByDate[dateOnly] = [];
        }
        groupedByDate[dateOnly].push(r);
        
    });

    // نحول الكائن إلى قائمة منظمة (ليست)
    groupedReceipts = Object.keys(groupedByDate)
        .sort()
        .map((date, index) => ({
            date: date,
            receipts: groupedByDate[date],
            count: groupedByDate[date].length,
            dayIndex: index
        }));


        if(currencyModeData.value == 'other') {
            currency_value = allCurrencyData.current_currency[0].value_per_usd;
            current_symbol = allCurrencyData.current_currency[0].symbol;
        }

        show_receipts()
});


function show_receipts() {
    items_tbody.innerHTML = ``
    let totals_price = get_total_price()
    for(let i = 0; i < groupedReceipts[currentId].receipts.length; i++) {

        let dateStr = groupedReceipts[currentId].receipts[i].date;
        let date = new Date(dateStr);

        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let  ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        let formattedTime = `${hours}:${minutes} ${ampm}`;

        let customer_first_name = groupedReceipts[currentId].receipts[i].customer.first_name
        let customer_last_name = groupedReceipts[currentId].receipts[i].customer.last_name

        items_tbody.innerHTML += `
        <tr class='tbody_tr'>
            <td onclick='receipt_day(${i})' id='${i}'>${i}</td>
            <td onclick='receipt_day(${i})'>${formattedTime}</td>
            <td onclick='receipt_day(${i})'>${customer_first_name} ${customer_last_name}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((totals_price[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td><button class='button' onclick='delete_receipts(${i})'>delete</button></td>
        </tr>
        
        `
    }
}


function get_total_price() {
    let count = 0
    let totals_arr = []

        for(let i = 0; i < groupedReceipts[currentId].receipts.length; i++) {
            for(let a = 0; a < groupedReceipts[currentId].receipts[i].items.length; a++) {
                count += +groupedReceipts[currentId].receipts[i].items[a].price
        }   
        totals_arr.push(count)
        count = 0
    }
    return totals_arr
}

// delete
function delete_receipts(index) {
    let receiptsId = groupedReceipts[currentId].receipts[index].id;
    window.location.href = `/regmarket/current_receipts/${groupedReceipts[currentId].dayIndex}/delete/${receiptsId}/`;
}

function receipt_day(index) {
    let receiptsId = groupedReceipts[currentId].receipts[index].id;
    window.location.href = `/regmarket/see_receipt/${currentId}/${receiptsId}/`
}