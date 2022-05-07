
// http://gateway.marvel.com/v1/public/comics?ts=1651340736&apikey=9083fb3faccab035c3b44323e24a017b&hash=caf1eaddad6cbd2ccdf6409db73c4c92
//https://gateway.marvel.com:443/v1/public/characters?apikey=9083fb3faccab035c3b44323e24a017b&ts=1651340736&hash=caf1eaddad6cbd2ccdf6409db73c4c92


//User 1
const ts = "1651340736";
const apikey = "9083fb3faccab035c3b44323e24a017b";
const hash = "caf1eaddad6cbd2ccdf6409db73c4c92";

//User 2

// const ts = "1651860941";
// const apikey = "31cc540eeec01445c3779d18bf3c1ae2";
// const hash = "94916508c8e41de9fd409e2d61f64c5b";

////////

const container = document.getElementById('container-data');
let favoritesArray = [];


const getCharactersRandom = async () => {

  let i = 0;
  let characterArray = [];

  while(i < 5){
    let randomNumber = Math.floor(Math.random() * (1011500 - 1011334) + 1011334);

    const url = `https://gateway.marvel.com:443/v1/public/characters/${randomNumber}?ts=${ts}&apikey=${apikey}&hash=${hash}&limit=50`;

    //Condition to avoid duplicates of characters
    if(!characterArray.includes(randomNumber)){
      try{
        const getData = await fetch(url);
        const data = await getData.json();

        
        //console.log(data.data.results.thumbnail.path);
  
        renderData(data.data.results);
        characterArray.push(randomNumber);
        
        i++;
      } catch(err){
        //console.log(err);
      }

    }
    else{
      console.log(randomNumber, "already in charactersArray");
    }
  }

};



const getCharacterName = async () => {

    const input =document.getElementById("personaje").value;
    //console.log(input);

    if(input === ''){
      container.innerHTML = '';
      getCharactersRandom();
    }
    else{
      const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${input}&ts=${ts}&apikey=${apikey}&hash=${hash}&limit=50`;

    try{
      const getData = await fetch(url);
      const data = await getData.json();

      container.innerHTML = '';
      renderData(data.data.results);
    } catch(err){
      console.log(err);
      alert(err);
      getCharactersRandom();   

    }

    }
    

}


//Render Cards
const renderData = (results) => {


    let cardText = '';
    results.forEach((item,index) => {
        //container.innerHTML += `

        //Remove Characters if image not found.
        // if(item.thumbnail.path === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'){
        //   return;
        // }
        
        cardText = `
        
            <div class="card m-1" style="width:200px" id="${item.id}">
                <img class="card-img-top" src="${item.thumbnail.path + '.' +item.thumbnail.extension}" alt="Card image" style="width:100%">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${item.name}</h5>
                    <h6>Events</h6>`;

                    qtyEvents = item.events.items.length  > 3 ? 3: item.events.items.length; // Display max 3 events

                    for(let i = 0; i < qtyEvents; i++){
                      cardText += `<p>${item.events.items[i].name}</p>`;
                        //console.log(item.events.items[i].name);
                    }
                    if(favoritesArray.includes(item.id)){
                      cardText += `<button type="button" id="button${item.id}" onclick="removeFavorites(${item.id})" class="btn btn-danger">Remove from Favorites</button>`
                    } else {
                      cardText += `<button type="button" id="button${item.id}" onclick="addToFavorites(${item.id})" class="btn btn-primary">Add to Favorites</button>`
                    }                   
                    
                `</div>
            </div>`
        ;

                    container.innerHTML += cardText;
    });

    //console.log(container.innerHTML);

};

const addToFavorites = (characterID) => {

  if(!favoritesArray.includes(characterID)){
    favoritesArray.push(characterID);
  
    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
    console.log(favoritesArray);

  }
  
  getCharacterName();
};

const renderFavorites = () => {
  container.innerHTML = '';
  let retrievedData = localStorage.getItem("favorites");
  favoritesArray = JSON.parse(retrievedData);

  favoritesArray.forEach(async (id) => {
    const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${apikey}&hash=${hash}&limit=50`;
    const getData = await fetch(url);
    const data = await getData.json();

    renderData(data.data.results);

  } );

};

const removeFavorites = (characterID) => {

  const index = favoritesArray.indexOf(characterID);
  favoritesArray.splice(index, 1);
  console.log(favoritesArray);
  
  localStorage.setItem("favorites", JSON.stringify(favoritesArray));
  renderFavorites();

};


// const validateInput = () => {
//   getCharacters()
//   getCharacterName()
// };

//getCharacters();
//getCharactersRandom();
