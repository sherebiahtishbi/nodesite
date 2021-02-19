$(document).ready(function () {
    console.log('scripture page is ready!');
    let passageText = $('div.st-raw-content').html();
    var existingNote = $("#existingNote");
    if (passageText != '') {
        processPassage(passageText);    
    }
});

function processPassage(passage) {
    let verses = passage.split('<span data');

    let versionid = $('#hidVersion').val();
    let bookid = $('#hidBook').val();
    let chapterid = $('#hidChapter').val();

    let route = "/bible/getnotes/" + versionid + "/" + bookid + "/" + chapterid
    $.getJSON(route).done((data) => { 
        prepareHtml(verses, data.notes)
        $("#tblScripture span.st-vcomment").on('click',openComment);
        $("#tblScripture span.st-edit-note").on('click', editNote);
    }).catch((err) => { 
        console.log('ERROR processPassage(): ' + err)
    })
}

function prepareHtml(verses, notes) {

    let html = ''
    let versionid = $('#hidVersion').val();
    let bookid = $('#hidBook').val();
    let chapterid = $('#hidChapter').val();

    verses.forEach((verse, index) => {
        verse = verse.replace(/<p><\/p>/g, '');
        if (index == 0 && verse.indexOf('-number') < 0) {
            html = "<tr><td>" + verse + "</td></tr>";
        } else {
            let vNote = ''
            notes.forEach((note) => {
                if (index == note.verse) {
                    vNote = note.note
                }
            })

            let editIcon
            (vNote == "") ? editIcon = "<i class='far fa-comment'></i>" : editIcon = "<i class='fas fa-comment'></i>"

            let actualVerse = (verse.indexOf('-number') >= 0) ? '<span data' + verse : verse;

            let insertAt = actualVerse.lastIndexOf('</p>');
            if (insertAt >= 0) {
                actualVerse = actualVerse.substring(0, insertAt) + "<span class='st-vcomment' data-version='" + versionid + "' data-book='" + bookid + "' data-chapter='" + chapterid + "'  data-versenumber='" + index + "'>"+ editIcon +"</span>" + actualVerse.substring(insertAt);
                // actualVerse = actualVerse.substring(0, insertAt) + "<a href='' id='vcomment' data-version='" + versionid + "' data-book='" + bookid + "' data-chapter='" + chapterid + "'  data-versenumber='" + index + "'><i class='far fa-comment'></i></a>" + actualVerse.substring(insertAt);
            } else {
                actualVerse = actualVerse + "<span class='st-vcomment' data-version='" + versionid + "' data-book='" + bookid + "' data-chapter='" + chapterid + "' data-versenumber='" + index + "'>"+ editIcon +"</span>";
                // actualVerse = actualVerse + "<a href='' id='vcomment' data-version='" + versionid + "' data-book='" + bookid + "' data-chapter='" + chapterid + "' data-versenumber='" + index + "'><i class='far fa-comment'></i></a>";
            }

            html += "<tr><td>";
            html += actualVerse;
            html += "<div id='" + index + "-comment' class='st-notes-hidden'>";
            html += "<div class='st-note-block'>";
            html += "<div class='st-note-heading'><span id='" + index + "-edit' class='st-edit-note'><i class='fas fa-edit'></i></span><small>Edit notes, once done click the same pencil icon to save it</small></div>"
            html += "<blockquote id='" + index + "-quote' class='blockquote st-blockquote st-notes-shown'>"+ vNote +"</blockquote>"
            html += "<form id='" + index + "-form'>";
            html += "<textarea id='" + index + "-textarea' rows='5' placeholder='Enter your notes' class='form-control st-notes-hidden' name='note'>"+ vNote +"</textarea>";
            html += "</form>";
            html += "</div>";
            html += "</div>";
            html += "</td></tr>";
        }
    })
    console.log(html);
    $("#tblScripture").html(html);
}

function openComment(e) {
    let baseId = '#' + $(this).attr('data-versenumber');

    let commentBoxId =  baseId + '-comment';
    let formId = baseId + '-form';
    let commentTextareaId = baseId + '-textarea';
    let quoteId = baseId + '-quote';
    let editId = baseId + '-edit'

    let commentBox = $(commentBoxId)
    let versionid = $('#hidVersion').val();
    let bookid = $('#hidBook').val();
    let chapterid = $('#hidChapter').val();
    let verse = commentBoxId.substring(1, commentBoxId.indexOf('-'));
    
    let route = "/bible/getnotes/" + versionid + "/" + bookid + "/" + chapterid + "/" + verse;

    if (commentBox.hasClass('st-notes-hidden')) {
        if ($(quoteId).text() == "") {
            $(commentTextareaId).toggleClass('st-notes-hidden st-notes-shown');
            $(quoteId).toggleClass('st-notes-hidden st-notes-shown');
        }
    }
    commentBox.toggleClass("st-notes-hidden st-notes-shown");
    let vRef = versionid + ',' + bookid + ',' + chapterid + ',' + verse
    updateAccessLog(vRef)
}

function updateAccessLog(vref) {
    let postData = { page: 'Bible:' + vref}

    $.post('/logs/save', postData).done((data) => {
        console.log('POST note: got data back!')
        console.log(data);
    }).fail((err) => {
        console.log(err);
    });
}

function editNote() {
    // alert('Edit note!')
    let baseId = '#' + $(this).attr('id');
    baseId = baseId.substring(0, baseId.indexOf('-'));
    console.log('baseId > ' + baseId);

    let commentBoxId = baseId + '-comment';
    let formId = baseId + '-form';
    let commentTextareaId = baseId + '-textarea';
    let quoteId = baseId + '-quote';
    let editId = baseId + '-edit'

    let commentBox = $(commentBoxId)
    let versionid = $('#hidVersion').val();
    let bookid = $('#hidBook').val();
    let chapterid = $('#hidChapter').val();
    let verse = baseId.substring(1);

    $(commentTextareaId).toggleClass('st-notes-hidden st-notes-shown');
    $(quoteId).toggleClass('st-notes-hidden st-notes-shown');

    if ($(commentTextareaId).hasClass('st-notes-hidden')) {
        let route = "/bible/savenotes/" + versionid + "/" + bookid + "/" + chapterid + "/" + verse;
        let postData = $(formId).serialize()

        if ($(quoteId).html() != $(commentTextareaId).val()) {
            console.log('Notes changed, need to save!');
            $.post(route, postData).done((data) => {
                console.log('POST note: got data back!')
                console.log(data);
                $(quoteId).html($(commentTextareaId).val());
                let verseRow = $(commentBox).parent();
                $('.st-vcomment', verseRow).html('<i class="fas fa-comment"></i>');
            }).fail((err) => {
                console.log(err);
            });
        } else {
            console.log('Note unchanged, no need to update.');
        }
    }
}