$(document).ready(function () { 
    $("#txtSearch").on('input', applySearch)
    $("#tblSpeakers tbody td").on('click', listSermons)
})

function applySearch(e) {
    let str = $(this).val()
    $("#tblSpeakers tbody tr").each((index,row) => { 
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}

function listSermons(e) {
    e.preventDefault()
    let indexFrom = e.target.dataset.href.lastIndexOf('/')+1
    let route = '/audio/sermons/' + e.target.dataset.href.substring(indexFrom)
    console.log(route)
    window.location.href = route
}