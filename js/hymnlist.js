$(document).ready(function () { 
    console.log('page is ready!');
    $("#txtHymnSearch").on('input', (e) => {
        let str = e.currentTarget.value;
        console.log(str)
        $("#tblHymns tbody tr").each((index,row) => {
            console.log(row);
            (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
        });
    });
});

function matchFound(row, str) {
    retVal = false;
    if (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        row.cells[1].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0)
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
