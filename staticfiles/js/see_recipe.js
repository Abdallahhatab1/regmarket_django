/*
let items_tbody = document.getElementById('items_tbody')
let inputes = document.querySelector('.inputes')
let title_h1 = document.querySelector('.title_h1')

let name_input = document.getElementById('name_input')
let price_input = document.getElementById('price_input')
let tax_input = document.getElementById('tax_input')
let discount_input = document.getElementById('discount_input')
let category_input = document.getElementById('category_input')
let count_input = document.getElementById('count_input')

let submit_button = document.getElementById('submit_button')

let current_day = localStorage.getItem('current_recipes_page')
let recipe_id = localStorage.getItem('show_recipe_id')

let all_recipes_arr = []
inputes.style.display = 'none'


current_currency_mode = localStorage.getItem('current_currency_mode')
currency_per_dollar = JSON.parse(localStorage.getItem('currency_per_dollar'))

let currency_value = 1
let current_symbol = '$'

if(current_currency_mode == 'other')
{
    currency_value = currency_per_dollar.currency_value_per_usd
    current_symbol = currency_per_dollar.currency_symbol 
}


function update_arr()
{
    let all_recipes = JSON.parse(localStorage.getItem('all_recipes'));

    all_recipes_arr = []
    for(let Key in all_recipes)
    {
    all_recipes_arr.push(all_recipes[Key])
    }
    return all_recipes_arr
}

function show_items()
{
    all_recipes_arr = update_arr()
    
    items_tbody.innerHTML = ``
    let recipe_length = Object.keys(all_recipes_arr[current_day][recipe_id].recipe).length
    for(let i = 0; i < recipe_length; i++)
    {
        current_product = all_recipes_arr[current_day][recipe_id].recipe[i]
        items_tbody.innerHTML += `
          <tr id='${i}'>
            <td>${i}</td>
            <td>${current_product.product_name || '-'}</td>
            <td>${current_symbol}${parseFloat((current_product.product_price * currency_value).toFixed(2)).toLocaleString() || 0}</td>
            <td>${current_symbol}${parseFloat((current_product.product_taxes * currency_value).toFixed(2)).toLocaleString() || 0}</td>
            <td>${current_symbol}${parseFloat((current_product.product_discount * currency_value).toFixed(2)).toLocaleString() || 0}</td>
            <td>${current_product.product_category || '-'}</td>
            <td>${current_product.product_count || 1}</td>
            <td>${current_product.product_local_id}</td>
            <td>${current_symbol}${parseFloat((current_product.product_total * currency_value).toFixed(2)).toLocaleString()}</td>
            <td onclick='update_product(this)'><button>update</button></td>
            <td><button onclick='delete_product(this)'>delete</button></td>
        </tr> 
        `
    }
}
show_items()

function backPage()
{
    window.location.href = 'current_recipes.html'
}


function delete_product(element)
{
    all_recipes_arr = []
    let current_id = Number(element.parentNode.parentNode.id);

    let all_recipes = JSON.parse(localStorage.getItem('all_recipes'));


    let current_day_key = Object.keys(all_recipes)[current_day];
    all_recipes[current_day_key][recipe_id].recipe.splice(current_id, 1);
    localStorage.setItem('all_recipes', JSON.stringify(all_recipes))

    show_items();
}

function update_product(element)
{

    window.scroll({
        top: 0,
        behavior: 'smooth',
    })

    let current_id = Number(element.parentNode.id);
    let all_recipes = JSON.parse(localStorage.getItem('all_recipes'));
    let current_day_key = Object.keys(all_recipes)[current_day];

    inputes.style.display = 'block'
    title_h1.innerHTML = 'Edit Receipt'

    if(all_recipes[current_day_key][recipe_id].recipe[current_id].product_name == '-')
    {name_input.value = ''}
    else
    {name_input.value = all_recipes[current_day_key][recipe_id].recipe[current_id].product_name}
    
    price_input.value = all_recipes[current_day_key][recipe_id].recipe[current_id].product_price || 0
    tax_input.value = all_recipes[current_day_key][recipe_id].recipe[current_id].product_taxes || 0
    discount_input.value = all_recipes[current_day_key][recipe_id].recipe[current_id].product_discount || 0
    

    if(all_recipes[current_day_key][recipe_id].recipe[current_id].product_category == '-')
    {category_input.value = ''}
    else
    {category_input.value = all_recipes[current_day_key][recipe_id].recipe[current_id].product_category}
    
    count_input.value = all_recipes[current_day_key][recipe_id].recipe[current_id].product_count || 1

    show_items();

    localStorage.setItem('update_recipe_id', current_id)

}

function submit_update()
{
    let current_id = Number(localStorage.getItem('update_recipe_id'))

    let all_recipes = JSON.parse(localStorage.getItem('all_recipes'));
    let current_day_key = Object.keys(all_recipes)[current_day];

    
    all_recipes[current_day_key][recipe_id].recipe[current_id].product_name = name_input.value || '-'
    all_recipes[current_day_key][recipe_id].recipe[current_id].product_price = price_input.value  || 0
    all_recipes[current_day_key][recipe_id].recipe[current_id].product_taxes = tax_input.value || 0
    all_recipes[current_day_key][recipe_id].recipe[current_id].product_discount = discount_input.value || 0
    all_recipes[current_day_key][recipe_id].recipe[current_id].product_category = category_input.value || '-'
    all_recipes[current_day_key][recipe_id].recipe[current_id].product_count = count_input.value || 1

    

    let price = +all_recipes[current_day_key][recipe_id].recipe[current_id].product_price
    let tax = +all_recipes[current_day_key][recipe_id].recipe[current_id].product_taxes
    let discount = +all_recipes[current_day_key][recipe_id].recipe[current_id].product_discount
    let count = +all_recipes[current_day_key][recipe_id].recipe[current_id].product_count

    let total = ((price + tax) - discount) * count

    all_recipes[current_day_key][recipe_id].recipe[current_id].product_total = total


    localStorage.setItem('all_recipes', JSON.stringify(all_recipes))

    all_recipes_arr = update_arr()

    inputes.style.display = 'none'
    title_h1.innerHTML = 'Show Receipt'

    show_items()

}

document.addEventListener('keyup', function(event) 
{
    if (event.key === 'Enter'){if(inputes.style.display == 'block'){submit_update()}}
});
*/


let items_tbody = document.getElementById('items_tbody')
let inputes = document.querySelector('.inputes')
let title_h1 = document.querySelector('.title_h1')

let name_input = document.getElementById('name_input')
let price_input = document.getElementById('price_input')
let tax_input = document.getElementById('tax_input')
let discount_input = document.getElementById('discount_input')
let category_input = document.getElementById('category_input')
let count_input = document.getElementById('count_input')

let submit_button = document.getElementById('submit_button')

let receipt;
let currentSectionId;
let currenDayIndex;
let mode = 'add';


async function receipts_api() {
    let response = await fetch('/regmarket/api/receipts/');
    allReceiptsData = await response.json();
}

document.addEventListener('DOMContentLoaded', async function() {
    await receipts_api();

    let receipts = allReceiptsData.receipts;
    if(receipts.length == 0) {window.location.href = `current_receipts/<int:dayIndex>/delete/<int:receipt_id>/`}

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

        let pathParts = window.location.pathname.split('/');
        if(pathParts.length == 7) {
            currentSectionId = +pathParts[pathParts.length - 4]
            currenDayIndex = +pathParts[pathParts.length - 5]
        }
        else{currentSectionId = +pathParts[pathParts.length - 2];
             currenDayIndex = +pathParts[pathParts.length - 3];
        }

        receipt = receipts.find(r => r.id == currentSectionId);

        if(receipt.items.length <= 0) {
            window.location.href = `/regmarket/current_receipts/${currenDayIndex}/delete/${currentSectionId}/`
        }

        show_products(receipt);

});

function show_products(receipt) {
    items_tbody.innerHTML = ``;
    for(let i = 0; i < receipt.items.length; i++) {
        items_tbody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${receipt.items[i].product_name}</td>
                <td>${receipt.items[i].price}</td>
                <td>${receipt.items[i].tax}</td>
                <td>${receipt.items[i].discount}</td>
                <td>${receipt.items[i].category}</td>
                <td>${receipt.items[i].count}</td>
                <td>${receipt.items[i].id}</td>
                <td>total</td>
                <td><button onclick='update_product(${receipt.items[i].id})'>update</button></td>
                <td><button onclick='delete_product(${receipt.items[i].id})'>delete</button></td>
            </tr> 
        `
    
    }
}


let current_id;
function update_product(id) {
    window.location.href = `/regmarket/see_receipt/${currenDayIndex}/${currentSectionId}/update/${id}/`
}

function delete_product(id) {
    window.location.href = `/regmarket/see_receipt/${currenDayIndex}/${currentSectionId}/delete/${id}/`
}