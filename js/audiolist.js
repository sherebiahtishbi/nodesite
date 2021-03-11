$(document).ready(function () {
    $("#txtSearchSpeaker").on('input', filterSpeakers)
    $("#txtSearchTopic").on('input', filterTopics)
    $("#txtSearchScripture").on('input', filterScriptures)
    $("#tblSpeakers tbody td").on('click', listSermons)
    $("#tblTopics tbody td").on('click', listSermons)
    $("#tblScripture tbody td").on('click', listSermons)
    $("#divAlphabet a").on('click', loadData)
    setActiveTab()
})

//sets the clicked tab as an active tab to a hidden variable to be resued in the routes
$("#aSpeaker").click(e => { $('#hidTab').val('speaker') })
$("#aTopic").click(e => { $('#hidTab').val('topic') })
$("#aScripture").click(e => { $('#hidTab').val('scripture') })

function setActiveTab() {
    var activeTab = $('#hidTab').val()
    if (activeTab == "") {
        activeTab = "speaker"
        $('#hidTab').val(activeTab)
    }
    switch (activeTab) {
        case 'speaker':
            $("#aSpeaker").addClass('active')
            $("#aTopic").removeClass('active')
            $("#aScripture").removeClass('active')
            $("#divSpeakers").addClass('active show')
            $("#divTopics").removeClass('active show')
            $("#divScriptures").removeClass('active show')
            break;
        case 'topic':
            $("#aSpeaker").removeClass('active')
            $("#aTopic").addClass('active')
            $("#aScripture").removeClass('active')
            $("#divSpeakers").removeClass('active show')
            $("#divTopics").addClass('active show')
            $("#divScriptures").removeClass('active show')
            break;
        case 'scripture':
            $("#aSpeaker").removeClass('active')
            $("#aTopic").removeClass('active')
            $("#aScripture").addClass('active')
            $("#divSpeakers").removeClass('active show')
            $("#divTopics").removeClass('active show')
            $("#divScriptures").addClass('active show')
            break;
        default:
            $("#aSpeaker").addClass('active')
            $("#aTopic").removeClass('active')
            $("#aScripture").removeClass('active')
            $("#divSpeakers").addClass('active show')
            $("#divTopics").removeClass('active show')
            $("#divScriptures").removeClass('active show')
            break;
    }
}

function loadData(e) {
    var route = "/audio/" + e.currentTarget.innerText + "/" + $('#hidTab').val()
    window.location.href = route;
}

function filterSpeakers(e) {
    let str = $(this).val()
    $("#tblSpeakers tbody tr").each((index, row) => {
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}

function filterTopics(e) {
    let str = $(this).val()
    $("#tblTopics tbody tr").each((index, row) => {
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}

function filterScriptures(e) {
    let str = $(this).val()
    $("#tblScripture tbody tr").each((index, row) => {
        (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0) ? row.hidden = true : row.hidden = false;
    })
}

function listSermons(e) {
    e.preventDefault()
    let route = '/audio/sermons' + e.target.dataset.href.replace('.json', '') + "/" + $("#hidAlphabet").val()
    console.log(route)
    window.location.href = route
}