{
// let name_input = document.getElementById('name_input')
// let category_input = document.getElementById('category_input')


// let items_tbody = document.querySelector('.items_tbody')
// let submit_button = document.getElementById('submit_button')
// let delete_button = document.getElementById('delete_button')

// let blur_screen = document.querySelector('.blur_screen')
// let sure_delete = document.querySelector('.sure_delete')

// sections = JSON.parse(localStorage.getItem('set_sections'))
// let sections_arr = [];
// let sections_dic;

// let mode = 'add'


// current_currency_mode = localStorage.getItem('current_currency_mode')
// currency_per_dollar = JSON.parse(localStorage.getItem('currency_per_dollar'))

// let currency_value = 1
// let current_symbol = '$'

// if(current_currency_mode == 'other')
// {
//     currency_value = currency_per_dollar.currency_value_per_usd
//     current_symbol = currency_per_dollar.currency_symbol 
// }


// window.onload = function() {
//     let stored = localStorage.getItem("set_sections");
//     if (stored) {
//         sections_arr = JSON.parse(stored);
//         renderSections();
//         delete_button.innerHTML = `Delete all (${sections_arr.length})`
//     }
// };

// function get_totals(target)
// {
//     let total_sect_arr = []
//     for(let i = 0; i < sections.length; i++)
//     {
//         let total_sect = 0
//         let total_products = JSON.parse(localStorage.getItem(`set_products${i}`))
//         for(let a = 0; a < total_products.length; a++)
//         {
//             total_sect += +total_products[a][target]
//         }
//         total_sect_arr.push(total_sect)
//     }

//     return total_sect_arr
// }


// let total_buy_arr = get_totals('item_buy')
// let total_sell_arr = get_totals('item_sell')
// let total_tax_arr = get_totals('item_taxes')
// let total_count_arr = get_totals('item_count')


// function renderSections() 
// {
//     items_tbody.innerHTML = ``; // نظف الجدول قبل الإضافة
//     for(let i = 0; i < sections_arr.length; i++)
//     {
//         items_tbody.innerHTML += `
//             <tr id='${i}'>
//                 <td onclick="goToSection(this.parentNode)" class="section_id">${i}</td>
//                 <td onclick="goToSection(this.parentNode)" class="section_name">${sections_arr[i].item_name || 'none'}</td>
//                 <td onclick="goToSection(this.parentNode)" class="section_buy">${current_symbol}${parseFloat((total_buy_arr[i] * currency_value).toFixed(2)).toLocaleString() || 0}</td>
//                 <td onclick="goToSection(this.parentNode)" class="section_sell">${current_symbol}${parseFloat((total_sell_arr[i] * currency_value).toFixed(2)).toLocaleString() || 0}</td>
//                 <td onclick="goToSection(this.parentNode)" class="section_taxes">${current_symbol}${parseFloat((total_tax_arr[i] * currency_value).toFixed(2)).toLocaleString() || 0}</td>
//                 <td onclick="goToSection(this.parentNode)" class="section_ocunt">${total_count_arr[i] || 0}</td>
//                 <td onclick="goToSection(this.parentNode)" class="section_category">${sections_arr[i].item_category || 'none'}</td>
//                 <td><button onclick="update_pro(this)" class="update">update</button></td>
//                 <td><button onclick="delete_pro(this)" class="delete">delete</button></td>
//             </tr>
//         `;

//     }
//     delete_button.innerHTML = `Delete all (${sections_arr.length})`
// };

// function add_item()
// {

//     if(mode == 'add')
//     {
//         items_tbody.innerHTML = ``

//             sections_dic = {
//                 item_name: name_input.value,
//                 item_totalBuy: 0,
//                 item_totalSell: 0,
//                 item_totalTaxes: 0,
//                 item_category: category_input.value,
//             }

//             // local Storage
//             sections_arr.push(sections_dic)
//             localStorage.setItem("set_sections", JSON.stringify(sections_arr));
//             localStorage.setItem(`set_products${sections_arr.length - 1}`, JSON.stringify([]))

//         for(let i = 0; i < sections_arr.length; i++)
//         {
//             items_tbody.innerHTML += `
//                 <tr id='${i}'>
//                     <td onclick="goToSection(this.parentNode)" class="section_id">${i}</td>
//                     <td onclick="goToSection(this.parentNode)" class="section_name">${sections_arr[i].item_name}</td>
//                     <td onclick="goToSection(this.parentNode)" class="section_buy">0</td>
//                     <td onclick="goToSection(this.parentNode)" class="section_sell">0</td>
//                     <td onclick="goToSection(this.parentNode)" class="section_taxes">0</td>
//                     <td onclick="goToSection(this.parentNode)" class="section_count">0</td>
//                     <td onclick="goToSection(this.parentNode)" class="section_category">${sections_arr[i].item_category}</td>
//                     <td><button onclick="update_pro(this)" class="update">update</button></td>
//                     <td><button onclick="delete_pro(this)" class="delete">delete</button></td>
//                 </tr>
//             `
//         }
//         delete_button.innerHTML = `Delete all (${sections_arr.length})`

//         name_input.value = ``
//         category_input.value = ``
    
//     }
//     else if(mode=='update')
//     {
//         submit_button.innerText = 'Add'

//         sections_arr[current_update_index].item_name = name_input.value
//         sections_arr[current_update_index].item_category = category_input.value

//         localStorage.setItem("set_sections", JSON.stringify(sections_arr));

//         name_input.value = ''
//         category_input.value = ''
//     }
//     renderSections()

// };

// function goToSection(id)
// {
//     let index = Number(id.querySelector('.section_id').innerHTML);
//     localStorage.setItem('current_section_index', JSON.stringify(index))
//     window.location.href = 'add_product.html'
// };


// function delete_pro(element)
// {

//     localStorage.removeItem(`set_products${sections_arr.length - 1}`)
//     let index = Number(element.parentNode.parentNode.id);
//     sections_arr.splice(index, 1)
//     localStorage.setItem(`set_sections`, JSON.stringify(sections_arr));
//     renderSections();
// }

// function update_pro(element)
// {
//     submit_button.innerText = 'Update'

//     current_update_index = Number(element.parentNode.parentNode.id);
//     name_input.value = sections_arr[current_update_index].item_name
//     category_input.value = sections_arr[current_update_index].item_category


//     mode = 'update'
// }


// // حذف الكل
// function sure_choise_yes()
// {
//     blur_screen.style.display = 'none'
//     sure_delete.style.display = 'none'
//     sure_delete_all()
// }
// function sure_choise_no()
// {
//     blur_screen.style.display = 'none'
//     sure_delete.style.display = 'none'
// }
// function delete_all()
// {
//     if(sections_arr.length >= 1)
//     {
//         blur_screen.style.display = 'block'
//         sure_delete.style.display = 'block'
//     }
// }
// function sure_delete_all()
// {
//     for(let i = 0; i < sections_arr.length; i++)
//     {
//         localStorage.removeItem(`set_products${i}`)
//     }

//     items_tbody.innerHTML = ``;
//     sections_arr = []
//     localStorage.setItem(`set_sections`, JSON.stringify(sections_arr));
//     delete_button.innerHTML = `Delete all (${sections_arr.length})`

// }
// // نهاية حذف الكل
}

let name_input = document.getElementById('name_input')
let category_input = document.getElementById('category_input')


let items_tbody = document.querySelector('.items_tbody')
let delete_button = document.getElementById('delete_button')

let blur_screen = document.querySelector('.blur_screen')
let sure_delete = document.querySelector('.sure_delete')



// local variables
let allProductsData = [];
let allSectionsData = [];
let groupedProducts = []

let currency_value = 1;
let current_symbol = '$';
let allCurrencyData = [];
let currencyModeData;

// --- دالة جلب البيانات من API ---
async function products_api() {
    let response = await fetch('/regmarket/api/products/')
    allProductsData = await response.json()
}

async function sections_api() {
    let response = await fetch('/regmarket/api/sections/')
    allSectionsData = await response.json()
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
    await sections_api();
    await currency_api();
    await currency_mode_api();

    // --- بعد ما تجيب allProductsData من API ---
    groupedProducts = []

    const groups = {};

    allProductsData.forEach(product => {
        if (!groups[product.section_id]) {
            groups[product.section_id] = [];
        }
        groups[product.section_id].push(product);
    });

    groupedProducts = Object.values(groups);




    if(currencyModeData.value == 'other') {
        currency_value = allCurrencyData.current_currency[0].value_per_usd;
        current_symbol = allCurrencyData.current_currency[0].symbol;
    }
    show_sections()
})

function show_sections() {
    items_tbody.innerHTML = ``
    for(let i = 0; i < allSectionsData.length; i++) {
        let total_buy = `${current_symbol}${parseFloat(((getTotals('product_buy')[i]) * currency_value).toFixed(2)).toLocaleString()}`
        let total_sell = `${current_symbol}${parseFloat(((getTotals('product_sell')[i]) * currency_value).toFixed(2)).toLocaleString()}`
        let total_tax = `${current_symbol}${parseFloat(((getTotals('product_tax')[i]) * currency_value).toFixed(2)).toLocaleString()}`
        let total_count = `${current_symbol}${parseFloat(((getTotals('product_count')[i]) * currency_value).toFixed(2)).toLocaleString()}`
        
        if(total_count == `${current_symbol}NaN`) {
            total_buy = 0; total_sell = 0; total_tax = 0; total_count = 0;
        }

        items_tbody.innerHTML += `
            <tr id='${allSectionsData[i].id}'>
                <td onclick="goToSection(this.parentNode.id)" class="section_id">${i}</td>
                <td onclick="goToSection(this.parentNode, ${i})" class="section_name">${allSectionsData[i].section_name || '-'}</td>
                <td onclick="goToSection(this.parentNode, ${i})" class="section_buy">${total_buy}</td>
                <td onclick="goToSection(this.parentNode, ${i})" class="section_sell">${total_sell}</td>
                <td onclick="goToSection(this.parentNode, ${i})" class="section_taxes">${total_tax}</td>
                <td onclick="goToSection(this.parentNode, ${i})" class="section_taxes">${total_count}</td>
                <td onclick="goToSection(this.parentNode, ${i})" class="section_category">${allSectionsData[i].category}</td>
                <td><button onclick="update_section(this)" class="update" id='${allSectionsData[i].id}'>update</button></td>
                <td><button onclick="delete_section(this)" class="delete" id='${allSectionsData[i].id}'>delete</button></td>
            </tr>
        `
    }
    delete_button.innerHTML = `Delete all (${allSectionsData.length})`
}

function getTotals(type) {

    let totals_arr = []
    let count = 0
    let pro_count = 0

    for(let i = 0; i < groupedProducts.length; i++) {
        for(let a = 0; a < groupedProducts[i].length; a++) {

            if(type == 'product_count') { pro_count = 1 }
            else {pro_count = +groupedProducts[i][a].product_count}

            count +=  +groupedProducts[i][a][type] * pro_count
        }
        totals_arr.push(count)
        count = 0
    }
    return totals_arr
}


// delete
function delete_section(element) {
    window.location.href = `delete_section/${element.id}`
}

// delete all

// update
function update_section(element) {
    window.location.href = `update_section/${element.id}`
}

function goToSection(parent, index) {
    window.location.href = `/regmarket/add_product/${allSectionsData[index].section_name}/${+parent.id}/`
}