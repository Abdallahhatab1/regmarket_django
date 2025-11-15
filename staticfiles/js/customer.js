let items_tbody = document.querySelector('.items_tbody')

let search_input = document.getElementById('search_input')
let name_search_button = document.getElementById('name_search_button')
let surname_search_button = document.getElementById('surname_search_button')

let delete_all_button = document.getElementById('delete_all_button')

let sure_delete = document.querySelector('.sure_delete')
let blur_screen = document.querySelector('.blur_screen')

let submit_button = document.getElementById('submit_button')

// inputes
let first_name = document.getElementById('first_name')
let last_name = document.getElementById('last_name')
let birthdate = document.getElementById('birthdate')
let gender = document.getElementById('gender')


//APIs جميع البيانات المطلوبة من 
let customers_api_data = [];

async function customers_api() {
    let response = await fetch('/regmarket/api/customers/');
    customers_api_data = await response.json();
}
// ===============================

document.addEventListener('DOMContentLoaded', async function() {

    // استحضار البيانات قبل ان نبدأ
    await customers_api()
    // ==============================

    function show_customers() {
        items_tbody.innerHTML = ``;

        for(let i = 0; i < customers_api_data.length; i++)
        {

            let buttons = `
                <td><button type='button' onclick="update_customer(this)" id='${customers_api_data[i].id}' class="update">update</button></td>
                <td><button type='button' onclick="delete_customer(this)" id='${customers_api_data[i].id}' class="delete">delete</button></td>

            `
            if(i == 0) {buttons = `
                <td>-</td>
                <td>-</td>
            `
            }

            items_tbody.innerHTML += `
            <tr class='tbody_tr'>
                <td>${i}</td>
                <td>${customers_api_data[i].first_name}</td>
                <td>${customers_api_data[i].last_name}</td>
                <td>${customers_api_data[i].birthdate}</td>
                <td>${customers_api_data[i].gender}</td>
                <td>${customers_api_data[i].join_date}</td>
                <td>${customers_api_data[i].id}</td>
                ${buttons}
            </tr>
        `
        }
    }
    
    function void_functions()
    {
        show_customers()
        delete_all_button.innerHTML = `Delete All (${customers_api_data.length})`
    }
    void_functions()
});


function delete_customer(element)
{
    window.location.href = `delete_customer/${element.id}`
}

function update_customer(element)
{
    window.location.href = `update_customer/${element.id}`
}

// البحث
let search_mode = 'first_name'
function search_mode_name()
{
    search_mode = 'first_name';
    name_search_button.style.background = '#043'
    surname_search_button.style.background = '#076'
    search_customer();
}
function search_mode_surname()
{
    search_mode = 'last_name';
    surname_search_button.style.background = '#043'
    name_search_button.style.background = '#076'
    search_customer()
}

function search_customer()
{
        items_tbody.innerHTML = ``;
        for(let i = 0; i < customers_api_data.length; i++)
        {
        if(customers_api_data[i][search_mode].includes(search_input.value))
        items_tbody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${customers_api_data[i].first_name}</td>
                <td>${customers_api_data[i].last_name}</td>
                <td>${customers_api_data[i].birthdate}</td>
                <td>${customers_api_data[i].gender}</td>
                <td>${customers_api_data[i].join_date}</td>
                <td><button type='button' onclick="update_customer(this)" id='${customers_api_data[i].id}' class="update">update</button></td>
                <td><button type='button' onclick="delete_customer(this)" id='${customers_api_data[i].id}' class="delete">delete</button></td>
            </tr>
        
        `
        }
}
// نهاية البحث

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
    if(customers_api_data.length > 1) {
        blur_screen.style.display = 'block'
        sure_delete.style.display = 'block'
    }
}
function sure_delete_all() {
    window.location.href = 'delete_all'
}
// نهاية حذف الكل