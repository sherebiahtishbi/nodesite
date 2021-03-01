$(document).ready(() => {
    $("#ddfilter").on('change', refreshData)
    refreshData()
    $(".st-lastyear").hide()
});

/*
 Function to refresh data 
 Calls below functions 
      prepareHtml()
      prepareIncomeHtml()
*/
function refreshData(e) {
    let year = $("#ddfilter").val()
    // year = (year == 'Current') ? new Date().getFullYear() : $(this).val()
    // year = '2020'
    console.log(year)
    let route = '/finance/billpay/billpaydata/' + $("#ddfilter").val()
    $.getJSON(route).done((data) => {
        console.log(data)
        if (data.payments.length > 0) {
            prepareHtml(year, data.payments, data.lastyearpayments, data.vendors)
        } else {
            //TODO show empty table even when data doesn't exist
            $("#tblBillpay tbody").html("<h4>No Payment Data to Show</h4>")
        }

    }).catch((err) => {
        console.log('ERROR refresh income data refreshData(): ' + err)
    })
    let incomeroute = '/finance/income/incomedata/' + $("#ddfilter").val()
    $.getJSON(incomeroute).done((data) => {
        console.log(data)
        if (data.incomes.length > 0) {
            prepareIncomeHtml(year, data.incomes, data.lastyearincomes, data.incometypes)
        } else {
            //TODO show empty table even when data doesn't exist
            $("#tblIncome tbody").html("<h4>No Income Data to Show</h4>")
        }
    }).catch((err) => {
        console.log('ERROR refresh income data refreshData(): ' + err)
    })

}

$("#chkShowlastyear").on('change', (e) => {
    e.currentTarget.checked ? $(".st-lastyear").show() : $(".st-lastyear").hide()
})

//prepares HTML table for all bill payments
function prepareHtml(year, payments, lastyearpayments, vendors) {
    try {
        var rowhtml = '', tdhtml = '', rowtotal = ''
        var totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var grandtotal = 0
        var showLastyear = $("#chkShowlastyear").is(':checked')
        vendors.forEach((vendor) => {
            rowhtml += '<tr><td>'
            rowhtml += '<a href="/finance/vendor/edit/' + vendor._id + '" '
            rowhtml += 'data-container="body" data-toggle="popover" data-content="'
            rowhtml += vendor.comments
            rowhtml += '">' + vendor.vendorname + '</a></td>'
            for (month = 0; month < 12; month++) {
                tdhtml = ''
                montotal = 0
                payments.every((payment) => {
                    if (payment.paymonth - 1 == month && payment.vendor == vendor._id) {
                        if (payment.amount >= 0) {
                            //TODO if comments exist show some visual that it exists
                            tdhtml += '<td class="st-td-right'
                            if (payment.comments != '') {
                                tdhtml += ' st-td-comment'
                            }
                            if (!payment.includeintotal) {
                                tdhtml += ' st-payment-notincluded'
                            }
                            tdhtml += '">'
                            tdhtml += '<a href="/finance/billpay/edit/' + payment._id + '" '
                            tdhtml += 'data-container="body" data-toggle="popover" data-content="'
                            tdhtml += payment.comments
                            tdhtml += '">'
                            tdhtml += payment.amount.toFixed(2) + '</a>'
                            // if (showLastyear) {
                            tdhtml += getLastYearPayment(lastyearpayments, vendor._id, month)
                            // }
                            tdhtml += '</td>'
                            if (payment.includeintotal) {
                                totals[month] += payment.amount
                                grandtotal += payment.amount
                            }
                        } else {
                            tdhtml += '<td class="st-td-right">'
                            tdhtml += '<a href="/finance/billpay/add/' + vendor._id + '|' + payment.payyear + '|' + (month + 1) + '">-</a></td >'
                        }
                        return false;
                    } else {
                        return true;
                    }
                })
                if (tdhtml == '') {
                    tdhtml += '<td class="st-td-right">'
                    tdhtml += '<a href="/finance/billpay/add/' + vendor._id + '|' + $("#ddfilter").val() + '|' + (month + 1) + '">-</a></td >'
                }
                rowhtml += tdhtml
            }
            rowhtml += '</tr>'
        })

        rowhtml += "<tr class='st-footer-payment'><td><b>Total Expenses</b></td>"
        for (i = 0; i < 12; i++) {
            rowhtml += "<td class='st-td-right'><b>" + totals[i].toFixed(2) + "</b></td>"
        }
        rowhtml += "</tr>"

        $("#tblBillpay tbody").html(rowhtml)
        $('#spanPayment').html(formatter.format(grandtotal))
        setPopovers();
        $(".st-lastyear").hide()
    } catch (e) {
        console.log(e)
    }
}

//returns the last year payment data for the given vendor and a month
function getLastYearPayment(lastyearpayments, vendorid, month) {
    var html = '<div class="st-lastyear st-lastyear-data">'
    var val = 0
    lastyearpayments.forEach(payment => {
        if (payment.vendor == vendorid && payment.paymonth - 1 == month) {
            val = payment.amount
        }
    })
    html += (val >= 0) ? val.toFixed(2) : '0.00'
    html += '</div>'
    return html;
}

// prepares HTML table for all incomes
function prepareIncomeHtml(year, incomes, lastyearincomes, incometypes) {
    try {
        var rowhtml = '', tdhtml = '', rowtotal = ''
        var totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var grandtotal = 0
        console.log('Incomes')
        var showLastyear = $("#chkShowlastyear").is(':checked')
        // console.log(incomes)
        incometypes.forEach((incometype) => {
            rowhtml += '<tr><td width="10%">'
            rowhtml += '<a href="/finance/expensecategory/edit/' + incometype._id + '" '
            rowhtml += 'data-container="body" data-toggle="popover" data-content="'
            rowhtml += incometype.comment
            rowhtml += '">' + incometype.categoryName + '</a></td>'
            for (month = 0; month < 12; month++) {
                tdhtml = ''
                montotal = 0
                incomes.every((income) => {
                    if (income.incomemonth - 1 == month && income.incometype == incometype._id) {
                        if (income.amount > 0) {
                            if (income.comments == '') {
                                tdhtml += '<td width="5%" class="st-td-right">'
                            } else {
                                tdhtml += '<td width="5%" class="st-td-right st-td-comment">'
                            }
                            tdhtml += '<a href="/finance/income/edit/' + income._id + '" '
                            tdhtml += 'data-container="body" data-toggle="popover" data-content="'
                            tdhtml += income.comments
                            tdhtml += '">'
                            tdhtml += income.amount.toFixed(2) + '</a>'
                            // if (showLastyear) {
                            tdhtml += getLastYearIncome(lastyearincomes, incometype._id, month)
                            // }
                            tdhtml += '</td>'
                            totals[month] += income.amount
                            grandtotal += income.amount
                        } else {
                            tdhtml += '<td  width="5%" class="st-td-right">'
                            tdhtml += '<a href="/finance/income/add/' + incometype._id + '|' + income.incomeyear + '|' + (month + 1) + '">-</a></td >'
                        }
                        return false;
                    } else {
                        return true;
                    }
                })
                if (tdhtml == '') {
                    tdhtml += '<td  width="5%" class="st-td-right">'
                    tdhtml += '<a href="/finance/income/add/' + incometype._id + '|' + $("#ddfilter").val() + '|' + (month + 1) + '">-</a></td >'
                }
                rowhtml += tdhtml
            }
            rowhtml += '</tr>'
        })

        rowhtml += "<tr class='st-footer-income'><td  width='10%' ><b>Total Income</b></td>"
        for (i = 0; i < 12; i++) {
            rowhtml += "<td  width='5%' class='st-td-right'><b>" + totals[i].toFixed(2) + "</b></td>"
        }
        rowhtml += "</tr>"

        $("#tblIncome tbody").html(rowhtml)
        $('#spanIncome').html(formatter.format(grandtotal))
        setPopovers();
        $(".st-lastyear").hide()
    } catch (e) {
        console.log(e)
    }
}

//returns the last year income data for the given vendor and a month
function getLastYearIncome(lastyearincome, incometype, month) {
    var html = '<div class="st-lastyear st-lastyear-data">'
    var val = 0
    lastyearincome.forEach(income => {
        if (income.incometype == incometype && income.incomemonth - 1 == month) {
            val = income.amount
        }
    })
    html += (val >= 0) ? val.toFixed(2) : '0.00'
    html += '</div>'
    return html;
}

//sets all popovers
function setPopovers() {
    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        offset: 100,
        placement: 'auto',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    })
}

//Currency formatter
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

//Searches the table with the matching text user enteres in search box
$("#txtSearch").on('input', (e) => {
    let str = e.currentTarget.value;
    console.log(str)
    $("#tblBillpay tbody tr").each((index, row) => {
        console.log(row);
        (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
    });
    $("#tblIncome tbody tr").each((index, row) => {
        console.log(row);
        (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
    });
});

$("#txtThreshold").on('input', (e) => {
    let val = parseInt(e.currentTarget.value);
    console.log(val)
    $("#tblBillpay td").each((index, cell) => {
        console.log(cell);
        if (cell.cellIndex != 0 && val > 0 && parseInt(cell.innerText) > val) {
            cell.classList.add("st-payment-highlight")
        } else {
            cell.classList.remove("st-payment-highlight")
        }
    });
    $("#tblIncome td").each((index, cell) => {
        console.log(cell);
        if (cell.cellIndex != 0 && val > 0 && parseInt(cell.innerText) > val) {
            cell.classList.add("st-payment-highlight")
        } else {
            cell.classList.remove("st-payment-highlight")
        }
    });
});



function matchFound(row, str) {
    for (cell = 0; cell <= 12; cell++) {
        if (row.cells[cell].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0) {
            return true;
        }
    }
    return false;
}
