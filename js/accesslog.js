$(document).ready(function () {
    // console.log('page is ready!');
    $("#txtSdate").datepicker();
    $("#txtEdate").datepicker();

    refreshData($("#ddfilter").val())
});

function refreshData(params) {
    let route = '/logs/filter/' + params
    $.getJSON(route).done((data) => {
        console.log(data)
        if (data.logs.length > 0) {
            prepareHtml(data.logs)
        } else {
            $("#tblLogs tbody").html("<h4>No log data to Show</h4>")
        }
    }).catch((err) => {
        console.log('ERROR refresh log data refreshData(): ' + err)
    })
}

function prepareHtml(logs) {
    let rowHtml = ''
    logs.forEach(log => {
        //beginning of row
        rowHtml += "<tr>"

        //first cell
        rowHtml += "<td>"
        rowHtml += log.page
        rowHtml += "</td>"

        //second cell
        rowHtml += "<td>"
        rowHtml += log.client
        rowHtml += "</td>"

        //third cell
        rowHtml += "<td class='st-td-right'>"
        // rowHtml += log.accessDate.toString()
        // .substring(0, log.accessDate.toString().indexOf('GMT'))
        rowHtml += new Date(log.accessDate).toLocaleDateString("en-US",
            {
                year: 'numeric',
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        rowHtml += "</td>"

        //end of row
        rowHtml += "</tr>"
    })
    $("#tblLogs tbody").html(rowHtml)
}

$("#ddfilter").change(() => {
    refreshData($("#ddfilter").val())
})

$("#btnGo").click(() => {
    let dt1 = Date.parse($("#txtSdate").val())
    let dt2 = Date.parse($("#txtEdate").val())
    if (isNaN(dt1) || isNaN(dt2)) {
        alert('Error : Date raneg is invalid, please provide the correct dates.')
        return;
    }
    let params = $("#txtSdate").val() + '/' + $("#txtEdate").val()
    refreshData(params)
})


$("#txtLogSearch").on('input', (e) => {
    let str = e.currentTarget.value;
    console.log(str)
    $("#tblLogs tbody tr").each((index, row) => {
        console.log(row);
        (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
    });
});

function matchFound(row, str) {
    retVal = false;
    if (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        row.cells[1].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        row.cells[2].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0)
        retVal = true;
    return retVal;
}

async function formatdate(userDate) {
    let promise = new Promise((resolve, reject) => {
        var dt = new Date(userDate);
        y = dt.getFullYear().toString();
        m = dt.getMonth().toString();
        if (m.lenght == 1) m = '0' + m;
        d = dt.getDate().toString();
        if (d.lenght == 1) d = '0' + d;
        dt = m + '/' + d + '/' + y;
        resolve(dt);
    })
    return await promise;
}
