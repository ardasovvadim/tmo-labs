let m = 2;
let Nn = 2;
let lambda = 10 * m / Nn;

let T1 = Nn + 1;
let T2 = Nn + 5;
let T = T2 - T1;

let amount_numbers = Math.round(2 * lambda * T);

let Ri = [];

for(let i = 0; i < amount_numbers; ++i) {
    Ri[i] = Math.random();
}

let Zi = [];
for(let i = 0; i < amount_numbers; ++i) {
    Zi[i] = -1.0 / lambda * Math.log(Ri[i]);
}

let Tk = [];
{
    let k = 1;
    do {
        let sum_Zi = 0;
        for(let i = 1; i <= k; ++i) {
            sum_Zi += Zi[i-1];
        }
        let Tk_current = T1 + sum_Zi;
        if (Tk_current > T2) break;
        else Tk.push(Tk_current);
        ++k;
    } while (true);
}

let target = $('#main-table tbody');
for(let i = 0; i < Ri.length; ++i) {
    let ri = Ri[i];
    let zi = Zi[i];
    let ti = (i < Tk.length)?Tk[i]:-1;

    let str = `<tr>` +
        `<td>${i}</td>` +
        `<td>${ri}</td>` +
        `<td>${zi}</td>`;
    if(ti>0) str += `<td>${ti}</td>`;
    else str += `<td></td>`;
    str += `</tr>`;

    target.append(str);
}


let amount_line_segments = 25;
let Xtau = [];
let tau = (T2 - T1) / amount_line_segments;
for(let i = T1; i < T2; i+=tau) {
    let amount = 0;
    for (let j = 0; j < Tk.length; ++j) {
        if ((i <= Tk[j]) && ((i + tau) > Tk[j])) ++amount;
    }
    Xtau.push(amount);
}

str = "";
for(let i = 1; i <= amount_line_segments; ++i) {
    str += `<td>${i}</td>`;
}
target = $("#xtau-table .number");
target.append(str);

str = "";
for(let i = 0; i < amount_line_segments; ++i) {
    str += `<td>${Xtau[i]}</td>`;
}
target = $("#xtau-table .xtau");
target.append(str);

//----------------------------------

let numbers = [];
Xtau.forEach(function(number) {
    if (numbers.indexOf(number) === -1) {
        numbers.push(number);
    }
});
numbers.sort();

let number_amount = new Map();

numbers.forEach(function (number) {
    let amount = 0;
    Xtau.forEach(function (number_2) {
       if(number === number_2) ++amount;
    });
    number_amount.set(number, amount);
});

// ------------------------

target = $("#count_numbers");
number_amount.forEach(function (value, key) {
    str = `Number ${key}: ${value}<br>`;
    let text = target.html();
    text += str;
    target.html(text);
});


let a = -999;
let sum = 0;
number_amount.forEach(function (value, key) {
    sum += value*key;
});
a = 1.0 / amount_line_segments * sum;
target = $(".result");
target.append(`<p>a: ${a}</p>`);

let _lambda = a / tau;
target.append(`<p>_lambda: ${_lambda}</p>`);

//--------------------------

target = $(".result-lambda h4");

let P0 = Pnt(0, lambda, T);
target.after(`<p>P<small>0</small>: ${P0}</p>`);

let P1 = Pnt(1, lambda, T);
target.after(`<p>P<small>1</small>: ${P1}</p>`);

let P4 = Pnt(4, lambda, T);
target.after(`<p>P<small>4</small>: ${P4}</p>`);

let Pb5 = 1 - sum_Pnt_interv(lambda, T, 0, 1, 2, 3, 4);
target.after(`<p>P<small>>=5</small>: ${Pb5}</p>`);

let Pl3 = sum_Pnt_interv(lambda, T, 0, 1, 2);
target.after(`<p>P<small><3</small>: ${Pl3}</p>`);

let Pl7 = sum_Pnt_interv(lambda, T, 0, 1, 2, 3, 4, 5, 6, 7);
target.after(`<p>P<small><=7</small>: ${Pl7}</p>`);

let P_last = Fk(lambda, 0.5) - Fk(lambda, 0.1);
target.after(`<p>P [0.1 < z < 0.5]: ${P_last}</p>`);

// ---------------------

target = $(".result-_lambda h4");
P0 = Pnt(0, _lambda, T);
target.after(`<p>P<small>0</small>: ${P0}</p>`);

P1 = Pnt(1, _lambda, T);
target.after(`<p>P<small>1</small>: ${P1}</p>`);

P4 = Pnt(4, _lambda, T);
target.after(`<p>P<small>4</small>: ${P4}</p>`);

Pb5 = 1 - sum_Pnt_interv(_lambda, T, 0, 1, 2, 3, 4);
target.after(`<p>P<small>>=5</small>: ${Pb5}</p>`);

Pl3 = sum_Pnt_interv(_lambda, T, 0, 1, 2);
target.after(`<p>P<small><3</small>: ${Pl3}</p>`);

Pl7 = sum_Pnt_interv(_lambda, T, 0, 1, 2, 3, 4, 5, 6, 7);
target.after(`<p>P<small><=7</small>: ${Pl7}</p>`);

P_last = Fk(_lambda, 0.5) - Fk(_lambda, 0.1);
target.after(`<p>P [0.1 < z < 0.5]: ${P_last}</p>`);

/**
 * @return {number}
 */
function Fk(lambda, t) {
    return 1 - Math.exp(-1.0 * lambda * t);
}
//
/**
 * @return {number}
 */
function Pnt(n, lambda, t) {
    return Math.exp(-lambda * t) * Math.pow(lambda * t, n) / fac(n);
}

function sum_Pnt_interv(lambda, t, ... ns) {
    let sum = 0;
    for (let i = 0; i < ns.length; ++i) {
        sum += Pnt(ns[i], lambda, t);
    }
    return sum;
}

function fac(numb) {
    let res = 1;
    for (let i = numb; i > 1; i--) res *= i;
    return res;
}