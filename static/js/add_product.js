/*
let name_input = document.getElementById('name_input')
let buy_input = document.getElementById('buy_input')
let sell_input = document.getElementById('sell_input')
let taxes_input = document.getElementById('taxes_input')
let category_input = document.getElementById('category_input')
let count_input = document.getElementById('count_input')

let total_button = document.querySelector('.total_button')
let items_tbody = document.querySelector('.items_tbody')
let submit_button = document.getElementById('submit_button')
let delete_button = document.getElementById('delete_button')

let blur_screen = document.querySelector('.blur_screen')
let sure_delete = document.querySelector('.sure_delete')


current_currency_mode = localStorage.getItem('current_currency_mode')
currency_per_dollar = JSON.parse(localStorage.getItem('currency_per_dollar'))

let currency_value = 1
let current_symbol = '$'

if(current_currency_mode == 'other')
{
    currency_value = currency_per_dollar.currency_value_per_usd
    current_symbol = currency_per_dollar.currency_symbol 
}


let sections_arr = []

let local_section_data = JSON.parse(localStorage.getItem('set_sections'))

let current_index = localStorage.getItem('current_section_index')
let total_products = JSON.parse(localStorage.getItem(`set_products${current_index}`))

let mode = 'add'
let current_update_index = null


window.onload = function()
{
    let stored = localStorage.getItem(`set_products${current_index}`);
    if (stored) {
        sections_arr = JSON.parse(stored);
        renderSections();
    }
};


function renderSections() 
{

    items_tbody.innerHTML = ``;

    for(let i = 0; i < sections_arr.length; i++)
    {
        items_tbody.innerHTML += `
            <tr id="${i}">
                <td class="section_id">${i}</td>
                <td class="section_name">${sections_arr[i].item_name || '-'}</td>
                <td class="section_buy">${current_symbol}${parseFloat((sections_arr[i].item_buy * currency_value).toFixed(2)).toLocaleString() || 0}</td>
                <td class="section_sell">${current_symbol}${parseFloat((sections_arr[i].item_sell * currency_value).toFixed(2)).toLocaleString() || 0}</td>
                <td class="section_taxes">${current_symbol}${parseFloat((sections_arr[i].item_taxes * currency_value).toFixed(2)).toLocaleString() || 0}</td>
                <td class="section_category">${sections_arr[i].item_category || '-'}</td>
                <td id="section_count">${sections_arr[i].item_count || 0}</td>
                <td id="section_total">${current_symbol}${parseFloat((sections_arr[i].item_total * currency_value).toFixed(2)).toLocaleString() || 0}</td>
                <td id="local_id">${String(current_index)+String(i) || 0}</td>
                <td><button onclick="update_pro(this)" class="update">update</button></td>
                <td><button onclick="delete_pro(this)" class="delete">delete</button></td>
             </tr>
        `;

        sections_arr[i].item_local_id = String(current_index) + String(i);

    }
    delete_button.innerHTML = `Delete all (${sections_arr.length})`
    localStorage.setItem(`set_products${current_index}`, JSON.stringify(sections_arr))

};

function update_total()
{
    if(sell_input.value != '')
    {
        total_button.innerHTML = `total: ${+sell_input.value * +count_input.value}`
        total_button.style.background = '#080'
    }
    else
    {
        total_button.innerHTML = `total:`
        total_button.style.background = '#800'
    }
}

function add_item()
{
    if(mode == 'add')
    {

        submit_button.innerText = 'Add'

        let sections_dic = {
            item_name: name_input.value,
            item_buy: buy_input.value || 0,
            item_sell: sell_input.value || 0,
            item_taxes: taxes_input.value || 0,
            item_category: category_input.value,
            item_count: count_input.value || 1,
            item_total: +sell_input.value * +count_input.value,
        }

        sections_arr.push(sections_dic)
        localStorage.setItem(`set_products${current_index}`, JSON.stringify(sections_arr))
        renderSections(); // إعادة رسم DOM مرة واحدة

        // إعادة ضبط الحقول
        name_input.value = '';
        buy_input.value = '';
        sell_input.value = '';
        taxes_input.value = '';
        category_input.value = '';
        count_input.value = '';
    }

    else if(mode == 'update')
    {
        sections_arr[current_update_index].item_name = name_input.value
        sections_arr[current_update_index].item_buy = buy_input.value || 0
        sections_arr[current_update_index].item_sell = sell_input.value || 0
        sections_arr[current_update_index].item_taxes = taxes_input.value || 0
        sections_arr[current_update_index].item_category = category_input.value
        sections_arr[current_update_index].item_count = count_input.value || 1
        sections_arr[current_update_index].item_total = sell_input.value * +count_input.value

        localStorage.setItem(`set_products${current_index}`, JSON.stringify(sections_arr));

        mode = 'add'
        current_update_index = null

        renderSections(); // إعادة رسم DOM مرة واحدة


        // إعادة ضبط الحقول
        name_input.value = '';
        buy_input.value = '';
        sell_input.value = '';
        taxes_input.value = '';
        category_input.value = '';
        count_input.value = '';
        count_input.value = '';
        submit_button.innerText = 'Add';
    }
    update_total()
};


function delete_pro(element)
{
    let index = Number(element.parentNode.parentNode.id);
    sections_arr.splice(index, 1)

    localStorage.setItem(`set_products${current_index}`, JSON.stringify(sections_arr));
    renderSections(); // إعادة رسم DOM مع إعادة ترقيم الـ id
}

function update_pro(element)
{
    submit_button.innerText = 'Update'

    current_update_index = Number(element.parentNode.parentNode.id);
    name_input.value = sections_arr[current_update_index].item_name
    buy_input.value = sections_arr[current_update_index].item_buy
    sell_input.value = sections_arr[current_update_index].item_sell
    taxes_input.value = sections_arr[current_update_index].item_taxes
    category_input.value = sections_arr[current_update_index].item_category
    count_input.value = sections_arr[current_update_index].item_count

    mode = 'update'
}

function backPage(url)
{ 
    window.location.href = url;
}


// حذف الكل
function sure_choise_yes()
{
    blur_screen.style.display = 'none'
    sure_delete.style.display = 'none'
    sure_delete_all()
}
function sure_choise_no()
{
    blur_screen.style.display = 'none'
    sure_delete.style.display = 'none'
}
function delete_all()
{
    if(sections_arr.length >= 1)
    {
        blur_screen.style.display = 'block'
        sure_delete.style.display = 'block'
    }
}
function sure_delete_all()
{
    items_tbody.innerHTML = ``;
    sections_arr = []
    localStorage.setItem(`set_products${current_index}`, JSON.stringify(sections_arr));
    delete_button.innerHTML = `Delete all (${sections_arr.length})`
}
// نهاية حذف الكل

*/

let name_input = document.getElementById('name_input')
let buy_input = document.getElementById('buy_input')
let sell_input = document.getElementById('sell_input')
let taxes_input = document.getElementById('taxes_input')
let category_input = document.getElementById('category_input')
let count_input = document.getElementById('count_input')

let total_button = document.querySelector('.total_button')
let items_tbody = document.querySelector('.items_tbody')
let submit_button = document.getElementById('submit_button')
let delete_button = document.getElementById('delete_button')



// local variables
let allProductsData = []
let CurrentSectionData = []

let currency_value = 1;
let current_symbol = '$';
let allCurrencyData = [];
let currencyModeData;

let pathParts = window.location.pathname.split('/')
let currentSectionId = pathParts[pathParts.length - 2]

// --- دالة جلب البيانات من API ---
async function products_api() {
    let response = await fetch('/regmarket/api/products/')
    allProductsData = await response.json()
}

async function currency_api() {
    let response = await fetch('/regmarket/api/currency/');
    allCurrencyData = await response.json();
}

async function currency_mode_api() {
    let response = await fetch('/regmarket/api/currency_mode/');
    currencyModeData = await response.json();
}

document.addEventListener('DOMContentLoaded', async function () {
    await products_api();
    await currency_api();
    await currency_mode_api();

    for(let i = 0; i < allProductsData.length; i++) {

        if(allProductsData[i].section_id == currentSectionId) {
            CurrentSectionData.push(allProductsData[i])
        }
    }

    if(currencyModeData.value == 'other') {
        currency_value = allCurrencyData.current_currency[0].value_per_usd;
        current_symbol = allCurrencyData.current_currency[0].symbol;
    }
    show_products()

})

function show_products() {

    items_tbody.innerHTML = ``

    for(let i = 0; i < CurrentSectionData.length; i++) {
        items_tbody.innerHTML += `
        <tr id="product_{{ i.id }}">
            <td class="section_id">${i}</td>
            <td class="section_name">${CurrentSectionData[i].product_name}</td>
            <td class="section_buy">${current_symbol}${parseFloat((CurrentSectionData[i].product_buy * currency_value).toFixed(2)).toLocaleString()}</td>
            <td class="section_sell">${current_symbol}${parseFloat((CurrentSectionData[i].product_sell * currency_value).toFixed(2)).toLocaleString()}</td>
            <td class="section_taxes">${current_symbol}${parseFloat((CurrentSectionData[i].product_tax * currency_value).toFixed(2)).toLocaleString()}</td>
            <td class="section_category">${CurrentSectionData[i].product_category}</td>
            <td id="section_count">${CurrentSectionData[i].product_count}</td>
            <td id="section_total">${current_symbol}${parseFloat((CurrentSectionData[i].product_total * currency_value).toFixed(2)).toLocaleString()}</td>
            <td id="local_id">${CurrentSectionData[i].id}</td>
            <td><button class="update" onclick='update_product(${CurrentSectionData[i].id})'>Update</button></td>
            <td><button class="delete" onclick='delete_product(${CurrentSectionData[i].id})'>Delete</button></td>

        </tr>
        `
    }
    ChangeupdateToCurrency()
}

function getTotal() {
    let qual = 1;
    if(count_input.value != '') {qual = +count_input.value}

    if(buy_input.value != '') {    
        total_button.innerHTML = `total: ${parseFloat(((+buy_input.value + +taxes_input.value) * qual).toFixed(2)).toLocaleString()}`
    }
    else {total_button.innerHTML = `total: `}
}

function getSearch() {
    items_tbody.innerHTML = ``

    for(let i = 0; i < CurrentSectionData.length; i++) {
        if(CurrentSectionData[i].product_name.toLowerCase().includes(search_input.value.toLocaleLowerCase()) || 
           String(CurrentSectionData[i].id).toLocaleLowerCase().includes(search_input.value.toLocaleLowerCase())) {
            items_tbody.innerHTML += `
            <tr id="product_{{ i.id }}">
                <td class="section_id">${i}</td>
                <td class="section_name">${CurrentSectionData[i].product_name}</td>
                <td class="section_buy">${current_symbol}${parseFloat((CurrentSectionData[i].product_buy * currency_value).toFixed(2)).toLocaleString()}</td>
                <td class="section_sell">${current_symbol}${parseFloat((CurrentSectionData[i].product_sell * currency_value).toFixed(2)).toLocaleString()}</td>
                <td class="section_taxes">${current_symbol}${parseFloat((CurrentSectionData[i].product_tax * currency_value).toFixed(2)).toLocaleString()}</td>
                <td class="section_category">${CurrentSectionData[i].product_category}</td>
                <td id="section_count">${CurrentSectionData[i].product_count}</td>
                <td id="section_total">${current_symbol}${parseFloat((CurrentSectionData[i].product_total * currency_value).toFixed(2)).toLocaleString()}</td>
                <td id="local_id">${CurrentSectionData[i].id}</td>
                <td><button class="update" onclick='update_product(${CurrentSectionData[i].id})'>Update</button></td>
                <td><button class="delete" onclick='delete_product(${CurrentSectionData[i].id})'>Delete</button></td>

            </tr>
            `
        }
    }
}

function update_product(id) {
    window.location.href = `/regmarket/update_product/${id}/${currentSectionId}`
}

function ChangeupdateToCurrency() {
    if(submit_button.innerHTML == 'Update') {
        buy_input.value = parseFloat((buy_input.value * currency_value).toFixed(2))
        sell_input.value = parseFloat((sell_input.value * currency_value).toFixed(2))
        taxes_input.value = parseFloat((taxes_input.value * currency_value).toFixed(2))
    }
    getTotal()
}

function getUpdate() {

    buy_input.value = parseFloat((buy_input.value / currency_value).toFixed(2))
    sell_input.value = parseFloat((sell_input.value / currency_value).toFixed(2))
    taxes_input.value = parseFloat((taxes_input.value / currency_value).toFixed(2))
    
    submit_button.type = 'submit'
}

function delete_product(id) {
    window.location.href = `/regmarket/delete_product/${id}/${currentSectionId}`
}

