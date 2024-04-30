const mosse = document.getElementById("moves-count");
const tempoValore = document.getElementById("time");
const pulsanteInizia = document.getElementById("start");
const contenitoreGioco = document.querySelector(".game-container");
const risultato = document.getElementById("result");
const controlli = document.querySelector(".controls-container");
let elementiCanvas;
let intervallo;
let primaCarta = false;
let secondaCarta = false;

const oggetti = [
    { nome: "bibimbap", immagine: "images/bibimbap.png" },
    { nome: "piatto", immagine: "images/dish.png" },
    { nome: "ciambella", immagine: "images/donut.png" },
    { nome: "hamburger", immagine: "images/hamburger.png" },
    { nome: "pizza", immagine: "images/pizza.png" },
    { nome: "ramen", immagine: "images/ramen.png" },
    { nome: "insalata", immagine: "images/salad.png" },
    { nome: "spaghetti", immagine: "images/spaghetti.png" },
];

let secondi = 0, minuti = 0;

let conteggioMosse = 0, conteggioVittorie = 0;

const generatoreTempo = () => {
    secondi += 1;
    if (secondi >= 60) {
        minuti += 1;
        secondi = 0;
    }
    let valoreSecondi = secondi < 10 ? `0${secondi}` : secondi;
    let valoreMinuti = minuti < 10 ? `0${minuti}` : minuti;
    tempoValore.innerHTML = `<span>Tempo: </span>${valoreMinuti}:${valoreSecondi}`;
};

const aggiornaConteggioMosse = () => {
    conteggioMosse += 1;
    mosse.innerHTML = `<span>Mosse: </span>${conteggioMosse}`;
};

const generatoreCasuale = (dimensione = 4) => {
    let arrayTemporaneo = [...oggetti];
    let valoriCarta = [];
    dimensione = (dimensione * dimensione) / 2;
    for (let i = 0; i < dimensione; i++) {
        const indiceCasuale = Math.floor(Math.random() * arrayTemporaneo.length);
        valoriCarta.push(arrayTemporaneo[indiceCasuale]);
        arrayTemporaneo.splice(indiceCasuale, 1);
    }
    return valoriCarta;
};

const generatoreMatrice = (valoriCarta, dimensione = 4) => {
  contenitoreGioco.innerHTML = "";
  valoriCarta = [...valoriCarta, ...valoriCarta];
  valoriCarta.sort(() => Math.random() - 0.5);
  elementiCanvas = [];
  let canvasCapovolti = [];
  let controlloVerifica = false;
  let puoiCliccare = true;

  for (let i = 0; i < dimensione * dimensione; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      contenitoreGioco.appendChild(canvas);
      elementiCanvas.push(canvas);
      
      disegnaPuntoInterrogativoSuCanvas(canvas);
      canvas.classList.add("card-container");

      canvas.addEventListener("click", () => {
          if (!canvas.classList.contains("matched") && canvasCapovolti.length < 2 && puoiCliccare) {
              canvas.classList.add("flipped");
              const indice = elementiCanvas.indexOf(canvas);
              const valoreCarta = valoriCarta[indice];

              disegnaImmagineSuCanvas(canvas, valoreCarta.immagine);

              canvasCapovolti.push(canvas);

              if (canvasCapovolti.length === 2) {
                  controlloVerifica = true; 

                  const [canvas1, canvas2] = canvasCapovolti;
                  const indice1 = elementiCanvas.indexOf(canvas1);
                  const indice2 = elementiCanvas.indexOf(canvas2);
                  const valoreCarta1 = valoriCarta[indice1];
                  const valoreCarta2 = valoriCarta[indice2];

                  if (valoreCarta1.nome === valoreCarta2.nome) {
                      canvas1.classList.add("matched");
                      canvas2.classList.add("matched");
                      conteggioMosse += 1;
                      mosse.innerHTML = `<span>Mosse: </span>${conteggioMosse}`;
                      conteggioVittorie += 1;

                      if (conteggioVittorie === Math.floor(valoriCarta.length / 2)) {
                          risultato.innerHTML = `<h2>Hai Vinto!!!</h2><h4>Mosse: ${conteggioMosse}</h4>`;
                          interrompiGioco();
                      }
                  } else {
                      puoiCliccare = false; 
                      setTimeout(() => {
                          canvas1.classList.remove("flipped");
                          canvas2.classList.remove("flipped");
                          disegnaPuntoInterrogativoSuCanvas(canvas1);
                          disegnaPuntoInterrogativoSuCanvas(canvas2);
                          conteggioMosse += 1;
                          mosse.innerHTML = `<span>Mosse: </span>${conteggioMosse}`;
                          puoiCliccare = true;
                      }, 900);
                  }
                  canvasCapovolti = [];
              }
          }
      });
  }
  contenitoreGioco.style.gridTemplateColumns = `repeat(${dimensione}, auto)`;
};

function disegnaPuntoInterrogativoSuCanvas(canvas) {
  const contesto = canvas.getContext("2d");
  const larghezzaCanvas = canvas.width;
  const altezzaCanvas = canvas.height;

  const gradiente = contesto.createLinearGradient(0, 0, larghezzaCanvas, 0);

  gradiente.addColorStop(0, "#9FF781");  
  gradiente.addColorStop(1, "#F3F781");  

  contesto.fillStyle = gradiente;
  contesto.fillRect(0, 0, larghezzaCanvas, altezzaCanvas);

  contesto.fillStyle = "black";
  contesto.font = "50px Arial";
  contesto.textAlign = "center";
  contesto.textBaseline = "middle";
  contesto.fillText("?", larghezzaCanvas / 2, altezzaCanvas / 2);
}

function disegnaImmagineSuCanvas(canvas, urlImmagine) {
    const contesto = canvas.getContext("2d");
    const larghezzaCanvas = canvas.width;
    const altezzaCanvas = canvas.height;

    const immagine = new Image();
    immagine.src = urlImmagine;

    const larghezzaImmagine = immagine.width;
    const altezzaImmagine = immagine.height;

    const scala = 0.8;
    const larghezzaScala = larghezzaCanvas * scala;
    const altezzaScala = altezzaCanvas * scala;

    const x = (larghezzaCanvas - larghezzaScala) / 2;
    const y = (altezzaCanvas - altezzaScala) / 2;

    let progressoTransizione = 0;

    function animaDisegno() {
        if (progressoTransizione < 1) {
            contesto.clearRect(0, 0, larghezzaCanvas, altezzaCanvas);

            const xCorrente = x + (larghezzaScala / 2) * (1 - progressoTransizione);
            const yCorrente = y + (altezzaScala / 2) * (1 - progressoTransizione);

            contesto.drawImage(immagine, xCorrente, yCorrente, larghezzaScala * progressoTransizione, altezzaScala * progressoTransizione);

            progressoTransizione += 0.05;
            requestAnimationFrame(animaDisegno);
        }
    }

    animaDisegno();
}

function cancellaCanvas(canvas) {
    const contesto = canvas.getContext("2d");
    const larghezzaCanvas = canvas.width;
    const altezzaCanvas = canvas.height;

    contesto.clearRect(0, 0, larghezzaCanvas, altezzaCanvas);
}

pulsanteInizia.addEventListener("click", () => {
    conteggioMosse = 0;
    secondi = 0;
    minuti = 0;
    controlli.classList.add("hide");
    pulsanteInizia.classList.add("hide");
    intervallo = setInterval(generatoreTempo, 1000);
    mosse.innerHTML = `<span>Mosse: </span> ${conteggioMosse}`;
    tempoValore.innerHTML = `<span>Tempo: </span>00:00`;
    inizializzatore();
});

function interrompiGioco() {
    controlli.classList.remove("hide");
    pulsanteInizia.classList.remove("hide");
    clearInterval(intervallo);
}

const inizializzatore = () => {
    risultato.innerText = "";
    conteggioVittorie = 0;
    let valoriCarta = generatoreCasuale();
    generatoreMatrice(valoriCarta);
};

pulsanteInizia.click();

