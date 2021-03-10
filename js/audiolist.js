$(document).ready(function () {
    $("#txtSearchSpeaker").on('input', filterSpeakers)
    $("#tblSpeakers tbody td").on('click', listSermons)
    $("#tblTopics tbody td").on('click', listSermons)
    $("#tblScripture tbody td").on('click', listSermons)
    $("#divAlphabet a").on('click', loadData)
})

function loadData(e) {
    console.log(e)
    var route = "/audio/" + e.currentTarget.innerText
    window.location.href = route;
}

$("#aSpeaker").click(e => {
    $('#hidTab').text('Speaker')
})

$("#aTopic").click(e => {
    $('#hidTab').text('Topic')
})

$("#aScripture").click(e => {
    $('#hidTab').text('Scripture')
})

function filterSpeakers(e) {
    let str = $(this).val()
    $("#tblSpeakers tbody tr").each((index, row) => {
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}

function listSermons(e) {
    e.preventDefault()
    // let indexFrom = e.target.dataset.href.lastIndexOf('/') + 1
    let route = '/audio/sermons' + e.target.dataset.href.replace('.json', '')  //.substring(indexFrom)
    console.log(route)
    window.location.href = route
}