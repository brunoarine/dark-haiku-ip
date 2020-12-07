/* * darkhaiku.js
 *
 * Converts an IP into a macabre, degenerate dark haiku. It should work with
 * both IPv4 and IPv6.
 *
 * ========= USAGE =========
 *
 * generateHaiku(ip);
 *
 * ========= LICENSE =========
 *
 * Copyright 2020 Bruno Arine <bruno.arine@runbox.com>
 *
 * https://github.com/soldeace/dark-haiku-ip/blob/main/LICENSE
 */

// Dictionaries that are going to compose the dark haiku.
// They will be formatted as follows:
//
// "The <subjectAdj> <subjectColor> <subjectNoun>"
// "<subjectVerb> in the <placeAdj> <placeNoun>."
// "<objectNoun> <objectVerb>."

const subjectAdj = [
  "parched",
  "disturbed",
  "treacherous",
  "monstrous",
  "unfleshed",
  "ghostly",
  "cursed",
  "starved",
  "solitary",
  "dark",
  "vindictive",
  "vicious",
  "silent",
  "sly",
  "plagued",
  "moribund",
];

const subjectColor = [
  "burning",
  "black",
  "blue",
  "metallic",
  "silver",
  "brown",
  "dark",
  "grey",
  "green",
  "golden",
  "scarlet",
  "blood-red",
  "pale",
  "fiery",
  "red",
  "white",
];

const subjectNoun = [
  "dragon",
  "sorcerer",
  "worm",
  "zombie",
  "gargoyle",
  "goat",
  "witch",
  "demon",
  "knight",
  "spectrum",
  "master",
  "reaper",
  "devourer",
  "king",
  "spirit",
  "skeleton",
];

const subjectVerb = [
  "mourns",
  "rises",
  "cries",
  "plunges",
  "gorges",
  "battles",
  "wails",
  "hunts",
  "dives",
  "lies",
  "haunts",
  "flies",
  "sleeps",
  "dies",
  "awakes",
  "resurrects",
];

const placeAdj = [
  "ancient",
  "barren",
  "blazing",
  "enraged",
  "distant",
  "empty",
  "nebulous",
  "fetid",
  "freezing",
  "moonlit",
  "sombre",
  "cursed",
  "deadly",
  "unruly",
  "sulphurous",
  "tempestuous",
];

const placeNoun = [
  "valley",
  "ravine",
  "desolation",
  "hill",
  "forest",
  "crater",
  "jungle",
  "depth",
  "mountain",
  "dimension",
  "crypt",
  "immensity",
  "dune",
  "tundra",
  "sea",
  "galaxy",
];

const objectNoun = [
  "Armies of hell",
  "Pillars of fire",
  "Bones",
  "Flames of misery",
  "Rotting corpses",
  "Entrails",
  "Faces of agony",
  "Condemned shadows",
  "Horns",
  "Thorns",
  "Severed heads",
  "A thousand souls",
  "Clouds of blood",
  "Tentacles",
  "Worlds",
  "Winged demons",
];

const objectVerb = [
  "shatter",
  "unveil",
  "enrage",
  "clash",
  "tremble",
  "arise",
  "ressurect",
  "emerge",
  "quieten",
  "scramble",
  "defecate",
  "squirm",
  "masturbate",
  "burn",
  "scream",
  "drown",
];

// Let an IP be formed by 4 octets, such that each octet is
// result of a product x * y where x, y E [0.16]. This function
// decomposes the IP, so that the end result is a
// list with the decomposition of each octet.
function ip2decimal(ip) {
  var m = 16;
  var lista = [];
  var splittedIP = ip.split(".");
  for (i in splittedIP) {
    n = parseInt(splittedIP[i]);
    var y = n % m;
    var x = (n - y) / m;
    lista.push(x % m, y);
  }
  return lista;
}

// Shifts a list by n places to the right
function rotate(list, places) {
  places = -places - list.length * Math.floor(-places / list.length);
  list.push.apply(list, list.splice(0, places));
  return list;
}

// Rotate a list as if it were a roulette wheel. The number of seats
//     displaced from each item is taken from their own value.
//     Example:
//     encode([0,1,2])
//     [0,1,2] (shifts 0 places)
//     [2,0,1] (shifts 1 place)
//     [1,2,0] (shifts 2 places)
//     This is not encryption. It only serves to completely change
//     the haiku if only one digit is changed in the IP.
function encode(list) {
  var newList = list;
  for (i in list) {
    newList = rotate(newList, list[i]);
  }
  return newList;
}

// Search the dictionaries for the word corresponding to each
// number up to 16.
function decimal2words(list) {
  schema =
    `<p>The ${subjectAdj[list[0]]} ${subjectColor[list[2]]} ${
      subjectNoun[list[1]]
    }</p>` +
    `<p>${subjectVerb[list[3]]} in the ${placeAdj[list[5]]} ${
      placeNoun[list[4]]
    }.</p>` +
    `<p>${objectNoun[list[6]]} ${objectVerb[list[7]]}.</p`;
  return schema;
}

// Converts IPv6 to decimal numbers, but adds 1 to each token
// because rotate() won't work properly with zeros
function ipv6ToNumber(ip) {
  var digits = ip.split(":").slice(0, 4);
  converted =
    parseInt(digits[0] + 1, 16) +
    "." +
    parseInt(digits[1] + 1, 16) +
    "." +
    parseInt(digits[2] + 1, 16) +
    "." +
    parseInt(digits[3] + 1, 16);

  return converted;
}

function generateHaiku(ip) {
  if (ip.includes(":")) {
    ip = ipv6ToNumber(ip);
  }
  var decimal = ip2decimal(ip);
  var encodedDecimal = encode(decimal);
  var haiku = decimal2words(encodedDecimal);
  return haiku;
}

// const cloudflare = "https://www.cloudflare.com/cdn-cgi/trace";
// const ipify = "https://api.ipify.org";

// fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function (response) {
//   response.text().then(function (text) {
//     document.getElementById("ip").innerHTML = text.split("\n")[2].split("=")[1];
//     ip = document.getElementById("ip").innerHTML;
//     generateHaiku(ip);
//   });
// });

// ip = document.getElementById("ip").innerHTML;
// generateHaiku(ip);
