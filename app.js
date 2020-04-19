// DOM Objects
// la variable mainScreen va nous permettre de remove la deuxième class hide de la div, hide qui cache les textes génériques, pour avoir l'écran noir si on ne sélectionne aucun pokemon
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');


// constants and variables


//ici on créer un array, des différents types des pokemons, en amont pour le réutiliser dans la fonction resetScreen
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];

//ces deux variables sont en null pour pouvoir être utilisé dans le fetch des pokemons listés
let prevUrl = null;
let nextUrl = null;


// Functions


// fonction capitalize pour mettre en majuscule la première lettre avec toUpperCase et substr permet d'afficher le reste des lettres à partir de la position 1 
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);


//fonction resetScreen pour remettre à 0 le pokedex
const resetScreen = () => {

// ici on remove la class hide du mainScreen
  mainScreen.classList.remove('hide');

/* boucle for ( type = strings qui sont dans l'array TYPES ) pour retirer les class au mainScreen.
 Pourquoi faire cette boucle ?
 A chaque fois qu'on clique sur un nouveau pokemon, on add une class au mainScreen correspondant à la couleur du type 
 du pokemon sélectionné. Ce qui fait que le mainScreen a pleins de class qui s'ajoutent à la suite mais 
 on a rien pour les enlever.
 Alors au lieu de remove manuellement chaque class ( mainScreen.classList.remove("poison") etc... ) on fait une boucle 
 qui va soigneusement enlever chaque type présents dans le mainScreen. 
 C'est pour cela que nous avons fait un array TYPES regroupant tous les types existants et qu'on l'appelle ici*/
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};


// ce fetch permet de récupérer les données de la listes des pokemons pour l'écran de droite
// il est dans une variable fetchPokeList pour être appelé plus tard > ligne 196

const fetchPokeList = url => {
  fetch(url)
    .then(res => res.json())
    .then(data => {

// cette écriture (en dessous) en ES6 permet en une ligne de faire 3 lignes en ES5
      const { results, previous, next } = data;
// ES5: const results = data['results'];
// const previous = data['previous'];
// const next = data['next'];

      prevUrl = previous;
      nextUrl = next;

// boucle for avec un if else intégré, le for permet à ce qu'a partir de 0 jusqu'à la fin de la liste des pokemons, on incrémente un pokemon avec son id et son name liée à son url
      for (let i = 0; i < pokeListItems.length ; i++) {
        const pokeListItem = pokeListItems[i];
//results correspond à la data listant tous les pokemons 
        const resultData = results[i];

// if on obtient le resultData 
        if (resultData) {
          const { name, url } = resultData;
// ES5
// const name = resultData['name'];
// const url = resultData['url'];

/* La méthode split() permet de diviser l'url par le séparateur "/" et le diviser en un array de sous chaines
   exemple d'url : https://pokeapi.co/api/v2/pokemon/1/ en le splitant via le séparateur "/"
   cela donne un array : (8) [ "https:", "", "pokeapi.co", "api", "v2", "pokemon", "1", ""] */
          const urlArray = url.split('/');

// grâce au split, l'id présent dans l'url est splité à la 6 ème position sur 7, 
// donc on l'a récupère en prenant la longueur de cet array et en soutrayant 2 (pour avoir le 6)
          const id = urlArray[urlArray.length - 2];

// on ajoute donc l'id + le name de chaque pokemon dans la liste
          pokeListItem.textContent = id + '. ' + capitalize(name);

//sinon on ajoute un string vide si on obtient pas le resultData
        } else {
          pokeListItem.textContent = '';
        }
      }
    });
};


// ce fetch permet de récupérer les données de chaque pokemon en fonction de son ID pour l'écran de gauche

const fetchPokeData = id => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
// res etant le diminutif de response, res.json pour le mettre en format json
    .then(res => res.json())
// ici on accède à la data de l'api pokemon 
    .then(data => {
// on appelle la fonction resetScreen conçu plus haut
      resetScreen();
// Certains pokemons n'ont qu'un seul type, d'autres 2. On différencie les 2 types par 2 constantes
      const dataTypes = data['types'];
// la data['types'] étant un array, il faut chercher les 2 types en indexant. Le premier au 0, le 2eme au 1
      const dataFirstType = dataTypes[0];
      const dataSecondType = dataTypes[1];
      pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
// condition pour que si le pokemon choisi à un 2eme type, on remove la class hide de la div du type 2 et on ajoute en textContent le nom de ce type
      if (dataSecondType) {
        pokeTypeTwo.classList.remove('hide');
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
// si le pokemon n'a qu'un type, alors pas besoin de la div du deuxième type, que l'on cachera en ajoutant la class hide et on ajoute un string vide en textContent
      } else {
        pokeTypeTwo.classList.add('hide');
        pokeTypeTwo.textContent = '';
      }

/*  Les types sont injectés, maintenant on associe le background-color du mainScreen au firstType, 
    on ajoute donc une class au mainScreen correspondant au dataFirstType['type']['name'].
    Dans le css, on a écrit les class des différents background-color avec exactement le même 
    nom que le ['type']['name'] dans la data.*/

    mainScreen.classList.add(dataFirstType['type']['name']);

/*  Par exemple pour Bulbizarre, son firstType est Poison.
    Avec le code juste au dessus, on va add une class qui correspond au nom du firstType de Bulbizarre, qui est Poison;
    et il existe justement une class css qui s'appelle Poison, donc c'est lui qu'il va appeler. 
    C'est une façon opti pour appeler le background color pour tous les pokemons selon leur firstType.
    Manuellement, juste pour Bulbizarre, on pourrait écrire mainScreen.classList.add('poison'); */

// on appelle ici la fonction capitalize pour avoir la majuscule à la première lettre du name
      pokeName.textContent = capitalize(data['name']);
// pour l'id du pokemon, on converti la data en string  avec la méthode toString() et on utilise la méthode padStart() pour ajouter deux zéro avant le chiffre de l'id 
      pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
      pokeWeight.textContent = data['weight'] + " kilos";
      pokeHeight.textContent = data['height']+ " cm";
// Pour une img, on injecte par .src et on ajoute une condition "ou" si jamais les images ne s'affichent pas, alors on ne met rien, string vide => || '' 
      pokeFrontImage.src = data['sprites']['front_default'] || '';
      pokeBackImage.src = data['sprites']['back_default'] || '';
    });
};

//  déclaration de la variable pour qu'au bouton prev, la liste précédente s'affiche
const handleLeftButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
};

//déclaration de la variable pour qu'au bouton next, la liste suivante s'affiche
const handleRightButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
};

//
const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};


// adding event listeners

//appel des variables du haut pour les gestionnaires d'évenement au clic
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}


// initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');