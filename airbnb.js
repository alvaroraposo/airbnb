var mydata = [];

function readJSON(path, page, pesquisa) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path+"?v=2", true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) { 
      if (this.status == 200) {
          var file = new File([this.response], 'temp');
          var fileReader = new FileReader();
          fileReader.addEventListener('load', function(){
               //do stuff with fileReader.result               
                mydata = JSON.parse(fileReader.result);
                if(pesquisa == "")
                  loadCards(mydata, page);
                else
                  pesquisar(mydata, page, pesquisa);

          });
          fileReader.readAsText(file);
      } 
    }
    xhr.send();
}

function loadCards(mydata, page) {
  page = getNextPageNumber(page, mydata);
  updatePaginationStyle(page, mydata);
  fillCardElements(page, mydata);
}

function updatePaginationStyle(page, data) {
  var paginationElements = document.querySelectorAll(".page-item");
  for(var i = 0; i < paginationElements.length; i++) {
      paginationElements[i].classList.remove("disabled");

      if(i == page) {
        paginationElements[i].classList.add("disabled");
      }
  }

  if(page == 1) {
    paginationElements[0].classList.add("disabled");
  }
  else if(page == (data.length/3)) {
    paginationElements[9].classList.add("disabled");
  }
}

function fillCardElements(page, mydata){
  for(var i = 0; i < 3; i++){
    var card = document.querySelectorAll(".card")[i];
    item = (page - 1) * 3 + i;

    if(item >= mydata.length) {
      card.getElementsByTagName("img")[0].src = "";
      card.getElementsByTagName("h5")[0].textContent = "Faça uma nova consulta";
      card.getElementsByTagName("p")[0].textContent = "";
      card.getElementsByTagName("p")[1].textContent= card.getElementsByTagName("p")[1].textContent.substring(0, 8);
      
      continue;
    }

    card.getElementsByTagName("img")[0].src = mydata[item].photo;
    card.getElementsByTagName("h5")[0].textContent = mydata[item].property_type;
    card.getElementsByTagName("p")[0].textContent = mydata[item].name;
    card.getElementsByTagName("p")[1].textContent = card.getElementsByTagName("p")[1].textContent.substring(0, 8) + " " + mydata[item].price + ",00";
  }
}

function getNextPageNumber(page, data) {
  page = page.toString().trim();
  var pageInt = parseInt(page);

  if(!isNaN(pageInt)) {
    return pageInt;
  }

  var pageMove = page;
  var disabledElements = document.querySelectorAll(".page-item.disabled a");

  for(var i = 0; i < disabledElements.length; i++) {
    if(disabledElements[i].getAttribute("aria-label") != null) {
      continue;
    }    
    
    page = parseInt(disabledElements[i].textContent);
  }

  var menos = document.querySelectorAll(".page-link")[0].textContent.toString().trim();
  var mais = document.querySelectorAll(".page-link")[document.querySelectorAll(".page-link").length - 1].textContent.toString().trim();

  if(pageMove == menos) {      
    if(page-1 <= 1)
      page = 1;
    else
      page = page - 1;
  }
  else if(pageMove == mais) { 
    
    if(page+1 >= (data.length/3))
      page = data.length/3;
    else
      page = page + 1;
  }

  return page;
}

readJSON("database/airbnb.json", 1, "");

var itens_paginacao = document.querySelectorAll(".page-item");
for(var i = 0; i < itens_paginacao.length; i++) {
  itens_paginacao[i].addEventListener("click", function () {
    var valueLocalizacao = document.querySelector("#inputLocalizacao").value;
    readJSON("database/airbnb.json", this.textContent, valueLocalizacao);
  });
}

btnHospedes = document.querySelectorAll("#menu03 .btn-group button");

for(var i = 0; i < btnHospedes.length; i++) {
  btnHospedes[i].addEventListener("click", function (event) {
    var element = event.currentTarget.parentNode;
    console.log(element);
    var q = parseInt(element.querySelector("p").textContent);
    if(this.textContent == "+"){
      if(q < 4)
        q++;
    }      
    else if(this.textContent == "-") {
      if(q > 0)
        q--;
    }      
    
    element.querySelector("p").textContent = q;
    atualizarInputHospedes();
    event.stopPropagation();
  });
}

function atualizarInputHospedes() {
  var pArray = document.querySelectorAll(".dropdown-item .btn-group p");
  var inputHospedes = document.querySelector("#inputHospedes");

  var intHospedes = parseInt(pArray[0].textContent) + parseInt(pArray[1].textContent) + parseInt(pArray[2].textContent); 
  var strInput = intHospedes + ((intHospedes > 1) ? " Hóspedes" : " Hóspede");

  inputHospedes.value = (intHospedes > 0) ? strInput : "";
}

var linksLocalizacao = document.querySelectorAll("#inputLocalizacao+div a");
linksLocalizacao.forEach(function (el) {
  el.addEventListener("click", function() {
    document.querySelector("#inputLocalizacao").value = this.textContent;
  });
});

var btnBuscar = document.querySelector("#btnBuscar");
btnBuscar.addEventListener("click", function () {
  var pagination = document.querySelectorAll("#divPagination li");
  var valueLocalizacao = document.querySelector("#inputLocalizacao").value;
  var hasElement = false;
  for(var i = 0; i < linksLocalizacao.length; i++) {
    if(valueLocalizacao != linksLocalizacao[i].textContent)
      continue;

    hasElement = true;
  }  
  
  if(!hasElement){
    alert("Não foram encontrados resultados para sua pesquisa.");
    isFullPagination(true);
    readJSON("database/airbnb.json", 1, "");
    return;
  }

  readJSON("database/airbnb.json", 1, valueLocalizacao);
  location.href = "#card01";
});

function pesquisar(mydata, page, pesquisa) {  
  isFullPagination(false);
  var modPesquisa = 0;
  var dadosPesquisa = [];

  if(pesquisa.toLowerCase() == "manaus/am")
    modPesquisa = 0;
  else if(pesquisa.toLowerCase() == "maués/am")
    modPesquisa = 1;
  else if(pesquisa.toLowerCase() == "novo airão/am")
    modPesquisa = 2;
  else if(pesquisa.toLowerCase() == "parintins/am")
    modPesquisa = 3;

  console.log("mydata " + mydata.length);
  for(var i = 0; i < mydata.length; i++) {
    if(i % 4 == modPesquisa) {
      dadosPesquisa.push(mydata[i]);
      console.log("i - " + i);
    }
  }

  loadCards(dadosPesquisa, page)
  console.log("dadospesquisa " + dadosPesquisa.length);
}

function isFullPagination(isVisible){
  var liPagination = document.querySelectorAll("#divPagination li");
  
  for(var i = 0; i < liPagination.length; i++){
    if(i < 3 || i == 9)
      continue;
    
    if(isVisible) {
      liPagination[i].style.display = "block";
      liPagination[i].style.visibility = "visible";
    }
    else {
      liPagination[i].style.display = "none";
      liPagination[i].style.visibility = "hidden";
    }
  }
}
