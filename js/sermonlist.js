$(document).ready(function () {
    $("#txtSearch").on('input', applySearch)
})

$("#aBackToSpeakers").click(e => {
    e.preventDefault()
    var params = e.currentTarget.href.split('/')
    var route = "/audio/" + params[7] + "/" + params[8]
    window.location.href = route
})

function applySearch() {
    let str = $(this).val()
    $("#tblSermons tbody tr").each((index, row) => {
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}