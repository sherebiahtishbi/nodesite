$(document).ready(function () {
    $("#txtCredSearch").on('input', (e) => {
        let str = e.currentTarget.value;
        console.log(str)
        $("#tblCreds tbody tr").each((index, row) => {
            console.log(row);
            (matchFound(row, str)) ? row.hidden = false : row.hidden = true;
        });
    });
    $("#aPwd").hide();
    $("#aPwd").on('click', showPassword());
    $("#aDots").on('click', showPassword());
});

function matchFound(row, str) {
    retVal = false;
    if (row.cells[0].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        row.cells[1].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        row.cells[2].innerText.toLowerCase().indexOf(str.toLowerCase()) >= 0)
        retVal = true;
    return retVal;
}

function showPassword(e) {
    // if (visible) {
    //     $("#aPwd").show();
    //     $("#aDots").hide();
    // } else {
    //     $("#aPwd").hide();
    //     $("#aDots").show();
    // }
}