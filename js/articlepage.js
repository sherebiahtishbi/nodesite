// const article = require("../models/article")

$(document).ready(function () { 
    $("#articleText").on('input', updatePreview)
    $("#btnSubmit").on('click', submitForm)
    $("#tblArticles tr td .st-article-summary").each((index,container) => { 
        let markdown = $(container).html()
        let html = marked(markdown.trim())
        $(container).html(html)
    })
    if (window.location.href.indexOf('show') >= 0) showArticle()
    updateAccessLog('Diary')
})

function updateAccessLog(pagename) {
    let postData = { page: pagename }

    $.post('/logs/save', postData).done((data) => {
        console.log('POST note: got data back!')
        console.log(data);
    }).fail((err) => {
        console.log(err);
    });
}

function showArticle() { 
    if ($("#divArticleOriginal") == 'undefined') return;
    let originalContent = $("#divArticleOriginal").html()
    if (originalContent == '') return;
    console.log("Content : " + originalContent)
    $("#prvwArticle").html(marked(originalContent.trim()))
    console.log($('.st-page-title h4').text().trim())
    updateAccessLog('Diary > ' + $('.st-page-title h4').text().trim())
}

function updatePreview(e) {
    if ($(this).val() == '') return;
    let content = $(this).val()
    $("#prvwArticle").html(marked(content.trim()))
}

function submitForm(e) {
    e.preventDefault()
    let form = $("#frmArticle")
    let formData = form.serialize()
    let url = form.attr('action')
    console.log(formData)
    try {
        $.post(url, formData, (res) => { 
            console.info('Data saved successfully!')
        })
    } catch (err) {
        console.error(err)
    }
}