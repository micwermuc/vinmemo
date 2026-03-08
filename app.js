
let wines = JSON.parse(localStorage.getItem("vinmemo_wines")) || [];
let locations = JSON.parse(localStorage.getItem("vinmemo_locations")) || ["Cellar"];
let glasses = JSON.parse(localStorage.getItem("vinmemo_glasses")) || [];

let currentWineIndex=null;

function save(){
localStorage.setItem("vinmemo_wines",JSON.stringify(wines));
localStorage.setItem("vinmemo_locations",JSON.stringify(locations));
localStorage.setItem("vinmemo_glasses",JSON.stringify(glasses));
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
render();
}

function render(){

let list=document.getElementById("wineList");
let wishlist=document.getElementById("wishlistList");

list.innerHTML="";
wishlist.innerHTML="";

wines.forEach((wine,i)=>{

let card=document.createElement("div");
card.className="wineCard";

card.innerHTML=`
<b>${wine.name}</b><br>
${wine.producer}<br>
${wine.vintage} • ${wine.region}<br>
🍷 ${wine.bottles}<br>
⭐ ${wine.rating||0}
`;

card.onclick=()=>openDetail(i);

if(wine.wishlist) wishlist.appendChild(card);
else list.appendChild(card);

});

document.getElementById("bottleCount").innerText =
wines.reduce((a,b)=>a+b.bottles,0)+" Flaschen";

document.getElementById("wishlistCount").innerText =
wines.filter(w=>w.wishlist).length+" Weine";

renderSettings();

}

function renderSettings(){

let loc=document.getElementById("locationList");
loc.innerHTML="";

locations.forEach((l,i)=>{

let li=document.createElement("li");
li.innerHTML=`${l} <button onclick="editLocation(${i})">✏️</button> <button onclick="deleteLocation(${i})">🗑</button>`;

loc.appendChild(li);

});

let gl=document.getElementById("glassList");
gl.innerHTML="";

glasses.forEach((g,i)=>{

let li=document.createElement("li");
li.innerHTML=`${g} <button onclick="editGlass(${i})">✏️</button> <button onclick="deleteGlass(${i})">🗑</button>`;

gl.appendChild(li);

});

}

function addLocation(){
let name=prompt("Location name");
if(!name) return;
locations.push(name);
save();render();
}

function editLocation(i){
let name=prompt("Edit location",locations[i]);
if(!name) return;
locations[i]=name;
save();render();
}

function deleteLocation(i){
locations.splice(i,1);
save();render();
}

function addGlass(){
let name=prompt("Glass name");
if(!name) return;
glasses.push(name);
save();render();
}

function editGlass(i){
let name=prompt("Edit glass",glasses[i]);
if(!name) return;
glasses[i]=name;
save();render();
}

function deleteGlass(i){
glasses.splice(i,1);
save();render();
}

function openDetail(i){

currentWineIndex=i;
let wine=wines[i];

document.getElementById("detailName").innerText=wine.name;
document.getElementById("detailInfo").innerText=wine.producer+" • "+wine.vintage;

document.getElementById("notes").value=wine.notes||"";

document.getElementById("wishlistToggle").checked=wine.wishlist;

document.getElementById("wishlistToggle").onchange=(e)=>{
wine.wishlist=e.target.checked;
save();render();
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

function editWine(){

let wine=wines[currentWineIndex];

wine.name=prompt("Name",wine.name);
wine.producer=prompt("Producer",wine.producer);
wine.vintage=prompt("Vintage",wine.vintage);
wine.region=prompt("Region",wine.region);
wine.bottles=Number(prompt("Bottles",wine.bottles));

save();
render();

}

function deleteWine(){

if(!confirm("Delete wine?")) return;

wines.splice(currentWineIndex,1);

save();
render();
closeModal();

}

document.getElementById("addWine").onclick=()=>{

let name=prompt("Wine name");
let producer=prompt("Producer");
let vintage=prompt("Vintage");
let region=prompt("Region");
let bottles=Number(prompt("Bottles",1));

wines.push({
name,
producer,
vintage,
region,
bottles,
wishlist:false,
rating:0,
notes:""
});

save();
render();

}

render();
