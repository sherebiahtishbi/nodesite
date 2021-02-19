$(document).ready(function () {
    console.log('meditation page is ready!');
    $(".st-meditation-edit").on('click', handleNotes)
    $("#btnDateRange").on('click', handleDateRange)
    $("#divScriptureContent .form-control").on('keyup', handleTextareaKeys)
    $("#btnImport").on('click', importNotes)
    $(".dt-picker").datepicker({
        inline: true
    });
    // updateAccessLog()
})

function updateAccessLog() {
    let postData = { page: 'Meditations' }

    $.post('/logs/save', postData).done((data) => {
        console.log('POST note: got data back!')
        console.log(data);
    }).fail((err) => {
        console.log(err);
    });
}

function handleNotes(e) {
    console.log($(this));

    let divId = $(this).attr('id').replace('a_', '#div_');
    let spanId = $(this).attr('id').replace('a_', '#span_');
    let textId = $(this).attr('id').replace('a_', '#text_');
    $(divId).toggleClass('st-show st-hide');
    if ($(divId).hasClass('st-hide')) {
        console.log('Original Text > ' + $(spanId).text())
        console.log('Modified Text > ' + $(textId).val())
        if ($(spanId).text() != $(textId).val()) {
            console.log('notes changed!')
            let version = $(this).attr('id').replace('a_', '#hid_');
            let book = $(this).attr('id').replace('a_', '#book_');
            let chapter = $(this).attr('id').replace('a_', '#chapter_');
            let verse = $(this).attr('id').replace('a_', '#verse_');

            let versionid = $(version).val();
            let bookid = $(book).text();
            let chapterid = $(chapter).text();
            let versenumber = $(verse).text();
            let route = "/bible/savenotes/" + versionid + "/" + bookid + "/" + chapterid + "/" + versenumber;

            console.log(route)

            let postData = { note: $(textId).val() }

            $.post(route, postData).done((data) => {
                console.log('POST note: got data back!')
                console.log(data);
                $(spanId).html(data.note.note);
            }).fail((err) => {
                console.log(err);
            });
        }
        else {
            console.log('notes didnt change!');
        }
    } else {
        $(textId).focus();
    }
}

function handleDateRange() {
    let startDate = new Date($("#txtStartDt").val()).toDateString();
    let endDate = new Date($("#txtEndDt").val()).toDateString();
    console.log(startDate + ' - ' + endDate);
    let route = "/meditation/filter/" + startDate + "/" + endDate;
    window.location.href = route;
}

function handleTextareaKeys(e) {
    if (e.key === 'Escape') {
        if ($(e.currentTarget.parentElement).hasClass('st-show')) {
            $(e.currentTarget.parentElement).toggleClass('st-show st-hide')
        }
    }
}

function importNotes() {
    $.getJSON('/js/old-notes.json')
        .then((data) => {
            var noteArray = []
            $.getJSON('/js/books.json')
                .then((books) => {
                    console.log(books)
                    processOldNotes(data.notes, books)
                        .then((data) => {
                            console.log("Done!")
                        })
                        .catch((err) => {
                            console.error("Error!")
                        })
                    console.log(noteArray)
                })
                .catch((err) => {
                    console.error(err)
                })
        })
        .catch((err) => {
            console.error(err)
        })
}

function processOldNotes(notes, books) {
    notes.forEach(oldnote => {
        console.log(oldnote)
        mapData(oldnote, books)
            .then((note) => {
                console.log(note)
            }).catch((err) => {
                console.error(err)
            })
    })
}


function mapData(note, books) {
    return new Promise((resolve, reject) => {
        let newnote = {}
        newnote.version = "de4e12af7f28f599-01"
        books.books.forEach(book => {
            if (book.name == note.bookname) {
                newnote.book = book.id
            }
        })
        newnote.chapter = newnote.book + "." + note.chapterid
        newnote.verse = note.verseid
        newnote.note = note.versecomment
        if (newnote.book == '') {
            reject('Error')
        } else {
            saveNewNote(newnote).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })

        }
    })
}

function saveNewNote(note) {
    return new Promise((resolve, reject) => {
        let route = "/bible/savenotes/" + note.version + "/" + note.book + "/" + note.chapter + "/" + note.verse
        let postData = { "note": note.note }
        $.post(route, postData).then((data) => {
            console.log(data)
            resolve(data)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}



