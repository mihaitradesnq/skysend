SkySend

SkySend este o platformă web care explorează posibilitatea livrării coletelor cu ajutorul dronelor în mediul urban. Aplicația acoperă întregul proces de livrare, de la plasarea unei comenzi până la urmărirea acesteia, oferind în același timp interfețe dedicate pentru clienți, operatori și administratori.

Proiectul este dezvoltat folosind Next.js, React, TypeScript, Supabase, Clerk, Stripe, MapLibre, Overpass și Geoapify.

⸻

Funcționalități

* autentificare și gestionarea utilizatorilor pe roluri;
* creare și urmărire comenzi;
* selectarea adreselor de ridicare și livrare pe hartă;
* estimarea caracteristicilor coletului cu ajutorul inteligenței artificiale;
* mai multe opțiuni de livrare (standard, prioritară și programată);
* generarea unui link de partajare a accesului la livrarea unei comenzi in desfasurare;
* plăți online prin Stripe;
* salvarea datelor de la cardurile folosite anterior securizata pentru plati viitoare folosind pointer la cardul de pe stripe fara a salva date personale pe site;
* panou dedicat clienților pentru gestionarea comenzilor;
* panou de administrare pentru monitorizarea platformei;
* design responsive, adaptat atât pentru desktop, cât și pentru dispozitive mobile.

⸻

Tehnologii utilizate

Categorie	    Tehnologie
Framework	    Next.js
Frontend	    React, TypeScript
Stilizare	    Tailwind CSS
Autentificare	Clerk
Bază de date	Supabase
Plăți	        Stripe
Hărți	        MapLibre, Geoapify, Overpass
Inteligență     Artificială	OpenRouter
Testare	        Vitest

⸻

Structura proiectului

src/
 ├── app/
 ├── components/
 ├── hooks/
 ├── lib/
 ├── styles/
 └── types/
public/
docs/
scripts/
supabase/

Codul este organizat pe module separate pentru partea publică a aplicației, zona destinată clienților, panoul de administrare, interfața operatorilor și rutele API.

⸻

*PROCESUL DE CREARE A UNEI LIVRARI*

*Pentru a intra pe aplicatia de livrari trebuie sa fi conectat la un cont
1.Dupa ce ai intrat pe platforma selectezi fie de pe harta fie prin adresă punctul de ridicare a coletului si punctul de livrare, iar site ul va gasi minimum 3 zone pentru fiecare unde drona poate ateriza cat mai aproape de locatia selectata de utilizator si il va alege pe cel mai apropiat, acesta se poate schimba apasand pe unul din celelalte puncte de intalnire;

2.Dupa ce ai confirmat punctele urmeaza sa introduci intr un box cea mai complexa descriere pe care o poti face despre ce vrei sa trimiti, dupa care verifica si apasa pe estimeaza AI verifici daca AI ul are vreo intrebare pentru tine si daca nu, apesi pe confirma estimarea;

3.După ce ai confirmat estimarea coletului, verifici datele generate: greutate, dimensiuni, fragilitate și recomandările pentru transport. Dacă ceva nu este corect, modifici descrierea sau completezi răspunsurile cerute de AI;

4.Apoi alegi tipul livrării: standard, prioritară sau programată. Dacă alegi livrare programată, selectezi data și ora la care vrei să fie făcută livrarea;

5.După aceea ajungi la verificarea finală, unde controlezi toate datele comenzii: punctul de ridicare, punctul de livrare, zonele unde poate ateriza drona, detaliile coletului, tipul livrării și prețul estimat.Dacă totul este corect, continui către plată, alegi metoda de plată și finalizezi comanda;

După plată, livrarea este salvată în contul tău și o poți urmări în pagina de comenzi sau în secțiunea de livrare activă până când coletul ajunge la destinație.
⸻

Despre proiect

SkySend a fost realizat ca un proiect demonstrativ care urmărește integrarea mai multor tehnologii moderne într-o singură aplicație. Platforma combină servicii de hărți, autentificare, procesarea plăților și estimarea coletelor cu ajutorul inteligenței artificiale pentru a simula funcționarea unui sistem de livrare cu drone. Deși reprezintă un prototip, aplicația este construită folosind o arhitectură apropiată de cea întâlnită în proiectele reale.
Livrarea propriu-zisă este simulată, dar este afișată în aplicație ca o livrare reală, pentru a reproduce cât mai bine experiența unui utilizator. Logica site-ului este însă limitată de faptul că procesul de livrare este fictiv și nu există o dronă reală, senzori reali sau verificări fizice directe. De exemplu, aplicația nu poate confirma cu certitudine dacă o dronă poate ateriza într-un anumit loc și nu poate cântări greutatea reală a coletului. Din acest motiv, estimările, punctele de aterizare și constrângerile operaționale trebuie privite ca rezultate ale unei simulări, nu ca validări reale de teren.

⸻

Licență

Domeniul site-ului este gândit pentru a reprezenta clar identitatea SkySend acesta fiind cumparat oficial pe o perioada de un an: https://skysend.website/