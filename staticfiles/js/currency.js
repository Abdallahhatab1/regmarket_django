let edit_value_input = document.getElementById('edit_value_input')
let search_input = document.getElementById('search_input')
let current_currency = document.getElementById('current_currency')
let items_tbody = document.querySelector('.items_tbody')

function saveCurrency(id) {
  window.location.href = `/regmarket/save_currency/${id}`
}

let AllData = []

async function currency_api()
{
  let response = await fetch('/regmarket/api/currency/')
  AllData = await response.json()

}

document.addEventListener('DOMContentLoaded', async function()
{
    // استحضار البيانات قبل ان نبدأ
    await currency_api()
    // ==============================

    function show_currencies()
    {
      items_tbody.innerHTML = ``;
      

      for(let i = 0; i < AllData['currencies'][0].length; i++)
      {
        items_tbody.innerHTML += `

          <tr class='tbody_tr'  onclick="saveCurrency(${i})">
              <td>${AllData['currencies'][0][i]['currency_shortcut']}</td>
              <td>${AllData['currencies'][0][i]['currency_symbol']}</td>
              <td>${AllData['currencies'][0][i]['currency_country']}</td>
              <td>${parseFloat((AllData['currencies'][0][i]['currency_value_per_usd']).toFixed(2)).toLocaleString()}</td>  
          </tr>
        
        `
      }
    }

    
    function void_functions() {
      current_currency.value = `${AllData['current_currency'][0].symbol} ${parseFloat((AllData['current_currency'][0].value_per_usd).toFixed(2)).toLocaleString()}`
      edit_value_input.value = AllData['current_currency'][0].value_per_usd

      show_currencies()
    }
    void_functions()
});

function search_currencies()
{
  items_tbody.innerHTML = ``;
  
  for(let i = 0; i < AllData['currencies'][0].length; i++)
  {
    if(
      AllData['currencies'][0][i]['currency_shortcut'].toLowerCase().includes(search_input.value.toLowerCase()) ||
      AllData['currencies'][0][i]['currency_country'].toLowerCase().includes(search_input.value.toLowerCase())
    )
    {
    items_tbody.innerHTML += `

      <tr class='tbody_tr'  onclick="saveCurrency(${i})">
          <td>${AllData['currencies'][0][i]['currency_shortcut']}</td>
          <td>${AllData['currencies'][0][i]['currency_symbol']}</td>
          <td>${AllData['currencies'][0][i]['currency_country']}</td>
          <td>${parseFloat((AllData['currencies'][0][i]['currency_value_per_usd']).toFixed(2)).toLocaleString()}</td>  
      </tr>
    
    `
    }
  }
}
