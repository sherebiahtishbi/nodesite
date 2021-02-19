$(document).ready(function () {
    $("#txtAuthorSearch").on('input', filterAuthors);
});

function filterAuthors(e) {
    let str = e.currentTarget.value;
    if (str != '') {
        $("#tblAuthors tbody tr").each((index, row) => {
            (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
        });        
    }
}

function matchFound(row, str) {
    retVal = false;
    if (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        row.cells[1].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0)
        retVal = true;
    return retVal;
}

