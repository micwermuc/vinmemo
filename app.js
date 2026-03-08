
let wines = JSON.parse(localStorage.getItem("vinmemo_wines")) || [];
let currentWineIndex = null;

function save(){
localStorage.setItem("vinmemo_wines", JSON.stringify(wines));
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
render();
}

function renderCard(wine,i){
let card=document.createElement("div");
card.className="wineCard";

card.innerHTML=`
<b>${wine.name}</b><br>
${wine.producer}<br>
${wine.vintage} • ${wine.region}<br>
🍷 ${wine.bottles} Flaschen<br>
⭐ ${wine.rating||0}
`;

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

if(wine.bottles > 0){
keller.appendChild(renderCard(wine,i));
}

if(wine.wishlist){
wishlist.appendChild(renderCard(wine,i));
}

if(wine.bottles === 0){
archiv.appendChild(renderCard(wine,i));
}

});

document.getElementById("countKeller").innerText =
wines.reduce((a,w)=>a+(w.bottles>0?w.bottles:0),0)+" Flaschen";

document.getElementById("countWishlist").innerText =
wines.filter(w=>w.wishlist).length+" Weine";

document.getElementById("countArchiv").innerText =
wines.filter(w=>w.bottles===0).length+" Weine";

}

function openDetail(i){

currentWineIndex=i;
let wine=wines[i];

document.getElementById("detailName").innerText=wine.name;
document.getElementById("detailInfo").innerText=wine.producer+" • "+wine.vintage;
document.getElementById("detailPreis").innerText="Preis pro Flasche: "+(wine.price||"-")+" €";
document.getElementById("detailKaufdatum").innerText="Kaufdatum: "+(wine.purchaseDate||"-");

document.getElementById("notes").value=wine.notes||"";

document.getElementById("wishlistToggle").checked=wine.wishlist;

document.getElementById("wishlistToggle").onchange=(e)=>{
wine.wishlist=e.target.checked;
save();
render();
};

renderStars(wine.rating||0);

document.getElementById("detailModal").classList.remove("hidden");
}

function renderStars(r){

let container=document.getElementById("rating");
container.innerHTML="";

for(let i=1;i<=5;i++){

let s=document.createElement("span");
s.innerText="⭐";

if(i<=r) s.style.opacity=1;
else s.style.opacity=0.3;

s.onclick=()=>{
wines[currentWineIndex].rating=i;
save();
renderStars(i);
render();
}

container.appendChild(s);
}
}

function closeModal(){
document.getElementById("detailModal").classList.add("hidden");
}

function saveNotes(){
wines[currentWineIndex].notes=document.getElementById("notes").value;
save();
}

function drinkBottle(){

let wine=wines[currentWineIndex];

if(wine.bottles>0){
wine.bottles--;
}

save();
render();
}

function addBottle(){

let wine=wines[currentWineIndex];
wine.bottles++;
save();
render();

}

function editWine(){

let wine=wines[currentWineIndex];

wine.name=prompt("Name",wine.name);
wine.producer=prompt("Produzent",wine.producer);
wine.vintage=prompt("Jahrgang",wine.vintage);
wine.region=prompt("Region",wine.region);
wine.price=prompt("Preis pro Flasche (€)",wine.price||"");
wine.purchaseDate=prompt("Kaufdatum",wine.purchaseDate||"");
wine.bottles=Number(prompt("Flaschen",wine.bottles));

save();
render();
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
let bottles=Number(prompt("Flaschen",1));
let price=prompt("Preis pro Flasche (€)");
let purchaseDate=prompt("Kaufdatum");

wines.push({
name,
producer,
vintage,
region,
bottles,
price,
purchaseDate,
wishlist:false,
rating:0,
notes:""
});

save();
render();
}

render();
