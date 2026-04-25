//+++ Gify Builder Script +++

//Sample elements
var sampleArea = document.getElementById('b-sample');
var sampleName = document.getElementById('b-sample-name');
var sampleMap = document.getElementById('b-sample-map');
var samplePet = document.getElementById('b-sample-pet');
var sampleTableParts = document.querySelectorAll('.b-sample-table');

//Selector boxes
var elementSelector = document.getElementById('b-element');
var petSelector = document.getElementById('b-pet');
var mapSelector = document.getElementById('b-map');
var backgroundSelector = document.getElementById('b-background');
var textColorSelector = document.getElementById('b-textcolor');
var tableColorSelector = document.getElementById('b-tablecolor');

//Output boxes
var urlBox = document.getElementById('b-urlbox');
var linkBox = document.getElementById('b-petlink');

//Configured Vars
var name;
var gender;
var element;
var pet;
var map;
var timeStamp;

var background;
var tablecolor;
var textcolor;

function refreshVars() {
    name = document.getElementById('b-name').value;
    name = name.substring(0, 8); //Names are limited to 8 for compatability

    timeStamp = Math.floor(Date.now() / 1000);

    for (var i = 0; i < 3; i++) {
        var docId = 'b-gender-' + i;

        if (document.getElementById(docId).checked) {
            gender = document.getElementById(docId).value;
        }
    }

    element = elementSelector.options[elementSelector.selectedIndex].value;

    pet = petSelector.options[petSelector.selectedIndex].value;
    if (pet == 'custom') {
        pet = document.getElementById('b-pet-url').value;
    }

    map = mapSelector.options[mapSelector.selectedIndex].value;
    if (map == 'custom') {
        map = document.getElementById('b-map-url').value;
    }

    background = backgroundSelector.options[backgroundSelector.selectedIndex].value;
    if (background == 'custom') {
        background = document.getElementById('b-background-url').value;
    }

    tablecolor = tableColorSelector.options[tableColorSelector.selectedIndex].value;
    if (tablecolor == 'custom') {
        tablecolor = document.getElementById('b-tablecolor-code').value;
    }

    textcolor = textColorSelector.options[textColorSelector.selectedIndex].value;
    if (textcolor == 'custom') {
        textcolor = document.getElementById('b-textcolor-code').value;
    }
}

function renderSample() {
    refreshVars();

    if (background.includes('://')) {
        sampleArea.style.backgroundImage = "url('" + background + "')";
    } else {
        sampleArea.style.backgroundImage = "url('pet/backgrounds/" + background + "')";
    }

    if (map.includes('://')) {
        sampleMap.style.backgroundImage = "url('" + map + "')";
    } else {
        sampleMap.style.backgroundImage = "url('pet/maps/" + map + "')";
    }

    if (pet.includes('://')) {
        samplePet.style.backgroundImage = "url('" + pet + "')";
    } else {
        samplePet.style.backgroundImage = "url('pet/pets/" + pet + "')";
    }

    sampleName.innerHTML = name;
    sampleArea.style.color = textcolor;

    for (var i = 0; i < sampleTableParts.length; i++) {
        sampleTableParts[i].style.borderColor = tablecolor;
    }
}

function renderURL() {
    refreshVars();

    var url = 'https://gifypet.neocities.org/pet/pet.html?';
    url += 'name=' + name;
    url += '&dob=' + timeStamp;
    url += '&gender=' + gender;
    url += '&element=' + element;
    url += '&pet=' + encodeURIComponent(pet);
    url += '&map=' + encodeURIComponent(map);
    url += '&background=' + encodeURIComponent(background);
    url += '&tablecolor=' + encodeURIComponent(tablecolor);
    url += '&textcolor=' + encodeURIComponent(textcolor);

    urlBox.value = '<iframe width="314" height="321" scrolling="no" src="' + url + '" frameborder="0"></iframe>';

    linkBox.innerHTML = '<a href="' + url + '" target="_blank">Or click here to visit your pet in a new tab!</a>';
}

// +++ Webpage Stuffz +++

window.onload = function () {
    //Sticky Nav Bar
    var menu = document.getElementById('navy');
    var menuPosition = menu.getBoundingClientRect().top + window.scrollY;
    window.addEventListener('scroll', function () {
        if (window.pageYOffset + 20 >= menuPosition) {
            menu.style.position = 'fixed';
            menu.style.top = '20px';
        } else {
            menu.style.position = 'relative';
            menu.style.top = '';
        }
    });
};
