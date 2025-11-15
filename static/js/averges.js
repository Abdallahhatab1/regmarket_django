
// --- عناصر HTML ---
const h1_avarge = document.getElementById('h1_avarge');
const container = document.querySelector('.container');

let pathParts = window.location.pathname.split('/');
let curerentPathId = pathParts[pathParts.length - 2]

// --- متغيرات عامة ---
let allCurrencyData = [];
let currencyModeData;

let allReceiptsData = [];
let groupedReceipts = [];
let current_statisitics_page = curerentPathId;

let currency_value = 1;
let current_symbol = '$';

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

// --- دالة تنسيق الأرقام الكبيرة ---
function formatBigNumber(num) {
    const abbreviations = [
        { value: 1e24, symbol: "Y" },
        { value: 1e21, symbol: "Z" },
        { value: 1e18, symbol: "E" },
        { value: 1e15, symbol: "P" },
        { value: 1e12, symbol: "T" },
        { value: 1e9,  symbol: "B" },
        { value: 1e6,  symbol: "M" },
        { value: 1e3,  symbol: "K" },
    ];

    for (let i = 0; i < abbreviations.length; i++) {
        if (num >= abbreviations[i].value) {
            return (num / abbreviations[i].value)
                .toFixed(2)
                .replace(/\.?0+$/, "")
                + abbreviations[i].symbol;
        }
    }
    return num.toString();
}

// --- الدالة الأساسية ---
document.addEventListener('DOMContentLoaded', async function() {
    // ننتظر البيانات
    await receipts_api();
    await currency_api();
    await currency_mode_api();

    const receipts = allReceiptsData.receipts;

    // نجمع حسب التاريخ (اليوم)
    const groupedByDate = {};
    receipts.forEach(r => {
        const dateOnly = r.date.split(' ')[0];
        if (!groupedByDate[dateOnly]) {
            groupedByDate[dateOnly] = [];
        }
        groupedByDate[dateOnly].push(r);
    });

    // نحولها إلى مصفوفة مرتبة حسب التاريخ
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

    // بعد الجلب نبدأ الحساب والرسم
    buildStatistics();
});

// --- دالة لحساب المجاميع ---
function getTotalPrices(product_type) {
    let counts_arr = [];

    for (let i = 0; i < groupedReceipts.length; i++) {
        let count = 0;
        for (let a = 0; a < groupedReceipts[i].receipts.length; a++) {
            for (let b = 0; b < groupedReceipts[i].receipts[a].items.length; b++) {
                count += +groupedReceipts[i].receipts[a].items[b][product_type] || 0;
            }
        }
        counts_arr.push(count); // ← نضيف مجموع اليوم للمصفوفة
    }

    return counts_arr;
}

// --- الدالة التي تبني كل الرسم ---
function buildStatistics() {
    // نحسب المجاميع لكل نوع
    let total_prices_arr = getTotalPrices('price');
    let total_taxes_arr = getTotalPrices('tax');
    let total_discount_arr = getTotalPrices('discount');
    let total_totals_arr = getTotalPrices('total');

    // --- تحضير البيانات النهائية ---
    let talls_list = [];
    talls_list[0] = total_prices_arr;
    talls_list[1] = total_taxes_arr;
    talls_list[2] = total_discount_arr;
    talls_list[3] = total_totals_arr;

    // --- معالجة القيم لتوليد الرسوم ---
    let logValues = talls_list[current_statisitics_page].map(v => Math.log10(v + 1));
    let maxLog = Math.max(...logValues);
    let maxHeight = 500;

    // --- حساب المتوسط ---
    let sum_avarge = 0;
    for (let i = 0; i < talls_list[current_statisitics_page].length; i++) {
        sum_avarge += talls_list[current_statisitics_page][i];
    }
    sum_avarge = sum_avarge / talls_list[current_statisitics_page].length;

    h1_avarge.innerHTML = `Avarge: ${current_symbol}${"\u200E" + "\u200F" + parseFloat((sum_avarge * currency_value).toFixed(2)).toLocaleString()}`;

    // --- إنشاء الأعمدة ---
    container.innerHTML = ''; // تفريغ قديم
    for (let i = 0; i < talls_list[current_statisitics_page].length; i++) {
        container.innerHTML += `
        <div class="base"> ${i + 1}  
            <div class="building">
                <h5 id=${i} class='h5_build_price'></h5>
            </div>
        </div>
        `;
    }

    let building = document.querySelectorAll('.building');
    let building_h5 = document.querySelectorAll('.building h5');

    for (let i = 0; i < building_h5.length; i++) {
        building_h5[i].innerHTML = `${"\u200E" + "\u200F" + current_symbol}<br>${formatBigNumber(parseFloat((talls_list[current_statisitics_page][i] * currency_value).toFixed(2)))}`;
        building_h5[i].style.color = '#0ce';
        building_h5[i].style.zIndex = 1;
        building_h5[i].style.fontSize = '14px';
    }

    // --- تفاعل عند تمرير الماوس ---
    building_h5.forEach(bh5 => {
        bh5.addEventListener('mouseenter', () => {
            bh5.innerHTML = `${current_symbol}${parseFloat((talls_list[current_statisitics_page][bh5.id] * currency_value).toFixed(2)).toLocaleString()}`;
            bh5.style.color = 'white';
            bh5.style.zIndex = 2;
            bh5.style.fontSize = '15px';
        });

        bh5.addEventListener('mouseleave', () => {
            bh5.innerHTML = `${"\u200E" + "\u200F" + current_symbol}<br>${formatBigNumber(parseFloat((talls_list[current_statisitics_page][bh5.id] * currency_value).toFixed(2)))}`;
            bh5.style.color = '#0ce';
            bh5.style.zIndex = 1;
            bh5.style.fontSize = '14px';
        });
    });

    // --- ألوان الأعمدة ---
    let colors_list = [];
    let current_color = 'green';

    for (let i = 0; i < talls_list[current_statisitics_page].length; i++) {
        colors_list.push(current_color);
        current_color = current_color === 'green' ? 'red' : 'green';
    }

    // --- تعيين الارتفاعات ---
    for (let i = 0; i < talls_list[current_statisitics_page].length; i++) {
        let scaledHeight = (logValues[i] / maxLog) * maxHeight;
        building[i].style.background = colors_list[i];
        building[i].style.height = `${scaledHeight}px`;
    }
}

// --- زر العودة ---
function backPage() {
    window.location.href = 'statisitics.html';
}
