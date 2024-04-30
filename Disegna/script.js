const canvas = document.querySelector("canvas"),
strumentiBtns = document.querySelectorAll(".tool"),
riempiColore = document.querySelector("#fill-color"),
cursoreDimensione = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
pulisciCanvas = document.querySelector(".clear-canvas"),
salvaImmagine = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
strumentoSelezionato = "pennello",
dimensionePennello = 5,
coloreSelezionato = "#000";

const impostaSfondoCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = coloreSelezionato;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    impostaSfondoCanvas();
});

const disegnaRettangolo = (e) => {
    if(!riempiColore.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const disegnaCerchio = (e) => {
    ctx.beginPath(); 
    let raggio = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, raggio, 0, 2 * Math.PI); 
    riempiColore.checked ? ctx.fill() : ctx.stroke(); 
}

const disegnaTriangolo = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    riempiColore.checked ? ctx.fill() : ctx.stroke();
}

const iniziaDisegno = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = dimensionePennello;
    ctx.strokeStyle = coloreSelezionato;
    ctx.fillStyle = coloreSelezionato;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const disegno = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if(strumentoSelezionato === "gomma" || strumentoSelezionato === "pennello") {
        ctx.strokeStyle = strumentoSelezionato === "gomma" ? "#fff" : coloreSelezionato;
        ctx.lineTo(e.offsetX, e.offsetY); 
        ctx.stroke();
    } else if(strumentoSelezionato === "rettangolo"){
        disegnaRettangolo(e);
    } else if(strumentoSelezionato === "cerchio"){
        disegnaCerchio(e);
    } else {
        disegnaTriangolo(e);
    }
}

strumentiBtns.forEach(btn => {
    btn.addEventListener("click", () => { 
        document.querySelectorAll(".option.tool").forEach(toolBtn => toolBtn.classList.remove("selected"));
        btn.classList.add("selected");
        strumentoSelezionato = btn.id;
    });
});


cursoreDimensione.addEventListener("change", () => dimensionePennello = cursoreDimensione.value);
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { 
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        coloreSelezionato = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

pulisciCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    impostaSfondoCanvas();
});

salvaImmagine.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click(); 
});

canvas.addEventListener("mousedown", iniziaDisegno);
canvas.addEventListener("mousemove", disegno);
canvas.addEventListener("mouseup", () => isDrawing = false);
