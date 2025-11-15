// ################################# from HTML #################################

let customer_thead = document.querySelector('.customer_thead');
let customer_tbody = document.querySelector('.customer_tbody');
let customer_search_input = document.getElementById('customer_search_input')
let customer_name_section = document.getElementById('customer_name_section')
let idname_input = document.getElementById('idname_input');

let price_input = document.getElementById('price_input');
let taxes_input = document.getElementById('taxes_input');
let discount_input = document.getElementById('discount_input');
let category_input = document.getElementById('category_input');
let count_input = document.getElementById('count_input');

let search_input = document.getElementById('search_input');
let search_by_id = document.getElementById('search_by_id');
let search_by_name = document.getElementById('search_by_name');

let items_thead = document.querySelector('.items_thead');
let items_tbody = document.querySelector('.items_tbody');

let add_button = document.getElementById('add_button')
let delete_all_button = document.getElementById('delete_all_button')

let items_count_h2 = document.getElementById('items_count_h2')

let currency_base = document.getElementById('currency_base')

let copyright_container = document.querySelector('.copyright_container')

// local variables
let mode = 'add'
let current_update_index;
let items_storage_obj;

let allCustomersData = [];
let allProductsData = [];
let allCurrencyData = [];
let currency_mode;

// APIs
async function customers_api() {
    let response = await fetch('/regmarket/api/customers')
    allCustomersData = await response.json()
};

async function products_api() {
    let response = await fetch('/regmarket/api/products/')
    allProductsData = await response.json()
};

async function currency_api() {
    let response = await fetch('/regmarket/api/currency/')
    allCurrencyData = await response.json()
};

async function currency_mode_api() {
    let response = await fetch('/regmarket/api/currency_mode/', {
        method: "GET"
    });
    let data = await response.json();
    currency_mode = data.value;
}


let receipt_data = [
    {
    'customer': [],
    'items': [],
    'date': '',
    }
];

// get api ...
document.addEventListener('DOMContentLoaded', async function() {
    await customers_api()
    await products_api()
    await currency_api()
    await currency_mode_api()
    show_items()
});

// ########### customer code ############
let customer_added = false

// search
function search_customer() {
    if(!customer_added) {
        customer_thead.innerHTML = `
            <tr>
                <th>id</th>
                <th>name</th>
                <th>surname</th>
                <th>birthdate</th>
                <th>gender</th>
                <th>join-date</th>
                <th>local-id</th>
            </tr>
        `
        if(customer_search_input.value != '') {
            customer_thead.style.display = 'revert'
            customer_tbody.style.display = 'revert'

            customer_tbody.innerHTML = ``

            for(let i = 0; i < allCustomersData.length; i++) {
                if(String(allCustomersData[i].id).includes(customer_search_input.value) ||
                   String(allCustomersData[i].first_name).includes(customer_search_input.value)
                ) {
                    customer_tbody.innerHTML += `
                        <tr class='tbody_tr' id='${allCustomersData[i].id}'>
                            <td>${i}</td>
                            <td onclick='addCustomerToRecipe(this, ${i})'>${allCustomersData[i].first_name}</td>
                            <td onclick='addCustomerToRecipe(this, ${i})'>${allCustomersData[i].last_name}</td>
                            <td onclick='addCustomerToRecipe(this, ${i})'>${allCustomersData[i].birthdate}</td>
                            <td onclick='addCustomerToRecipe(this, ${i})'>${allCustomersData[i].gender}</td>
                            <td onclick='addCustomerToRecipe(this, ${i})'>${allCustomersData[i].join_date}</td>
                            <td onclick='addCustomerToRecipe(this, ${i})'>${allCustomersData[i].id}</td>
                        </tr>
                    `
                }
            }
        } else {
            customer_thead.style.display = 'none'
            customer_tbody.style.display = 'none'
        }
    }
}

// add
function addCustomerToRecipe(element, customer_index) {
    customer_added = true
    let customer_id = Number(element.parentNode.id)

    customer_thead.innerHTML = `
        <tr>
            <th>name</th>
            <th>surname</th>
            <th>birthdate</th>
            <th>gender</th>
            <th>join-date</th>
            <th>local-id</th>
            <th>delete</th>
        </tr>
    `;

    receipt_data[0].customer = {
        'first_name': allCustomersData[customer_index].first_name,
        'last_name': allCustomersData[customer_index].last_name,
        'birthdate': allCustomersData[customer_index].birthdate,
        'gender': allCustomersData[customer_index].gender,
        'join_date': allCustomersData[customer_index].join_date,
        'local_id': allCustomersData[customer_index].id,
    }
    show_customer()
};

// show
function show_customer() {
    customer_tbody.innerHTML = `
    <tr class='tbody_tr' id='${receipt_data[0].customer.id}'>
        <td>${receipt_data[0].customer.first_name}</td>
        <td>${receipt_data[0].customer.last_name}</td>
        <td>${receipt_data[0].customer.birthdate}</td>
        <td>${receipt_data[0].customer.gender}</td>
        <td>${receipt_data[0].customer.join_date}</td>
        <td>${receipt_data[0].customer.local_id}</td>
        <td><button onclick="delete_customer()" class="delete">delete</button></td>
    </tr>
    `;

    customer_search_input.value = '';
    if(receipt_data[0].customer.gender == 'male') {
        customer_name_section.innerHTML = `Mr.${receipt_data[0].customer.first_name} ${receipt_data[0].customer.last_name}`
    } else {
        customer_name_section.innerHTML = `Madam.${receipt_data[0].customer.first_name} ${receipt_data[0].customer.last_name}`
    }
}

// delete
function delete_customer() {
    customer_tbody.innerHTML = ``;
    customer_search_input.value = ``;
    customer_thead.style.display = 'none';
    customer_tbody.style.display = 'none';

    customer_added = false;
    customer_name_section.innerHTML = 'null'

    receipt_data[0].customer = []
};

// ##################### Items code #####################

function getAddReturnClick(event) {
    if(event.key == "Enter") {add_item()}
}

function calc_total(index) {
    let price = 0
    if(price_input.value != '') {price = +price_input.value || 0}
    else {price = +allProductsData[index].product_sell || 0}

    let tax = +taxes_input.value || 0
    let discount = +discount_input.value || 0
    let count = count_input.value == '' ? 1 : +count_input.value

    let total = ((price + tax) - discount) * count
    return total
}

// ****************** CURRENCIES *******************
let currency_value = 1;
let currency_symbol = '$';

let var_currency_value;
let var_currency_symbol;

function show_currency() {

    var_currency_value = 1
    var_currency_symbol = '$'
    if(currency_mode == 'other') {
        var_currency_symbol = allCurrencyData.current_currency[0].symbol
        var_currency_value = allCurrencyData.current_currency[0].value_per_usd
    }

    currency_symbol = allCurrencyData.current_currency[0].symbol
    currency_value = allCurrencyData.current_currency[0].value_per_usd

    let receipt_all_total = get_products_total()

    if(currency_mode == 'dollar') {
    currency_base.innerHTML = `
        <h1 id="total_recipe">${parseFloat((receipt_all_total).toFixed(2)).toLocaleString()}<span id='total_recipe_span'>$</span></h1>
        <p id="to_pound">${parseFloat((receipt_all_total * currency_value).toFixed(2)).toLocaleString()}<span id='to_pound_span'>${currency_symbol}</span></p>
    `

    }
    else {
        currency_base.innerHTML = `
            <h1 id="total_recipe">${parseFloat((receipt_all_total * currency_value).toFixed(2)).toLocaleString()}<span id='total_recipe_span'>${currency_symbol}</span></h1>
            <p id="to_pound">${parseFloat((receipt_all_total).toFixed(2)).toLocaleString()}<span id='to_pound_span'>$</span></p>
        `
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

async function send_new_currency_mode() {

    let response = await fetch('/regmarket/api/currency_mode/', {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
        }
    });

    let data = await response.json();

    currency_mode = data.value;
}


function change_currency() { 
    if(mode == 'add') {
        if(currency_mode == 'dollar') {currency_mode = 'other'}
        else {currency_mode = 'dollar'}

        send_new_currency_mode() // الارسال لقاعدة البيانات
        show_currency() // تحديث القسم
        show_items()
    }
}

function get_products_total() {
    let total_count = 0
    for(let i = 0; i < receipt_data[0].items.length; i++) {
        total_count += receipt_data[0].items[i].product_total
    }
    return total_count
}

// add item
function add_item() {
    if(mode == 'add') {
        for(let i = 0; i < allProductsData.length; i++) {
            if(idname_input.value != '') {
                if(allProductsData[i].product_name.toLowerCase().includes(idname_input.value.toLocaleLowerCase()) ||
                   String(allProductsData[i].id).toLocaleLowerCase().includes(idname_input.value.toLocaleLowerCase())
                ) {
                    total = calc_total(i)
                    items_storage_obj = {
                        'product_name': allProductsData[i].product_name,
                        'product_price': price_input.value || allProductsData[i].product_sell,
                        'product_tax': taxes_input.value || 0,
                        'product_discount': discount_input.value || 0,
                        'product_category': allProductsData[i].product_category || 'Uncategorized', // ✅
                        'product_count': count_input.value || 1,
                        'product_local_id': allProductsData[i].id,
                        'product_total': total,
                    }
                    receipt_data[0].items.push(items_storage_obj)

                    idname_input.value = '';
                    price_input.value = '';
                    taxes_input.value = '';
                    discount_input.value = '';
                    category_input.value = '';
                    count_input.value = '';
                    break;
                }
            }
        }
    } else {
        total = calc_total(current_update_index)
        add_button.innerHTML = 'add product'

        receipt_data[0].items[current_update_index].product_name = idname_input.value
        receipt_data[0].items[current_update_index].product_price = +price_input.value / var_currency_value
        receipt_data[0].items[current_update_index].product_tax = +taxes_input.value / var_currency_value
        receipt_data[0].items[current_update_index].product_discount = +discount_input.value / var_currency_value 
        receipt_data[0].items[current_update_index].product_count = count_input.value || 1
        receipt_data[0].items[current_update_index].product_total = total / var_currency_value
        receipt_data[0].items[current_update_index].product_category = category_input.value || receipt_data[0].items[current_update_index].product_category || 'Uncategorized' // ✅

        idname_input.value = '';
        price_input.value = '';
        taxes_input.value = '';
        discount_input.value = '';
        count_input.value = '';
        category_input.value = '';

        mode = 'add'
    }
    show_items()
}

// show items
function show_items() {
    items_tbody.innerHTML = ``
    for(let i = 0; i < receipt_data[0].items.length; i++) {
        let item = receipt_data[0].items[i]

        items_tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${item.product_name}</td>
            <td>${var_currency_symbol}${parseFloat((item.product_price * var_currency_value).toFixed(2)).toLocaleString()}</td>
            <td>${var_currency_symbol}${parseFloat((item.product_tax * var_currency_value).toFixed(2)).toLocaleString()}</td>
            <td>${var_currency_symbol}${parseFloat((item.product_discount * var_currency_value).toFixed(2)).toLocaleString()}</td>
            <td>${item.product_category}</td>
            <td>${item.product_count || 1}</td>
            <td>${var_currency_symbol}${parseFloat((item.product_total * var_currency_value).toFixed(2)).toLocaleString()}</td>
            <td>${item.product_local_id}</td>
            <td><button class='update' onclick='update_product(${i})'>update</button></td>
            <td><button class='delete' onclick='delete_product(${i})'>delete</button></td>       
        </tr>
        `
    }
    delete_all_button.innerHTML = `delete all (${receipt_data[0].items.length})`
    items_count_h2.innerHTML = receipt_data[0].items.length

    if(receipt_data[0].items.length == 0) {copyright_container.style.display = 'block'}
    else {copyright_container.style.display = 'none'}

    show_currency()
}

// search
let search_mode = 'id'
function search_name_mode() {
    search_mode = 'product_name';
    search_by_id.style.background = '#076'
    search_by_name.style.background = '#043'
    search_item();
}

function search_id_mode() {
    search_mode = 'id';
    search_by_name.style.background = '#076'
    search_by_id.style.background = '#043'
    search_item()
}

function search_item() {
    items_tbody.innerHTML = ``

    if(search_input.value != '') {
        for(let i = 0; i < allProductsData.length; i++) {

            // تعريف المتغيرات قبل استخدامها
            let price = +price_input.value || +allProductsData[i].product_sell || 0
            let tax = +taxes_input.value || 0
            let discount = +discount_input.value || 0
            let count = count_input.value == '' ? 1 : +count_input.value
            let total = ((price + tax) - discount) * count

            if(String(allProductsData[i][search_mode]).toLocaleLowerCase().includes(search_input.value.toLocaleLowerCase())) {
                items_tbody.innerHTML += `
                <tr class='search_resualt_tr' onclick='addSearchToRecipe(${i})'>
                    <td>${i}</td>
                    <td>${allProductsData[i].product_name}</td>
                    <td>${var_currency_symbol}${parseFloat((price * var_currency_value).toFixed(2)).toLocaleString()}</td>
                    <td>${var_currency_symbol}${parseFloat((tax * var_currency_value).toFixed(2)).toLocaleString()}</td>
                    <td>${var_currency_symbol}${parseFloat((discount * var_currency_value).toFixed(2)).toLocaleString()}</td>
                    <td>${allProductsData[i].product_category || 'Uncategorized'}</td>
                    <td>${count}</td>
                    <td>${var_currency_symbol}${parseFloat((total * var_currency_value).toFixed(2)).toLocaleString()}</td>
                    <td>${allProductsData[i].id}</td> 
                    <td>-</td> 
                    <td>-</td> 
                </tr>    
                `
            }
        }
    } else {
        show_items()
    }
}

// اضافة من البحث
function addSearchToRecipe(id) {
    let price = +price_input.value || +allProductsData[id].product_sell || 0
    let tax = +taxes_input.value || 0
    let discount = +discount_input.value || 0
    let count = count_input.value == '' ? 1 : +count_input.value

    items_storage_obj = {
        'product_name': allProductsData[id].product_name,
        'product_price': price,
        'product_tax': tax,
        'product_discount': discount,
        'product_category': allProductsData[id].product_category || 'Uncategorized', // ✅
        'product_count': count,
        'product_local_id': allProductsData[id].id,
        'product_total': ((price + tax) - discount) * count,
    }

    receipt_data[0].items.push(items_storage_obj);

    idname_input.value = '';
    price_input.value = '';
    taxes_input.value = '';
    discount_input.value = '';
    count_input.value = '';
    search_input.value = '';

    show_items();
}

// update
function update_product(id) {
    mode = 'update'
    current_update_index = id
    add_button.innerHTML = 'update product'

    idname_input.value = receipt_data[0].items[id].product_name
    price_input.value = receipt_data[0].items[id].product_price * var_currency_value
    taxes_input.value = receipt_data[0].items[id].product_tax * var_currency_value
    discount_input.value = receipt_data[0].items[id].product_discount * var_currency_value
    count_input.value = receipt_data[0].items[id].product_count
    category_input.value = receipt_data[0].items[id].product_category

    window.scroll({
        top: 270,
        behavior: 'smooth',
    })
}

// delete & delete all

function delete_product(id) { 
    receipt_data[0].items.splice(id, 1);
    show_items();
}

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
    if(receipt_data[0].items.length >= 1) {
        blur_screen.style.display = 'block'
        sure_delete.style.display = 'block'
    }
}
function sure_delete_all() {    
    receipt_data[0].items = []
    show_items()
}

// save
async function save_recipe() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    let hours = d.getHours();
    const minutes = d.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes.toString().padStart(2, '0');

    if(receipt_data[0].customer.length == 0) {
        receipt_data[0].customer = {
            'first_name': allCustomersData[0].first_name,
            'last_name': allCustomersData[0].last_name,
            'birthdate': allCustomersData[0].birthdate,
            'gender': allCustomersData[0].gender,
            'join_date': allCustomersData[0].join_date,
            'local_id': allCustomersData[0].id,
        }
    }
    
    receipt_data[0].date_created = `${year}-${month}-${day} ${hours}:${formattedMinutes}${ampm}`;
    
    let data = receipt_data[0];

    let response = await fetch("/regmarket/api/receipts/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });

    let result = await response.json();
    alert("Save Successfully ✔️");

    idname_input.value = '';
    price_input.value = '';
    taxes_input.value = '';
    discount_input.value = '';
    count_input.value = '';
    
    sure_delete_all()
    delete_customer()
}
