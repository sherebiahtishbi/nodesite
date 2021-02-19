$(document).ready(function () { 
    $("#txtSearch").on('input',applySearch)
})

function applySearch() {
    let str = $(this).val()
    $("#tblSermons tbody tr").each((index, row) => {
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}