
let wines = JSON.parse(localStorage.getItem("vinmemo_wines")) || [];
let locations = JSON.parse(localStorage.getItem("vinmemo_locations")) || [];
let glasses = JSON.parse(localStorage.getItem("vinmemo_glasses")) || [];
let currentWineIndex = null;

function save(){
localStorage.setItem("vinmemo_wines", JSON.stringify(wines));
localStorage.setItem("vinmemo_locations", JSON.stringify(locations));
localStorage.setItem("vinmemo_glasses", JSON.stringify(glasses));
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
render();
}

function renderCard(wine,i){
let card=document.createElement("div");
card.className="wineCard";
card.innerHTML=`<b>${wine.name}</b><br>${wine.producer}<br>${wine.vintage} • ${wine.region}<br>Verbleibend: ${wine.remaining} | Getrunken: ${wine.drank}`;
card.onclick=()=>openDetail(i);
return card;
}

function render(){

let keller=document.getElementById("kellerListe");
let wishlist=document.getElementById("wishlistListe");
let archiv=document.getElementById("archivListe");

keller.innerHTML="";
wishlist.innerHTML="";
archiv.innerHTML="";

wines.forEach((wine,i)=>{

if(wine.remaining>0){
keller.appendChild(renderCard(wine,i));
}

if(wine.wishlist){
wishlist.appendChild(renderCard(wine,i));
}

if(wine.remaining===0){
archiv.appendChild(renderCard(wine,i));
}

});

document.getElementById("countKeller").innerText =
wines.reduce((a,w)=>a+w.remaining,0)+" Flaschen";

document.getElementById("countWishlist").innerText =
wines.filter(w=>w.wishlist).length+" Weine";

document.getElementById("countArchiv").innerText =
wines.filter(w=>w.remaining===0).length+" Weine";

renderSettings();
}

function renderSettings(){

let loc=document.getElementById("locationList");
loc.innerHTML="";
locations.forEach((l,i)=>{
let li=document.createElement("li");
li.innerHTML=l+" <button onclick='deleteLocation("+i+")'>X</button>";
loc.appendChild(li);
});

let gl=document.getElementById("glassList");
gl.innerHTML="";
glasses.forEach((g,i)=>{
let li=document.createElement("li");
li.innerHTML=g+" <button onclick='deleteGlass("+i+")'>X</button>";
gl.appendChild(li);
});
}

function addLocation(){
let name=prompt("Lagerort");
if(!name) return;
locations.push(name);
save();render();
}

function deleteLocation(i){
locations.splice(i,1);
save();render();
}

function addGlass(){
let name=prompt("Glas");
if(!name) return;
glasses.push(name);
save();render();
}

function deleteGlass(i){
glasses.splice(i,1);
save();render();
}

function openDetail(i){

currentWineIndex=i;
let wine=wines[i];

document.getElementById("detailName").value=wine.name;
document.getElementById("detailProducer").value=wine.producer;
document.getElementById("detailVintage").value=wine.vintage;
document.getElementById("detailRegion").value=wine.region;

document.getElementById("detailCounter").innerText=
"Getrunken: "+wine.drank+" | Verbleibend: "+wine.remaining;

document.getElementById("notes").value=wine.notes||"";

document.getElementById("wishlistToggle").checked=wine.wishlist;

document.getElementById("detailModal").classList.remove("hidden");
}

function closeModal(){

let wine=wines[currentWineIndex];

wine.name=document.getElementById("detailName").value;
wine.producer=document.getElementById("detailProducer").value;
wine.vintage=document.getElementById("detailVintage").value;
wine.region=document.getElementById("detailRegion").value;
wine.notes=document.getElementById("notes").value;
wine.wishlist=document.getElementById("wishlistToggle").checked;

save();
render();

document.getElementById("detailModal").classList.add("hidden");
}

window.onclick=function(e){
let modal=document.getElementById("detailModal");
if(e.target===modal){
closeModal();
}
}

function drinkBottle(){

let wine=wines[currentWineIndex];

if(wine.remaining>0){
wine.remaining--;
wine.drank++;
}

save();
render();
}

function addPurchase(){

let wine=wines[currentWineIndex];

let amount=Number(prompt("Wie viele Flaschen gekauft?"));
let price=prompt("Preis pro Flasche");
let date=prompt("Kaufdatum");

wine.purchases.push({amount,price,date});
wine.remaining+=amount;

save();render();
}

function deleteWine(){

if(!confirm("Wein wirklich löschen?")) return;

wines.splice(currentWineIndex,1);

save();
render();
closeModal();
}

document.getElementById("addWine").onclick=()=>{

let name=prompt("Weinname");
let producer=prompt("Produzent");
let vintage=prompt("Jahrgang");
let region=prompt("Region");
let amount=Number(prompt("Flaschen gekauft"));
let price=prompt("Preis pro Flasche");
let date=prompt("Kaufdatum");

wines.push({
name,
producer,
vintage,
region,
wishlist:false,
rating:0,
notes:"",
remaining:amount,
drank:0,
purchases:[{amount,price,date}]
});

save();
render();
}

render();
