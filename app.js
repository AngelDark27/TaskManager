// Aspetta che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    // Carica gli elementi dallo storage
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

    // Elementi di HTML
    const backlog = document.getElementById("backlog");
    const inProgres = document.getElementById("inProgres");
    const review = document.getElementById("review");
    const done = document.getElementById("done");
    const nBacklog = document.getElementById("nBacklog");
    const nInProgress = document.getElementById("nInProgress");
    const nReview = document.getElementById("nReview");
    const nDone = document.getElementById("nDone");

    // Nuova issue e ricerca
    const btnTask = document.getElementById("btnTask");
    const aggiungi = document.getElementById("aggiungi");

    // GetData
    let backlogData = BacklogLoadFromLocalStorage();
    let inProgresData = inProgresLoadFromLocalStorage();
    let reviewData = reviewLoadFromLocalStorage();
    let doneData = doneLoadFromLocalStorage();

    // SaveData
    const saveToLocalStorage = () => {
        localStorage.setItem("backlog", JSON.stringify(backlogData));
        localStorage.setItem("inProgres", JSON.stringify(inProgresData));
        localStorage.setItem("review", JSON.stringify(reviewData));
        localStorage.setItem("done", JSON.stringify(doneData));
    }

    // Crea la nuova issue
    const creaIssue = content => ({
        id: crypto.randomUUID(),
        content,
        createdAt: new Date().toISOString()
    });

    // Sposta issue al gruppo successivo (destra)
    const spostaDestra = (item, listaOrigine, nomeListaOrigine) => {
        const index = listaOrigine.findIndex(element => element.id === item.id);
        if (index === -1) return;

        const [elementoRimosso] = listaOrigine.splice(index, 1);

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
                // Torna al backlog (ciclico)
                backlogData.push(elementoRimosso);
                break;
        }

        saveToLocalStorage();
        Show();
    }

    // Sposta issue al gruppo precedente (sinistra)
    const spostaSinistra = (item, listaOrigine, nomeListaOrigine) => {
        const index = listaOrigine.findIndex(element => element.id === item.id);
        if (index === -1) return;

        const [elementoRimosso] = listaOrigine.splice(index, 1);

        switch(nomeListaOrigine) {
            case 'backlog':
                // Dal backlog va al done (ciclico inverso)
                doneData.push(elementoRimosso);
                break;
            case 'inProgres':
                backlogData.push(elementoRimosso);
                break;
            case 'review':
                inProgresData.push(elementoRimosso);
                break;
            case 'done':
                reviewData.push(elementoRimosso);
                break;
        }

        saveToLocalStorage();
        Show();
    }

    // Elimina issue
    const eliminaIssue = (itemId, listaOrigine, nomeListaOrigine) => {
        const index = listaOrigine.findIndex(element => element.id === itemId);
        if (index === -1) return;

        listaOrigine.splice(index, 1);
        saveToLocalStorage();
        Show();
    }

    // Carica le issue nelle liste
    const carica = (data, container, nomeLista) => {
        container.innerHTML = "";
        
        if (data.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'text-gray-500 text-center py-8 italic';
            emptyMessage.textContent = 'Nessuna issue';
            container.appendChild(emptyMessage);
            return;
        }

        data.forEach(item => {
            const li = document.createElement("li");
            li.className = 'issue-card bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md';
            
            // Determina il colore del bordo in base alla colonna
            let borderColor = 'border-l-gray-400';
            switch(nomeLista) {
                case 'backlog': borderColor = 'border-l-gray-500'; break;
                case 'inProgres': borderColor = 'border-l-blue-500'; break;
                case 'review': borderColor = 'border-l-yellow-500'; break;
                case 'done': borderColor = 'border-l-green-500'; break;
            }

            li.innerHTML = `
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 mb-1">${item.content}</h3>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <span class="inline-flex items-center gap-1">
                                <i class="fas fa-calendar text-gray-400"></i>
                                ${new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">${nomeLista}</span>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-3">
                    <div class="flex gap-2">
                        <button onclick="spostaSinistraDaHTML('${item.id}', '${nomeLista}')" 
                                class="sposta-btn px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors flex items-center gap-1">
                            <i class="fas fa-arrow-left text-xs"></i>
                            Sinistra
                        </button>
                        <button onclick="spostaDestraDaHTML('${item.id}', '${nomeLista}')" 
                                class="sposta-btn px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors flex items-center gap-1">
                            <i class="fas fa-arrow-right text-xs"></i>
                            Destra
                        </button>
                    </div>
                    <button onclick="eliminaIssueDaHTML('${item.id}', '${nomeLista}')" 
                            class="elimina-btn px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors flex items-center gap-1">
                        <i class="fas fa-trash text-xs"></i>
                        Elimina
                    </button>
                </div>
            `;

            // Aggiungi il bordo sinistro
            li.classList.add('border-l-4', borderColor);
            
            container.appendChild(li);
        });
    }

    // Funzioni globali per i pulsanti (richiamate dagli onclick)
    window.spostaDestraDaHTML = (itemId, nomeListaOrigine) => {
        let listaOrigine;
        switch(nomeListaOrigine) {
            case 'backlog': listaOrigine = backlogData; break;
            case 'inProgres': listaOrigine = inProgresData; break;
            case 'review': listaOrigine = reviewData; break;
            case 'done': listaOrigine = doneData; break;
        }
        
        const item = listaOrigine.find(element => element.id === itemId);
        if (item) {
            spostaDestra(item, listaOrigine, nomeListaOrigine);
        }
    }

    window.spostaSinistraDaHTML = (itemId, nomeListaOrigine) => {
        let listaOrigine;
        switch(nomeListaOrigine) {
            case 'backlog': listaOrigine = backlogData; break;
            case 'inProgres': listaOrigine = inProgresData; break;
            case 'review': listaOrigine = reviewData; break;
            case 'done': listaOrigine = doneData; break;
        }
        
        const item = listaOrigine.find(element => element.id === itemId);
        if (item) {
            spostaSinistra(item, listaOrigine, nomeListaOrigine);
        }
    }

    window.eliminaIssueDaHTML = (itemId, nomeListaOrigine) => {
        let listaOrigine;
        switch(nomeListaOrigine) {
            case 'backlog': listaOrigine = backlogData; break;
            case 'inProgres': listaOrigine = inProgresData; break;
            case 'review': listaOrigine = reviewData; break;
            case 'done': listaOrigine = doneData; break;
        }
        
        eliminaIssue(itemId, listaOrigine, nomeListaOrigine);
    }

    // Show liste e issue
    const Show = () => {
        carica(backlogData, backlog, 'backlog');
        carica(inProgresData, inProgres, 'inProgres');
        carica(reviewData, review, 'review');
        carica(doneData, done, 'done');
        
        nBacklog.textContent = backlogData.length;
        nInProgress.textContent = inProgresData.length;
        nReview.textContent = reviewData.length;
        nDone.textContent = doneData.length;
    }

    // Previeni il submit del form
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
    });

    // Aggiungi nuova issue
    btnTask.addEventListener('click', () => {
        const nuovo = aggiungi.value.trim();
        if (nuovo !== "") {
            const demo = creaIssue(nuovo);
            backlogData.push(demo);
            aggiungi.value = "";
            saveToLocalStorage();
            Show();
        }
    });

    // Inizializza la visualizzazione
    Show();
});