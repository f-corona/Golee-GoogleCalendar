# Golee-GoogleCalendar
## Automazione per sincronizzare il calendario di Golee con Google Calendar.


![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Google Apps Script](https://img.shields.io/badge/google%20apps%20script-%234285F4.svg?style=for-the-badge&logo=google-apps-script&logoColor=white)
![Google Calendar](https://img.shields.io/badge/Google%20Calendar-4285F4?style=for-the-badge&logo=google-calendar&logoColor=white)
![Golee](https://img.shields.io/badge/Golee-orange?style=for-the-badge)


### **Attenzione!**
Questa è un'automazione sviluppata da un utente appassionato e non da Golee, quindi non è una guida ufficiale. L'utilizzo è consigliato soltanto ad utenti esperti. 

### **Cosa fa lo script?**
- Lo script accede al calendario personale di Golee tramite le informazioni contenute nella pagina web del calendario
- Scansiona il calendario e aggiunge gli eventi al calendario personale di Google
- In caso di eventi modificati, riesce a spostare l'evento senza duplicarlo


## Come funziona?
Golee non fornisce un'API pubblica (o un calendario .ics), tuttavia il link del calendario generabile dal gestionale è "pubblico".
Lo script analizza il link effettuando una richiesta `GET` ed estraendo i parametri necessari in formato JSON.
Lo script scansiona l'array degli eventi e lo aggiunge al calendario.
Ogni evento ha un id univoco che viene memorizzato nel campo "Descrizione" dell'evento. Prima di aggiungere un evento, lo script verifica se è già presente un evento con la stessa descrizione. Poiché questa ricerca potrebbe essere infinita, limitiamo questa ricerca a 15 giorni prima e 15 giorni dopo l'evento selezionato. Se l'evento era già in calendario, aggiorna data e ora senza aggiungere un duplicato.

### Cosa estraiamo?
Lo script scansiona il contenuto nel blocco `__NEXT_DATA__` della pagina. Per ogni evento presente nell'array vengono estratti i dati fondamentali per la creazione dell'evento del calendario:

```json
{
  "id": "ID_EVENTO",            // Identificativo dell'evento, fondamentale per le modifiche
  "title": "TITOLO_EVENTO",     // Titolo visualizzato
  "start": "DATA",              // Timestamp ISO inizio
  "end": "DATA",               // Timestamp ISO fine
  "place": "LUOGO",             // Luogo dell'evento (se presente)
  "description": "Descrizione", // Note o dettagli aggiuntivi
  "updatedAt": "DATA"           // Timestamp dell'ultima modifica
}

```

### Scraping con regex
```javascript
const regex = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/;
```

La Regex descrive un'espressione regolare, ovvero ci permette di descrivere come è fatta una stringa impostando un pattern specifico.

Nel nostro caso:

- `/ ... /` tutto quello che ci interessa è all'interno di due slash
- `<script id="__NEXT_DATA__" type="application\/json">` Lo script cerca esattamente questa stringa di testo. In questo caso abbiamo la backslash \ come carattere di escape per la slash / prima di json.
- `(.*?)` Qui prendiamo tutto quello che leggiamo `(.)`, ripetuto zero o più volte `(*)` e di fermarsi alla fine del primo tag `(?)` di chiusura `</script>`

### Come utilizzarlo
1. Accedere all'account google
2. recarsi su developers.google.com/apps-script
3. cliccare su "inizia a creare script e aprire un nuovo progetto"
4. copiare il contenuto del file GoleeGoogleScript.js
5. alla riga `const GOLEE_URL`, sostituire il contenuto tra virgolette con il link del calendario golee
6. salvare il progetto cliccando sull'icona del floppy sulla barra centrale
7. eseguire lo script cliccando su esegui. (NON SU ESEGUI DEPLOYMENT)
8. alla prima esecuzione, Google segnalerà che lo script non è sicuro e chiederà una serie di autorizzazioni. Dovete acconsentire a tutto.
9. Verificare che sul calendario siano usciti gli eventi. Nella console in basso appariranno eventuali errori o messaggi di successo.
   
### Automazione
Lo script può essere eseguito in automatico tramite gli strumenti google o altri strumenti. Queste funzioni saranno implementate o spiegate in futuro.
