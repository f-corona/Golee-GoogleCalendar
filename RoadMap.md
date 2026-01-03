### TO DO
1. Formattare la resa del luogo. Se in Golee inseriamo "Trezzano Sul Naviglio" su Google otteniamo "trezzano-sul-naviglio". Ancora peggio se si mette un indirizzo completo (usare google maps?)
2. Automatizzare lo script in modo che venga eseguito automaticamente. Google permette questa cosa tramite la sua suite ma bisogna assicurarsi di non incorrere in costi. In alternativa anche un bot telegram sarebbe utile
3. Gestire le eliminazioni: al momento un evento cancellato da golee non viene cancellato su google.
4. Sicurezza e robustezza generale del codice

### Idee
1. Golee permette di dare conferma di partecipazione. Individuare il campo all'interno del calendario e inserire nell'evento google se è stata data conferma. In questo modo posso visualizzare sia l'evento e controllare se ho dato conferma.
   Es: Su Google avrò l'evento "Partita" e nella descrizione ci sarà "CONFERMATO", "DA CONFERMARE", "SEGNATO ASSENTE".
2. Integrazione dello script direttamente da Golee e non da console Google per favorire la diffusione su larga scala
3. Gli eventi di Golee possono essere divisi in più categorie, implementare tutti questi dettagli su Google per un calendario più interattivo (ad esempio colori diversi per eventi diversi)
