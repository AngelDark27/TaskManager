// Aspetta che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    //carica gli elementi dallo storage
    const BacklogLoadFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("backlog")) || [];
    }
    const inProgresLoadFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("inProgres")) || [];
    }
    const reviewLoadFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("review")) || [];
    }
    const doneLoadFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("done")) || [];
    }

    //elementi di HTML
    const backlog = document.getElementById("backlog");
    const inProgres = document.getElementById("inProgres");
    const review = document.getElementById("review");
    const done = document.getElementById("done");
    const nBacklog = document.getElementById("nBacklog");
    const nInProgress = document.getElementById("nInProgress");
    const nReview = document.getElementById("nReview");
    const nDone = document.getElementById("nDone");

    //nuova issue e ricerca
    const btnTask = document.getElementById("btnTask");
    const aggiungi = document.getElementById("aggiungi");

    //getData
    let backlogData = BacklogLoadFromLocalStorage();
    let inProgresData = inProgresLoadFromLocalStorage();
    let reviewData = reviewLoadFromLocalStorage();
    let doneData = doneLoadFromLocalStorage();

    //saveData
    const saveToLocalStorage = () => {
        localStorage.setItem("backlog", JSON.stringify(backlogData));
        localStorage.setItem("inProgres", JSON.stringify(inProgresData));
        localStorage.setItem("review", JSON.stringify(reviewData));
        localStorage.setItem("done", JSON.stringify(doneData));
    }

    //crea la nuova issue
    const creaIssue = content => ({
        id: crypto.randomUUID(),
        content,
        svolto: false
    });

    //sposta o elimina issue
    const gestisciClickIssue = (item, listaOrigine, nomeListaOrigine) => {
        // Trova l'indice dell'elemento nella lista di origine
        const index = listaOrigine.findIndex(element => element.id === item.id);
        if (index === -1) return;

        // Rimuovi l'elemento dalla lista di origine
        const [elementoRimosso] = listaOrigine.splice(index, 1);

        // Determina la lista di destinazione in base alla lista di origine
        switch(nomeListaOrigine) {
            case 'backlog':
                inProgresData.push(elementoRimosso);
                break;
            case 'inProgres':
                reviewData.push(elementoRimosso);
                break;
            case 'review':
                doneData.push(elementoRimosso);
                break;
            case 'done':
                // Se è già in "Done", viene eliminato completamente
                // Non facciamo nulla perché è già stato rimosso
                break;
        }

        saveToLocalStorage();
        Show();
    }

    //carica le issue nelle liste
    const carica = (data, container, nomeLista) => {
        container.innerHTML = ""; // Pulisce il container
        data.forEach(item => {
            const li = document.createElement("li");
            // Mostra solo il content, non l'ID
            li.innerText = item.content;
            li.style.cursor = "pointer";
            li.style.margin = "5px 0";
            li.style.padding = "5px";
            li.style.border = "1px solid #ccc";
            li.style.borderRadius = "3px";
            li.onclick = () => gestisciClickIssue(item, data, nomeLista);
            container.appendChild(li);
        });
    }

    //show liste e issue
    const Show = () => {
        // Carica le issue nelle liste principali
        carica(backlogData, backlog, 'backlog');
        carica(inProgresData, inProgres, 'inProgres');
        carica(reviewData, review, 'review');
        carica(doneData, done, 'done');
        
        // Aggiorna i contatori
        nBacklog.innerText = backlogData.length;
        nInProgress.innerText = inProgresData.length;
        nReview.innerText = reviewData.length;
        nDone.innerText = doneData.length;
    }

    // Previeni il submit del form
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
    });

    // Aggiungi nuova issue
    btnTask.addEventListener('click', () => {
        console.log("submit");
        const nuovo = aggiungi.value.trim();
        if (nuovo !== "") {
            const demo = creaIssue(nuovo);
            backlogData.push(demo);
            aggiungi.value = ""; // Pulisce l'input
            saveToLocalStorage();
            Show();
        }
    });

    // Inizializza la visualizzazione
    Show();
});