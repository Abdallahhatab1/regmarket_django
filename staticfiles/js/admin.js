let items_tbody = document.querySelector('.items_tbody')
let available_range = document.getElementById('available_range')
let range_h3_2 = document.querySelector('.range_h3_2')
let salary_input = document.getElementById('salary_input')
let submit_button = document.getElementById('submit_button')

available_range.value = 0
range_h3_2.innerHTML = `${available_range.value}h`

let allAdminData = []

let currency_value = 1;
let current_symbol = '$';
let allCurrencyData = [];
let currencyModeData;

// --- دالة جلب البيانات من API ---
async function currency_api() {
    let response = await fetch('/regmarket/api/currency/');
    allCurrencyData = await response.json();
}

async function currency_mode_api() {
    let response = await fetch('/regmarket/api/currency_mode/');
    currencyModeData = await response.json();
}

async function admin_api() {
    let response = await fetch('/regmarket/api/admin/')
    allAdminData = await response.json()
}


document.addEventListener('DOMContentLoaded', async function() {
    await currency_api()
    await currency_mode_api()
    await admin_api()

    
    if(currencyModeData.value == 'other') {
        currency_value = allCurrencyData.current_currency[0].value_per_usd;
        current_symbol = allCurrencyData.current_currency[0].symbol;
    }
    show_admins()

})



available_range.addEventListener("input", () => {
 range_h3_2.innerHTML = `${available_range.value}h`
});

function show_admins() {
    items_tbody.innerHTML = ``;
    console.log(allAdminData)
    for(let i = 0; i < allAdminData.length; i++) {
        items_tbody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${allAdminData[i].first_name}</td>
                <td>${allAdminData[i].last_name}</td>
                <td>${allAdminData[i].birthdate}</td>
                <td>${allAdminData[i].gender}</td>
                <td>${current_symbol}${parseFloat((+allAdminData[i].salary * +currency_value).toFixed(2)).toLocaleString()}</td>
                <td>${allAdminData[i].available_hours}h</td>
                <td>${allAdminData[i].join_date}</td>
                <td><button type='button' onclick="update_admin(this)" class="update" id=${allAdminData[i].id}>update</button></td>
                <td><button type='button' onclick="delete_admin(this)" class="delete" id=${allAdminData[i].id}>delete</button></td>
            </tr>
        `
    }
    if(submit_button.innerHTML == 'Update') {
        salary_input.value = parseFloat((salary_input.value * currency_value).toFixed(2))
        submit_button.type = 'button'
        
    }

}

function SubmitUpdate() {
    if(submit_button.innerHTML == 'Update') {
        salary_input.value = parseFloat((salary_input.value / currency_value).toFixed(2))
        
    }
    submit_button.type = 'submit'
}

// delete
function delete_admin(element)
{
    window.location.href = `delete_admin/${element.id}`
}

// search
let name_search_button = document.getElementById('name_search_button')
let surname_search_button = document.getElementById('surname_search_button')

let search_mode = 'name'
function search_mode_name()
{
    search_mode = 'name'
    name_search_button.style.background = '#043'
    surname_search_button.style.background = '#076'
    search_admin()
}
function search_mode_surname()
{
    search_mode = 'surname'
    surname_search_button.style.background = '#043'
    name_search_button.style.background = '#076'
    search_admin()
}
function search_admin()
{
    let rows = document.querySelectorAll('.items_tbody tr');
    let search_input = document.getElementById('search_input')

    rows.forEach(row => {
        let first_name = row.children[1].textContent.toLowerCase();
        let last_name = row.children[2].textContent.toLowerCase();

        if(search_mode == 'name')
        {
            if(first_name.toLocaleLowerCase().includes(search_input.value.toLocaleLowerCase()))
            {
                row.style.display = '';
            }
            else{row.style.display = 'none'};
        }
        else
        {
            if(last_name.toLocaleLowerCase().includes(search_input.value.toLocaleLowerCase()))
            {
                row.style.display = '';
            }
            else
            {
                row.style.display = 'none';
            };
        };

    });
};


// update
function update_admin(element)
{
    window.location.href = `update_admin/${element.id}`
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
    if(allAdminData.length >= 1) {
        blur_screen.style.display = 'block'
        sure_delete.style.display = 'block'
    }
}
function sure_delete_all() {
    window.location.href = `/regmarket/admin/delete_all/`
}