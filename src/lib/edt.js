console.clear();
let bandw;
let addWeekAB = false;

const INDEX_NOM_COURS = 1;
const INDEX_LETTRE_GROUPE = INDEX_NOM_COURS + 1;
const INDEX_TYPE_COURS = INDEX_LETTRE_GROUPE + 1;
const INDEX_GROUPE_COURS = INDEX_TYPE_COURS + 1;
const INDEX_SEMAINE_COURS = INDEX_GROUPE_COURS + 1;
const INDEX_JOUR_COURS = INDEX_SEMAINE_COURS + 1;
const INDEX_HEURE_DEBUT = INDEX_JOUR_COURS + 1;
const INDEX_MINUTE_DEBUT = INDEX_HEURE_DEBUT + 1;
const INDEX_HEURE_FIN = INDEX_MINUTE_DEBUT + 1;
const INDEX_MINUTE_FIN = INDEX_HEURE_FIN + 1;
const INDEX_FREQ_COURS = INDEX_MINUTE_FIN + 1;
const INDEX_LIEU_COURS = INDEX_FREQ_COURS + 1;
const INDEX_SALLES_COURS = INDEX_LIEU_COURS + 1;

const listeCouleursCours = {};
const colours = [
    "#27ae60",
    "#2980b9",
    "#c0392b",
    "#7f8c8d",
    "#f1c40f",
    "#1abc9c",
    "#95a5a6",
    "#26C6DA",
    "#C2185B",
    "#E64A19",
    "#1B5E20"
];
var colourIndex = 0;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function duree(h1, m1, h2, m2) {
    // pars ints
    h1 = parseInt(h1);
    m1 = parseInt(m1);
    h2 = parseInt(h2);
    m2 = parseInt(m2);

    // transform durations with decimal
    const decimalStart = h1 + m1 / 60;
    const decimalEnd = h2 + m2 / 60;

    const decimalDuration = decimalEnd - decimalStart;

    return decimalDuration / 0.25;
}
function cour(matches, periodes, jours, heuremin) {
    var timebefore = duree(
        heuremin[0],
        heuremin[1],
        matches[INDEX_HEURE_DEBUT],
        matches[INDEX_MINUTE_DEBUT]
    );
    var jour = jours.indexOf(matches[INDEX_JOUR_COURS]);
    var periode = duree(
        matches[INDEX_HEURE_DEBUT],
        matches[INDEX_MINUTE_DEBUT],
        matches[INDEX_HEURE_FIN],
        matches[INDEX_MINUTE_FIN]
    );
    var frequency = matches[INDEX_FREQ_COURS];
    var groupe = matches[INDEX_GROUPE_COURS];
    var type = matches[INDEX_TYPE_COURS];
    var groupecours = matches[INDEX_LETTRE_GROUPE] || "";

    // define left offset
    var left = (jour / jours.length) * 100;
    let semaine = '';
    if (frequency === '2' || frequency === 'B') {
        semaine = matches[INDEX_SEMAINE_COURS]
            ? "<br>semaine " + matches[INDEX_SEMAINE_COURS]
            : "";
    }
    // console.log(semaine)

    //if same course at same hour, increase left offset
    var lasthour = $("#edt > div:last").attr("alt");
    var lastday = $("#edt > div:last").attr("data-jour");
    var lastroom = $("#edt > div:last").attr("data-salle");
    const lastFreq = $("#edt > div:last").attr("data-frequence");
    console.log(lastFreq, matches[INDEX_NOM_COURS], matches[INDEX_TYPE_COURS]);
    var half = 1;
    if (lasthour !== undefined) {
        // fix bug cours meme heure meme salle mais frequence 1
        // fix bug cours meme heure frequence 1 mais distanciel : enlever check room
        if (
            lasthour == matches[INDEX_HEURE_DEBUT] &&
            lastday == matches[INDEX_JOUR_COURS] &&
            matches[INDEX_FREQ_COURS] == 1 &&
            lastFreq == 1
        ) {
            console.log("freq 1 bug", matches);
            half = 0.5;
            $("#edt > div:last")[0].style.width =
                parseInt($("#edt > div:last")[0].style.width) / 2 + "%";
            left += (1 / 2 / jours.length) * 100;
        }
    }
    if (!groupe) {
        groupe = matches[INDEX_GROUPE_COURS];
    }
    var fin = (periode / periodes) * 100 + (timebefore / periodes) * 100 + "%";
    const horaire = `${matches[INDEX_HEURE_DEBUT]}h${matches[INDEX_MINUTE_DEBUT]} — ${matches[INDEX_HEURE_FIN]}h${matches[INDEX_MINUTE_FIN]}`;
    const lieu =
        (matches[INDEX_LIEU_COURS] || "") +
        (matches[INDEX_LIEU_COURS] && matches[INDEX_SALLES_COURS] ? " — " : "") +
        (matches[INDEX_SALLES_COURS] || "");

    $("#edt").append(
        '<div class="cour middle" alt="' +
        matches[INDEX_HEURE_DEBUT] +
        '"><span class="groupe">' +
        type +
        "</span><div>" +
        matches[INDEX_NOM_COURS] +
        " (groupe de " +
        type +
        " " +
        matches[INDEX_GROUPE_COURS] +
        ")" +
        semaine +
        "<br>" +
        horaire +
        "<br>" +
        lieu +
        '</div><span class="taille"></span></div>'
    );

    const cours = $("#edt > div:last")[0];
    // mettre tous les attibuts
    cours.setAttribute("data-fin", fin);
    cours.setAttribute("data-jour", matches[INDEX_JOUR_COURS]);
    cours.setAttribute("data-frequence", matches[INDEX_FREQ_COURS]);

    if (matches[INDEX_FREQ_COURS] === "2") {
        // recuperer cours precedent a celui juste ajouté
        const prevCours = $("#edt > div:last").prev();
        console.log(matches, prevCours.attr("data-frequence"));
        const prevJour = prevCours.attr("data-jour");
        const prevfin = prevCours.attr("data-fin");
        console.info(
            prevJour,
            matches[INDEX_JOUR_COURS],
            parseFloat(prevfin),
            (timebefore / periodes) * 100,
            prevJour == matches[INDEX_JOUR_COURS],
            parseFloat(prevfin) >= (timebefore / periodes) * 100
        );
        // si c'est le même jour
        // si l'heure du fin du précédent est plus grand à mon heure de départ
        if (
            prevJour == matches[INDEX_JOUR_COURS] &&
            parseFloat(prevfin) >= (timebefore / periodes) * 100
        ) {
            console.info("moving left for", matches);
            left += ((1 / jours.length) * 100) / matches[INDEX_FREQ_COURS];
        }
    }
    $("#edt > div:last").css({
        height: (periode / periodes) * 100 + "%",
        width: (((half * 1) / jours.length) * 100) / frequency + "%",
        position: "absolute",
        left: left + "%",
        top: (timebefore / periodes) * 100 + "%",
        background: bandw ? "white" : listeCouleursCours[matches[INDEX_NOM_COURS]],
        "border-color": bandw
            ? listeCouleursCours[matches[INDEX_NOM_COURS]]
            : "transparent",
        color: bandw ? "black" : "inherit"
    });
}

function entete(jours) {
    for (var u = 0; u < jours.length; u++) {
        $("#entete").append("<div>" + jours[u] + "</div>");
        $("#entete div:last").css("width", (1 / jours.length) * 100 + "%");
    }
}

function horaires(heuremin, heuremax, periodes) {
    var heurestart = heuremin[0];

    var heureend = heuremax[0];

    var heures = heureend - heurestart;
    heures++;
    for (var b = 0; b < heures; b++) {
        var heure = heurestart + b;
        var top = (duree(heuremin[0], heuremin[1], heure, 0) / periodes) * 100;
        $("#heures").append('<div class="heure">' + heure + ":00<div></div></div>");
        $("#heures > div:last").css("top", top + "%");
    }
}
function saveAs(uri, filename) {
    var link = document.createElement("a");
    if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

function edt() {
    //reinit div
    $("body").css("overflow", "auto");
    $("#heures").html("");
    $("#entete").html("");
    $("#edt").find(".cour").remove();

    $("form").hide();
    //get value
    var textarea = $("form textarea").val();
    var cours = textarea.trim().split("\n");

    bandw = $("#bandw:checked").length;
    addWeekAB = $("#weekab:checked").length;

    var jours = [];
    var heuremin = [20, 20];
    var heuremax = [0, 0];

    var reg = /([A-Z0-9]+|[A-Z0-9]+\+[A-Z0-9]+)\s+([A-Z]+)?\s*([A-Z]{2})\s*([0-9]+)\s+([A-Z]?)\s*([a-z]+)\s+([0-9]+)[:h]([0-9]{2})\s+([0-9]+)[:h]([0-9]{2})\s+([0-9A-B])\s+([A-Za-zé]{2,})?\s*(([A-Z]\s?[A-Za-z0-9]+[a-zA-Z]?)(, )?(([A-Z]\s?[0-9]+[a-zA-Z]?)|[a-zA-Z]+)?|[a-zA-Z0-9]+)?/;
    for (var i = 0; i < cours.length; i++) {
        var matches = reg.exec(cours[i]);

        if (!matches) {
            $("form").show();
            alert(
                "Ton emploi du temps ne respecte pas le format inscris dans l'exemple."
            );
            return;
        }
        var jour = matches[INDEX_JOUR_COURS];
        if (jours.indexOf(jour) === -1) {
            jours.push(jour);
        }

        if (bandw) {
            $("#edt").addClass("impression");
        }

        //couleur de cours
        if (listeCouleursCours[matches[INDEX_NOM_COURS]] === undefined) {
            if (bandw) {
                r = g = b = rand(65, 255);
                listeCouleursCours[matches[INDEX_NOM_COURS]] =
                    "rgb(" + r + ", " + g + ", " + b + ")";
            } else {
                listeCouleursCours[matches[INDEX_NOM_COURS]] = colours[colourIndex];
                colourIndex = (colourIndex + 1) % colours.length;
            }
        }

        // heure min
        var heuredebut = parseInt(matches[INDEX_HEURE_DEBUT]);
        var minutedebut = parseInt(matches[INDEX_MINUTE_DEBUT]);
        // console.log(heuredebut, minutedebut);
        if (heuredebut < heuremin[0]) {
            heuremin[0] = heuredebut;
            heuremin[1] = minutedebut;
        }
        if (heuredebut == heuremin[0] && minutedebut < heuremin[1]) {
            heuremin[1] = minutedebut;
        }

        // heure max
        var heurefin = parseInt(matches[INDEX_HEURE_FIN]);
        var minutefin = parseInt(matches[INDEX_MINUTE_FIN]);
        if (heurefin > heuremax[0]) {
            heuremax[0] = heurefin;
            heuremax[1] = minutefin;
        }
        if (heurefin == heuremax[0] && minutefin > heuremax[1]) {
            heuremax[1] = minutefin;
        }
    }

    // calcul periodes max de 15min de travail
    var periodes = duree(heuremin[0], heuremin[1], heuremax[0], heuremax[1]);

    //calculs des periodes de chaque cours
    for (var a = 0; a < cours.length; a++) {
        var matches = reg.exec(cours[a]);
        cour(matches, periodes, jours, heuremin);
    }
    entete(jours);
    horaires(heuremin, heuremax, periodes);

    if (document.getElementById("non").checked == false) {
        html2canvas(document.getElementById("container"), {
            onrendered: function (canvas) {
                if (document.getElementById("png").checked) {
                    saveAs(canvas.toDataURL(), "edt" + (bandw ? "-impression" : "") + ".png");
                } else {
                    var imgData = canvas.toDataURL("image/jpeg", 1);
                    var pdf = new jsPDF({
                        orientation: "landscape",
                        unit: "mm",
                        format: "a4"
                    });
                    var pageWidth = pdf.internal.pageSize.getWidth();
                    var pageHeight = pdf.internal.pageSize.getHeight();
                    var imageWidth = canvas.width;
                    var imageHeight = canvas.height;

                    var ratio =
                        imageWidth / imageHeight >= pageWidth / pageHeight
                            ? pageWidth / imageWidth
                            : pageHeight / imageHeight;
                    //pdf = new jsPDF(this.state.orientation, undefined, format);
                    pdf.addImage(
                        imgData,
                        "JPEG",
                        0,
                        0,
                        imageWidth * ratio,
                        imageHeight * ratio
                    );
                    pdf.save("edt" + (bandw ? "-impression" : "") + ".pdf");
                }
            }
        });
    }
}

$("body > form").on("submit", function (e) {
    e.preventDefault();
    edt();
});
