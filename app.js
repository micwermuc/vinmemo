
let wines = JSON.parse(localStorage.getItem("vinmemo_wines")) || [];

let currentWineIndex = null;

function save(){
localStorage.setItem("vinmemo_wines", JSON.stringify(wines));
}

function render(){

let list = document.getElementById("wineList");
list.innerHTML="";

wines.forEach((wine,i)=>{

let card = document.createElement("div");
card.className="wineCard";

card.innerHTML = `
<b>${wine.name}</b><br>
${wine.producer}<br>
${wine.vintage} • ${wine.region}<br>
🍷 ${wine.bottles} Flaschen<br>
⭐ ${wine.rating || 0}
`;

card.onclick=()=>openDetail(i);

list.appendChild(card);

});

document.getElementById("bottleCount").innerText =
wines.reduce((a,b)=>a+b.bottles,0) + " Flaschen";

document.getElementById("wishlistCount").innerText =
wines.filter(w=>w.wishlist).length + " Weine";

}

function openDetail(index){

currentWineIndex=index;
let wine=wines[index];

document.getElementById("detailName").innerText=wine.name;
document.getElementById("detailInfo").innerText=wine.producer+" • "+wine.vintage;

document.getElementById("notes").value=wine.notes||"";

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
renderStars(i);
save();
render();
}

container.appendChild(s);

}

}

document.getElementById("closeModal").onclick=()=>{
document.getElementById("detailModal").classList.add("hidden");
}

document.getElementById("saveNotes").onclick=()=>{

wines[currentWineIndex].notes=document.getElementById("notes").value;

save();

}

document.getElementById("addWine").onclick = ()=>{

let name = prompt("Weinname");
let producer = prompt("Produzent");
let vintage = prompt("Jahrgang");
let region = prompt("Region");
let bottles = Number(prompt("Flaschen",1));

let wishlist = confirm("Zur Wishlist hinzufügen?");

wines.push({
name,
producer,
vintage,
region,
bottles,
wishlist,
rating:0,
notes:""
});

save();
render();

};

render();
