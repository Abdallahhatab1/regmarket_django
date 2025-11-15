let items_tbody = document.querySelector('.items_tbody')

let delete_all_button = document.querySelector('.delete_all')

let search_input = document.getElementById('search_input')


// --- متغيرات عامة ---
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
        .sort() // ترتيب الأيام تصاعديًا
        .map(date => ({
            date: date,
            receipts: groupedByDate[date],
            count: groupedByDate[date].length // عدد الإيصالات في هذا اليوم
        }));

        if(currencyModeData.value == 'other') {
            currency_value = allCurrencyData.current_currency[0].value_per_usd;
            current_symbol = allCurrencyData.current_currency[0].symbol;
        }

        show_receipts()
});


function show_receipts() {
    let totals_price = get_totals('price')
    let totals_tax = get_totals('tax')
    let totals_discount = get_totals('discount')
    

    items_tbody.innerHTML = ``
    for(let i = 0; i < groupedReceipts.length; i++) {

        let total = (totals_price[i] + totals_tax[i]) - totals_discount[i]
        items_tbody.innerHTML += `
        <tr class='tbody_tr'>
            <td onclick='receipt_day(${i})' id='${i}'>${i}</td>
            <td onclick='receipt_day(${i})'>${groupedReceipts[i].date}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+totals_price[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+totals_tax[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+totals_discount[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+total * currency_value).toFixed(2)).toLocaleString()}</td>
            <td><button class='button' onclick='delete_receipts(${i})'>delete</button></td>
        </tr>
        `
    }
    delete_all_button.innerHTML = `delete all (${groupedReceipts.length})`
    
}

function get_totals(type) {
    let totals_arr = []
    let count = 0;
    for(let i = 0; i < groupedReceipts.length; i++) {
        for(let a = 0; a < groupedReceipts[i].count; a++) {
            for(let b = 0; b < groupedReceipts[i].receipts[a].items.length; b++)
            {
                count += +groupedReceipts[i].receipts[a].items[b][type]
            }
        }
        totals_arr.push(count)
        count = 0;
    }
    return totals_arr
}


// delete
function delete_receipts(id) {
    window.location.href = `/regmarket/receipts_history_delete_day/${groupedReceipts[id].date}`
}


// delete all
let blur_screen = document.querySelector('.blur_screen');
let sure_delete = document.querySelector('.sure_delete');
let sure_yes = document.getElementById('sure_yes');
let sure_no = document.getElementById('sure_no');

function sure_choise_yes() {
    blur_screen.style.display = 'none'
    sure_delete.style.display = 'none'
    sure_delete_all()
}
function sure_choise_no() {
    blur_screen.style.display = 'none'
    sure_delete.style.display = 'none'
}
function delete_all() {
    if(groupedReceipts.length >= 1) {
        blur_screen.style.display = 'block'
        sure_delete.style.display = 'block'
    }
}
function sure_delete_all() {
    window.location.href = `/regmarket/receipts_history/delete_all/`
}


// search
function getSearch() {
    let totals_price = get_totals('price')
    let totals_tax = get_totals('tax')
    let totals_discount = get_totals('discount')


    items_tbody.innerHTML = ``
    for(let i = 0; i < groupedReceipts.length; i++)
    {
        let total = (totals_price[i] + totals_tax[i]) - totals_discount[i]
        if(groupedReceipts[i].date.includes(search_input.value) || total.toString().includes(search_input.value)) {

        items_tbody.innerHTML += `
        <tr class='tbody_tr'>
            <td id='${i}'>${i}</td>
            <td onclick='receipt_day(${i})'>${groupedReceipts[i].date}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+totals_price[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+totals_tax[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+totals_discount[i] * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='receipt_day(${i})'>${current_symbol}${parseFloat((+total * currency_value).toFixed(2)).toLocaleString()}</td>
            <td><button class='button' onclick='delete_receipts(${i})'>delete</button></td>
        </tr>
        `
        }
    }
}

function receipt_day(id) {
    window.location.href = `/regmarket/current_receipts/${id}/`
}