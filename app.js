
let wines = JSON.parse(localStorage.getItem("vinmemo_wines")) || [];
let currentIndex = null;
let editMode = false;

const modal = document.getElementById("modal");
const viewMode = document.getElementById("viewMode");
const editModeDiv = document.getElementById("editMode");

function save(){
localStorage.setItem("vinmemo_wines", JSON.stringify(wines));
}

function showPage(page){
document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
document.getElementById(page).classList.remove("hidden");
render();
}

document.querySelectorAll(".nav button").forEach(btn=>{
btn.onclick=()=>showPage(btn.dataset.page);
});

function render(){

const wineList=document.getElementById("wineList");
const wishList=document.getElementById("wishlistList");
const archivList=document.getElementById("archivList");

if(wineList) wineList.innerHTML="";
if(wishList) wishList.innerHTML="";
if(archivList) archivList.innerHTML="";

wines.forEach((w,i)=>{

const card=document.createElement("div");
card.innerHTML=`
<b>${w.name}</b><br>
${w.producer||""}<br>
${w.vintage||""} ${w.region||""}<br>
🍷 ${w.remaining} | getrunken ${w.drank}
`;

card.onclick=()=>openWine(i);

if(w.remaining>0 && wineList) wineList.appendChild(card);
if(w.wishlist && wishList) wishList.appendChild(card);
if(w.remaining===0 && archivList) archivList.appendChild(card);

});

document.getElementById("stats").innerText=
"Keller: "+wines.reduce((a,w)=>a+w.remaining,0)+
" | Wishlist: "+wines.filter(w=>w.wishlist).length+
" | Archiv: "+wines.filter(w=>w.remaining===0).length;

}

function openWine(i){

currentIndex=i;
const w=wines[i];

document.getElementById("viewName").innerText=w.name;
document.getElementById("viewProducer").innerText=w.producer||"";
document.getElementById("viewVintage").innerText=w.vintage||"";
document.getElementById("viewRegion").innerText=w.region||"";
document.getElementById("viewCounter").innerText=
"Verbleibend "+w.remaining+" | Getrunken "+w.drank;
document.getElementById("viewNotes").innerText=w.notes||"";

document.getElementById("editName").value=w.name;
document.getElementById("editProducer").value=w.producer||"";
document.getElementById("editVintage").value=w.vintage||"";
document.getElementById("editRegion").value=w.region||"";
document.getElementById("editNotes").value=w.notes||"";
document.getElementById("editWishlist").checked=w.wishlist||false;

viewMode.classList.remove("hidden");
editModeDiv.classList.add("hidden");
editMode=false;

modal.classList.remove("hidden");
}

document.getElementById("closeBtn").onclick=()=>{
closeModal();
};

modal.onclick=(e)=>{
if(e.target===modal) closeModal();
};

function closeModal(){

if(editMode){
let w=wines[currentIndex];

w.name=document.getElementById("editName").value;
w.producer=document.getElementById("editProducer").value;
w.vintage=document.getElementById("editVintage").value;
w.region=document.getElementById("editRegion").value;
w.notes=document.getElementById("editNotes").value;
w.wishlist=document.getElementById("editWishlist").checked;

save();
}

modal.classList.add("hidden");
render();

}

document.getElementById("editBtn").onclick=()=>{

editMode=!editMode;

viewMode.classList.toggle("hidden");
editModeDiv.classList.toggle("hidden");

};

document.getElementById("drinkBtn").onclick=()=>{

let w=wines[currentIndex];
if(w.remaining>0){
w.remaining--;
w.drank++;
save();
render();
}

};

document.getElementById("buyBtn").onclick=()=>{

let amount=parseInt(prompt("Wie viele Flaschen?"));
if(!amount) return;

let w=wines[currentIndex];
w.remaining+=amount;
save();
render();

};

document.getElementById("deleteBtn").onclick=()=>{

if(!confirm("Wein löschen?")) return;

wines.splice(currentIndex,1);
save();
closeModal();

};

document.getElementById("addWine").onclick=()=>{

let name=prompt("Weinname");
if(!name) return;

let producer=prompt("Produzent");
let vintage=prompt("Jahrgang");
let region=prompt("Region");
let bottles=parseInt(prompt("Flaschen"))||0;

wines.push({
name,
producer,
vintage,
region,
remaining:bottles,
drank:0,
wishlist:false,
notes:""
});

save();
render();

};

render();
