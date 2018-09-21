var zoneDeJeuElt;
var zoneJoueurUnElt;
var zoneJoueurDeuxElt;
var zoneNeutreElt;
var cartesJoueurUnElt = new Array(5);
var cartesJoueurDeuxElt = new Array(5);

// 0 = dos, 1 = esclave, 2 = citoyen et 3 = empereur
var cartesJoueurUn = new Array(5);
var cartesJoueurDeux = new Array(5);

// carteSelectonnees[0] = joueur 2, carteSelectonnees[1] = joueur 1
var cartesSelectionnees = new Array(2);
var cartesSelectionneesElt = new Array(2);

var manche;
var derniereCarteSupprimeeElt;
var validerElt;
var abandonnerElt;

var score = new Array(2); // score[0] = joueur2, score[1] = joueur1

var flagEvent = 1; // 0 = desactivé, 1 = activé
 
var cartesJoueesOrdinateur = []; // liste des cartes que l'ordinateur a déjà joué
/***
***		initialiser_jeu
***
***		Crée tous les éléments nécessaire au jeu
***
***/
function initialiser_zone_jeu(){

	var i;
	var nomJoueurUnElt;
	var nomJoueurDeuxElt;

	// on mets toutes les cartes sans valeur
	for(i=0; i<5; i++){

		cartesJoueurUn[i] = 0;
		cartesJoueurDeux[i] = 0;
	}

	cartesJoueesOrdinateur = []; // on vide les cartes jouées par l'ordinateur

	validerElt = document.createElement("p");
	validerElt.id = "valider";
	validerElt.textContent = "Valider";
	validerElt.addEventListener("click", function(){

		jouer_tour();
	});

	abandonnerElt = document.createElement("p");
	abandonnerElt.id = "abandonner";
	abandonnerElt.textContent = "Abandonner";

	zoneDeJeuElt = document.createElement("div");
	zoneDeJeuElt.id = "zoneDeJeu";

	zoneJoueurUnElt = document.createElement("div");
	zoneJoueurUnElt.id = "zoneJoueurUn";

	zoneJoueurDeuxElt = document.createElement("div");
	zoneJoueurDeuxElt.id = "zoneJoueurDeux";

	zoneNeutreElt = document.createElement("div");
	zoneNeutreElt.id = "zoneNeutre";

	for(i=0; i<cartesJoueurUnElt.length; i++){

		cartesJoueurUnElt[i] = document.createElement("img");
		
		cartesJoueurUnElt[i].addEventListener("click", function (event){

			if(flagEvent === 1){

				//Si on clique sur une carte et qu'aucune carte est déjà séléctionnée, on la séléctionne
				if(cartesSelectionnees[1] === 0 ){

					var src = (event.target.src).split("img/");

					cartesSelectionneesElt[1].src = "img/" + src[1];

					switch(src[1]){

						case "esclave.jpg":
							cartesSelectionnees[1] = 1;
							break;
						case "citoyen.jpg":
							cartesSelectionnees[1] = 2;
							break;
						default:
							 cartesSelectionnees[1] = 3;
							 break;
					}

					derniereCarteSupprimeeElt = document.getElementById(event.target.id);
					
					zoneJoueurUnElt.removeChild(document.getElementById(event.target.id));
				}
				else{

					afficher_message("Retirez d'abord votre carte !", "erreur");
				}

			}

		});

		cartesJoueurUnElt[i].id = "carte_j1_" + (i+1);
		cartesJoueurUnElt[i].alt = "carte_j1_" + (i+1);
		cartesJoueurUnElt[i].src = "img/dos_carte.jpg";

		cartesJoueurDeuxElt[i] = document.createElement("img");
		cartesJoueurDeuxElt[i].id = "carte_j2_" + (i+1);
		cartesJoueurDeuxElt[i].alt = "carte_j2_" + (i+1);
		cartesJoueurDeuxElt[i].src = "img/dos_carte.jpg";

		zoneJoueurUnElt.appendChild(cartesJoueurUnElt[i]);
		zoneJoueurDeuxElt.appendChild(cartesJoueurDeuxElt[i]);
	}

	zoneNeutreElt.appendChild(abandonnerElt);

	for(i=0; i<cartesSelectionnees.length; i++){

		cartesSelectionneesElt[i] = document.createElement("img");
		cartesSelectionneesElt[i].id = "carte_selectionnee_j" + i;
		cartesSelectionneesElt[i].src = "img/dos_carte.jpg";
		cartesSelectionneesElt[i].alt = "carte_selectionnee_j" + i;
		cartesSelectionnees[i] = 0;

		zoneNeutreElt.appendChild(cartesSelectionneesElt[i]);

	}

	zoneNeutreElt.appendChild(validerElt);

	cartesSelectionneesElt[1].addEventListener("click", function(event){

		if(flagEvent === 1){

			// Si on clique sur "carte selectionnée" de droite, et qu'on avait déjà selectionné une carte
			if(cartesSelectionnees[1] !== 0){

				cartesSelectionnees[1] = 0;
				cartesSelectionneesElt[1].src = "img/dos_carte.jpg";

				zoneJoueurUnElt.appendChild(derniereCarteSupprimeeElt);
			}
		}

	});

	zoneDeJeuElt.appendChild(zoneJoueurDeuxElt);
	zoneDeJeuElt.appendChild(zoneNeutreElt);
	zoneDeJeuElt.appendChild(zoneJoueurUnElt);

	document.body.appendChild(zoneDeJeuElt);

	initialiser_manche();
}

/***
***		initialiser_manche
***
***		attribue les valeurs aux différentes cartes
***
***/

function initialiser_manche(){

	var i;

	// On choisit aléatoirement qui aura le camp de l'esclave et celui de l'empereur
	var nombreAleatoire = nombre_aleatoire(0, 1001);
	var campJoueurUn = ( (nombreAleatoire % 2) === 0 )?"empereur":"esclave";
	var campJoueurDeux = ( campJoueurUn === "empereur" )?"esclave":"empereur";
	
	// On place aléatoirement l'esclave et l'empereur
	var positionCarteSpecialJoueurUn = nombre_aleatoire(0, 4);
	cartesJoueurUn[positionCarteSpecialJoueurUn] = ( campJoueurUn === "empereur" )?3:1;
	cartesJoueurUnElt[positionCarteSpecialJoueurUn].src = "img/" + campJoueurUn +".jpg";
	var positionCarteSpecialJoueurDeux = nombre_aleatoire(0, 4);
	cartesJoueurDeux[positionCarteSpecialJoueurDeux] = ( campJoueurDeux === "empereur" )?3:1; // On change la valeur de la carte, mais pas son image ( pour ne pas connaitre sa valeur en regardant l'src de l'image )

	// On définit toutes les autres cartes comme citoyen
	for(i=0; i<cartesJoueurUnElt.length; i++){

		if( (cartesJoueurUnElt[i].src).indexOf("dos_carte.jpg") !== -1 ){

			cartesJoueurUnElt[i].src = "img/citoyen.jpg";
			cartesJoueurUn[i] = 2;
		}

		if( i != positionCarteSpecialJoueurDeux ){

			cartesJoueurDeux[i] = 2; // On ne change encore que la valeur de la carte
		}
	}

	manche = 1;
	round = 1;

}

/***
***		nombre_aleatoire
***
***		Renvoie un nombre entier aleatoire entre min et max
***
*** 	min : entier minimal
*** 	max : entier maximal
***/
function nombre_aleatoire(min, max) {

  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;

}

/***
***		afficher_message
***
***		Affiche un message qui disparait au bout de 1 seconde
***
*** 	message : message à afficher
*** 	type : type du message ( informations, resultat ou erreur)
***/

function afficher_message(message, type){

	var messageElt = document.createElement("p");
	messageElt.textContent = message;
	messageElt.id = "message_" + type;

	document.body.appendChild(messageElt);

	flagEvent = 0;

	setTimeout(function(){

		document.body.removeChild(messageElt);
		flagEvent = 1;

	}, 1000);

}



/***
***		jouer_carte_ordinateur
***
***		Choisit une carte au hasard et la joue
***
***/

function jouer_carte_ordinateur(){

	var nombreAleatoire = nombre_aleatoire(0, 4);

	while(cartesJoueesOrdinateur.indexOf(nombreAleatoire) !== -1){ // tant qu'on n'a pas choisit une cart qui n'a pas encore été jouée

		nombreAleatoire = nombre_aleatoire(0, 4);
	}

	cartesJoueesOrdinateur.push(nombreAleatoire);

	// On change la carte de gauche dans la zone neutre par la carte aléatoire qu'on vient de choisir

	cartesSelectionnees[0] = cartesJoueurDeux[nombreAleatoire];
		
	switch(cartesJoueurDeux[nombreAleatoire]){

		case 1:
			cartesSelectionneesElt[0].src = "img/esclave.jpg";
			break;
		case 2:
			cartesSelectionneesElt[0].src = "img/citoyen.jpg";
			break;
		default:
			cartesSelectionneesElt[0].src = "img/empereur.jpg";
		break;
	}

	zoneJoueurDeuxElt.removeChild(document.getElementById("carte_j2_" + ( nombreAleatoire + 1 ) )); // On supprime la carte choisit des cartes de l'ordinateur
}


/***
***		comparer_cartes
***
***		compare les cartes actuellements séléctionnées
***		termine le round ou lance le tour suivant en fonction du resultat
***
***/

function comparer_cartes(){

	// en cas de match nul
	if( (cartesSelectionnees[0] === 2) && (cartesSelectionnees[1] === 2) ){

		terminer_round(-1);
	}
	// si le joueur 2 gagne
	else if( ((cartesSelectionnees[0] === 1) && (cartesSelectionnees[1] === 3)) || ((cartesSelectionnees[0] === 2) && (cartesSelectionnees[1] === 1)) || ((cartesSelectionnees[0] === 3) && (cartesSelectionnees[1] === 2))){

		terminer_round(0);
	}
	// si le joueur 1 gagne
	else{

		terminer_round(1);
	}
}

/***
***		terminer_round
***
***		termine le round en determinant le vainqueur
***		en cas de vainqueur, initialise la manque suivante
***
***		vainqueur : 0, 1, -1
***/

function terminer_round(vainqueur){

	if(vainqueur === 0){

		score[0]++;

		afficher_message("Le joueur 2 gagne le round !", "resultat");

		reinitialiser_zone_jeu();
		
	}
	else if(vainqueur === 1){

		score[1]++;

		afficher_message("Le joueur 1 gagne le round !", "resultat");

		reinitialiser_zone_jeu();

	}
	else{

		afficher_message("Match nul !", "resultat");

		attendre(function(){

			cartesSelectionnees[0] = 0;
			cartesSelectionnees[1] = 0;
			cartesSelectionneesElt[0].src = "img/dos_carte.jpg";
			cartesSelectionneesElt[1].src = "img/dos_carte.jpg";

		});
	}

}

function attendre(fonction){

	flagEvent = 0;

	setTimeout(function(){

		fonction();

		flagEvent = 1;

	}, 1000);
}

function reinitialiser_zone_jeu(){

	document.body.removeChild(zoneDeJeuElt);
	initialiser_zone_jeu();
}

/***
***		jouer_tour
***
***		permet d'obtenir le résultat du tour actuel
***
***/

function jouer_tour(){

	// Si on a bien séléctionné une carte
	if(cartesSelectionnees[1] !== 0){

		jouer_carte_ordinateur();
		comparer_cartes();
	}
	else
	{
		afficher_message("Veuillez choisir une carte", "erreur");
	}
}





initialiser_zone_jeu();


afficher_message("Manche 1", "informations");


// afficher le score actuel

// choisir le camp en fonction de la manche ( on est X une fois sur 2 ) -> 6 manches

// fin de partie à la fin des 6 manches

// menu principal
