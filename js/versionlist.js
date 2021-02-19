$(document).ready(function () {
    console.log('page is ready!');

    $("#txtSearch").on('input', applySearch);
    $('tbody input[type="checkbox"]').on('change',setDefaultVersion);
});

function matchFound(row, str) {
    retVal = true;
    if (row.cells[1].innerText.toLowerCase().indexOf(str.toLowerCase()) < 0)
        retVal = false;
    return retVal;
}

function applySearch(e) {
    let str = e.currentTarget.value;
    console.log(str)
    $("#tblVersion tbody tr").each((index, row) => {
        console.log(row);
        (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
    });
}

function setDefaultVersion(e) { 
    let versionid = e.currentTarget.parentElement.nextElementSibling.children[1].value;
    $("input[type=checkbox]").not(this).prop('checked', false)
    let appSettingRoute = "/appsettings/updatesetting/";
    $.post(appSettingRoute, { key: 'defaultVersion', value: versionid }, function (result) {
        console.log(result)
    });
}
