const STORAGE = "on-page-add-note-chrome-ext";
const BTN_ID = "on-page-add-note-chrome-ext-btn";
const NOTE_ID = "on-page-add-note-chrome-ext-note-";

let NOTE_COUNTER = 0;

const BTN_STYLE = `position: fixed;top: 10px;right: 10px;color: #fff;z-index: 99999;background: transparent;border: none;font-size: 35px;`;
const NOTE_STYLE = `position: fixed;z-index: 99999999;top: 30px;right: 50px;height: 200px;width: 200px;background: orange;font-size: 20px;color: black;padding: 10px;overflow: auto;resize: auto;border: 1px solid #ccc;box-shadow: 1px 1px 10px #ccc;`;

const BTN = document.createElement("BUTTON");
// const NOTE = document.createElement("DIV");

BTN.id = BTN_ID;
BTN.innerHTML = "⌨";                   // Insert text
BTN.style = BTN_STYLE;

const [HREF] = location.href.split("?");

const position = {
    left: 0,
    top: 0
}

// NOTE.id = NOTE_ID;


let data = window.localStorage.getItem(STORAGE);
if (data) {
    data = JSON.parse(data);
    data = data[HREF] || {};
    NOTE_COUNTER = Object.keys(data).length;
    let counter = 0;
    for (key in data) {
        const NOTE = createNote();
        NOTE.id = key;
        const [P] = NOTE.getElementsByTagName('p');
        P.innerText = data[key];
        NOTE.style.top = (++counter * 20) + 'px';
        document.body.appendChild(NOTE);
    }

} else {
    data = {}
}

const onDrag = e => {
    if (e.clientY) {
        e.target.style.top = e.clientY + 'px';
    }

    if (e.clientX) {
        e.target.style.left = e.clientX + 'px';
    }
}

const onDrop = e => {
    console.log(e);
}

const onDelete = (e, NOTE) => {
    NOTE.remove();
    delete data[e.target.parentElement.id];
    const s = JSON.parse(window.localStorage.getItem(STORAGE) || "{}");
    s[HREF] = data;
    localStorage.setItem(STORAGE, JSON.stringify(s));
}

function onNoteUpdate(e) {
    data[e.target.parentElement.id] = e.target.innerText;

    const s = JSON.parse(window.localStorage.getItem(STORAGE) || "{}");
    s[HREF] = data;
    localStorage.setItem(STORAGE, JSON.stringify(s));

}

function createNote() {
    const DELETE = document.createElement("BUTTON");
    const P = document.createElement("P");
    P.autofocus = true;
    DELETE.innerText = "☒";
    const NOTE = document.createElement("DIV");
    NOTE.draggable = true;
    NOTE.appendChild(DELETE);
    NOTE.appendChild(P);
    NOTE.style = NOTE_STYLE;
    P.contentEditable = true;
    P.style = "width: 100%;min-height: calc( 100% - 40px );position: absolute;top: 40px;left: 0px;padding: 0px 10px 10px;margin: 0px;box-sizing: border-box;"
    NOTE.addEventListener("keyup", onNoteUpdate);

    DELETE.addEventListener("click", e => onDelete(e, NOTE));
    return NOTE;
}


BTN.addEventListener("click", () => {
    const NOTE = createNote();
    NOTE.id = NOTE_ID + ++NOTE_COUNTER;
    document.body.appendChild(NOTE);
    document.getElementById(NOTE.id).addEventListener("drag", onDrag);
    document.getElementById(NOTE.id).addEventListener("drop", onDrop);

})

document.body.appendChild(BTN);



document.querySelectorAll("[id*=on-page-add-note-chrome-ext-note-]").forEach(elm => {
    elm.addEventListener("drag", onDrag);
})