// Sincronizzazione Golee con Google Calendar 


const GOLEE_URL = "INSERISCI QUI L'URL TRA LE VIRGOLETTE";
const CALENDAR_NAME = "Calendario Golee";


function goleeGoogleScript() {
  
  //CalendarApp è il servizio di Google che ci permette di gestire calendari
  let calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0]; //recuperiamo il calendario che si chiama come CALENDAR_NAME
  //se non c'è, lo creiamo
  if (!calendar) {
    calendar = CalendarApp.createCalendar(CALENDAR_NAME);
    Logger.log("Creato nuovo calendario: " + CALENDAR_NAME); //vediamo in console cosa accade
  }

  
  const response = UrlFetchApp.fetch(GOLEE_URL); //andiamo sulla pagina del calendario, fetch restituisce la risposta del server (404, 200, etc..)
  const html = response.getContentText(); //recuperiamo il codice sorgente html della pagina
  
  //impostiamo la regex da cercare
  const regex = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/; //spiegazione nel readme
  const match = html.match(regex); //cerchiamo la regex nella pagina e la copiamo
  
  if (!match) { //se non la troviamo lo segnaliamo alla console e chiudiamo
    Logger.log("Errore, impossibile trovare i dati nella pagina");
    return;
  }

  //trasformiamo tutta la stringa JSON in un oggetto JS con una struttura dati. 
  const fullData = JSON.parse(match[1]); //individuiamo delle proprietà e i rispettivi valori {"proprietà":valore, "prop2":valore..}
  //scomponiamo fullData. .props sono le proprietà generali, .pageProps i dati specifici, .events contiene l'array degli eventi (vedi Next.js)
  const events = fullData.props.pageProps.events;
  
  //creiamo la data di oggi, ma ci portiamo a mezzanotte in modo da vedere tutti gli eventi del giorno, anche quelli "passati" o in corso
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  //usiamo due contatori così alla fine scriveremo quanti eventi abbiamo aggiunto/aggiornato
  let creati = 0;
  let aggiornati = 0;

  //scorriamo la lista degli eventi
  for (let i = 0; i < events.length; i++) {
    
    let goleeEvent = events[i]; 

    //trasformiamo le date in oggetti Data per Google
    const startTime = new Date(goleeEvent.start);
    const endTime = new Date(goleeEvent.end);
    

    //se la data dell'evento è precedente a oggi la saltiamo, non ci interessa modificarla
    //non sapendo come funziona il calendario Golee, meglio evitare gli eventi passati
    if (startTime < today) {
      continue; 
    }

    //estriamo le informazioni dall'oggetto goleeEvent
    const goleeTitolo = goleeEvent.title || "Golee"; //se non c'è un titolo, gli assegniamo un nome fisso
    const goleeID     = goleeEvent.id;    // id dell'evento su golee
    const goleeLuogo  = goleeEvent.place || ""; //copiamo il luogo dell'evento, da rendere meno grezzo :(

    //nella descrizione dell'evento, ricopiamo la descrizione presente su goolee e in più aggiungiamo l'id golee copiato prima
    const googleDescrizione = (goleeEvent.description || "") + "\n\nID_GOLEE:" + goleeID;

    
    //cerchiamo l'evento nel calendario in un range di +/- 15 giorni rispetto alla data.
    const searchStart = new Date(startTime.getTime() - (15 * 24 * 60 * 60 * 1000));
    const searchEnd = new Date(startTime.getTime() + (15 * 24 * 60 * 60 * 1000));
    //memorizziamo gli eventi con lo stesso id in un array
    const listaEventiGoogle = calendar.getEvents(searchStart, searchEnd, { search: "ID_GOLEE:" + goleeID }); 

    //se l'array ha dimensione >0 allora abbiamo un elemento già presente
    if (listaEventiGoogle.length > 0) { 
     
      let googleEvent = listaEventiGoogle[0]; 
      
      googleEvent.setTime(startTime, endTime);
      googleEvent.setTitle(goleeTitolo);
      googleEvent.setDescription(googleDescrizione);
      googleEvent.setLocation(goleeLuogo);
      
      aggiornati++; //aggiorniamo il contatore
      Logger.log("Aggiornato evento: " + goleeTitolo);
    
    } else { //inseriamo il nuovo evento
      
      //creiamo un evento nel calendario con le informazioni estrapolate prima
      let nuovoEventoGoogle = calendar.createEvent(goleeTitolo, startTime, endTime, {
        description: googleDescrizione,
        location: goleeLuogo
      });

      nuovoEventoGoogle.setColor("6"); //impostiamo il colore in arancione

      creati++; //aggiorniamo il contatore

      Logger.log("Creato nuovo evento: " + goleeTitolo);
    }
    //ripetiamo il ciclo fino alla fine degli eventi individuati
  }

  Logger.log("Sincronizzazione completata.\nEventi creati: " + creati + "\nEventi aggiornati: " + aggiornati);
}
