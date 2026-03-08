
let wines = JSON.parse(localStorage.getItem("vinmemo_wines")) || [];
let currentWineIndex=null;
let editMode=false;

function save(){
localStorage.setItem("vinmemo_wines",JSON.stringify(wines));
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
${wine.producer||""}<br>
${wine.vintage||""} • ${wine.region||""}<br>
🍷 ${wine.remaining} | getrunken ${wine.drank}
`;

card.onclick=()=>openDetail(i);
return card;
}

function render(){

let keller=document.getElementById("kellerListe");
let wishlist=document.getElementById("wishlistListe");
let archiv=document.getElementById("archivListe");

if(keller)keller.innerHTML="";
if(wishlist)wishlist.innerHTML="";
if(archiv)archiv.innerHTML="";

wines.forEach((wine,i)=>{

if(wine.remaining>0 && keller){
keller.appendChild(renderCard(wine,i));
}

if(wine.wishlist && wishlist){
wishlist.appendChild(renderCard(wine,i));
}

if(wine.remaining===0 && archiv){
archiv.appendChild(renderCard(wine,i));
}

});

if(document.getElementById("countKeller"))
document.getElementById("countKeller").innerText =
wines.reduce((a,w)=>a+w.remaining,0)+" Flaschen";

if(document.getElementById("countWishlist"))
document.getElementById("countWishlist").innerText =
wines.filter(w=>w.wishlist).length+" Weine";

if(document.getElementById("countArchiv"))
document.getElementById("countArchiv").innerText =
wines.filter(w=>w.remaining===0).length+" Weine";

}

function openDetail(i){

currentWineIndex=i;
let wine=wines[i];

document.getElementById("viewName").innerText=wine.name;
document.getElementById("viewProducer").innerText=wine.producer||"";
document.getElementById("viewVintage").innerText=wine.vintage||"";
document.getElementById("viewRegion").innerText=wine.region||"";
document.getElementById("viewCounter").innerText="Verbleibend "+wine.remaining+" | Getrunken "+wine.drank;
document.getElementById("viewNotes").innerText=wine.notes||"";

document.getElementById("editName").value=wine.name;
document.getElementById("editProducer").value=wine.producer||"";
document.getElementById("editVintage").value=wine.vintage||"";
document.getElementById("editRegion").value=wine.region||"";
document.getElementById("editNotes").value=wine.notes||"";
document.getElementById("editWishlist").checked=wine.wishlist||false;

editMode=false;
document.getElementById("editMode").classList.add("hidden");
document.getElementById("viewMode").classList.remove("hidden");

document.getElementById("detailModal").classList.remove("hidden");
}

function toggleEdit(){

editMode=!editMode;

document.getElementById("editMode").classList.toggle("hidden");
document.getElementById("viewMode").classList.toggle("hidden");

}

function closeModal(){

let wine=wines[currentWineIndex];

if(editMode){

wine.name=document.getElementById("editName").value;
wine.producer=document.getElementById("editProducer").value;
wine.vintage=document.getElementById("editVintage").value;
wine.region=document.getElementById("editRegion").value;
wine.notes=document.getElementById("editNotes").value;
wine.wishlist=document.getElementById("editWishlist").checked;

save();
}

document.getElementById("detailModal").classList.add("hidden");
render();

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
if(!amount)return;

wine.remaining+=amount;

save();
render();

}

function deleteWine(){

if(!confirm("Wein löschen?"))return;

wines.splice(currentWineIndex,1);
save();
render();
closeModal();

}

document.getElementById("addWine").onclick=()=>{

let name=prompt("Weinname");
if(!name)return;

let producer=prompt("Produzent");
let vintage=prompt("Jahrgang");
let region=prompt("Region");
let amount=Number(prompt("Flaschen"));

wines.push({
name,
producer,
vintage,
region,
remaining:amount||0,
drank:0,
wishlist:false,
notes:""
});

save();
render();

}

render();
