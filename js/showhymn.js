$(document).ready(function () { 
    console.log('Showhymn page is ready!');
    $("#aAuthor").on('click', toggleAuthorBiography);
    $("#btnCloseAuthor").on('click', toggleAuthorBiography);
});

function toggleAuthorBiography(e) {
    if (e.currentTarget.href != undefined) e.preventDefault();
    $("#divAuthor").toggleClass('st-hide st-show');
    $("#divHymn").toggleClass('st-hide st-show');
}

