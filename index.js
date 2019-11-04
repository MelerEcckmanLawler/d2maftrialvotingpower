const rankedIds = require('./RankedReportIds.json')
const idealIds = require('./IdealIds.json')
const parseReport = require('salem-trial-parser')
const fs = require('fs')
const nGram = require('n-gram')
const colors = require('colors')
require('node-json-color-stringify')

'use strict'

let rolelist = `Blackmailer
BM
BMr
BMer
Consigliere
consig
Consort
Disguiser
disg
dis
Framer
Forger
Godfather
gf
Janitor
jan
janny
jany
jani
Mafioso
maf
Hypnotist
Ambusher
BodyGuard
bg
Crusader
Psychic
Doctor
doc
Escort
esc
Investigator
inv
invest
investi
Jailor
jailer
Lookout
lo
Mayor
Medium
med
Retributionist
ret
retri
Sheriff
sher
sherriff
sherrif
sheri
sherri
Spy
Transporter
tran
trans
Trapper
Veteran
vet
Tracker
Vigilante
vig
vigi
VampireHunter
Amnesiac
Arsonist
arso
Executioner
exe
exec
Jester
jest
Serial Killer
sk
Survivor
Witch
Werewolf
ww`.toUpperCase().split('\n')

function deAbbreviate(role) {
  role = role.replace(/\bEXE\b/, 'EXECUTIONER')
  role = role.replace(/\bEXEC\b/, 'EXECUTIONER')
  role = role.replace(/\bBM\b/, 'BLACKMAILER')
  role = role.replace(/\bBMR\b/, 'BLACKMAILER')
  role = role.replace(/\bBMER\b/, 'BLACKMAILER')
  role = role.replace(/\bCONSIG\b/, 'CONSIGLIERE')
  role = role.replace(/\bDIS\b/, 'DISGUISER')
  role = role.replace(/\bDISG\b/, 'DISGUISER')
  role = role.replace(/\bGF\b/, 'GODFATHER')
  role = role.replace(/\bJAN\b/, 'JANITOR')
  role = role.replace(/\bJANI\b/, 'JANITOR')
  role = role.replace(/\bJANY\b/, 'JANITOR')
  role = role.replace(/\bJANNI\b/, 'JANITOR')
  role = role.replace(/\bJANNY\b/, 'JANITOR')
  role = role.replace(/\bMAF\b/, 'MAFIA')
  role = role.replace(/\bBG\b/, 'BODYGUARD')
  role = role.replace(/\bDOC\b/, 'DOCTOR')
  role = role.replace(/\bESC\b/, 'ESCORT')
  role = role.replace(/\bINV\b/, 'INVESTIGATOR')
  role = role.replace(/\bINVEST\b/, 'INVESTIGATOR')
  role = role.replace(/\bINVESTI\b/, 'INVESTIGATOR')
  role = role.replace(/\bJAILER\b/, 'JAILOR')
  role = role.replace(/\bLO\b/, 'LOOKOUT')
  role = role.replace(/\bMED\b/, 'MEDIUM')
  role = role.replace(/\bRET\b/, 'RETRIBUTIONIST')
  role = role.replace(/\bRETRI\b/, 'RETRIBUTIONIST')
  role = role.replace(/\bRETRIB\b/, 'RETRIBUTIONIST')
  role = role.replace(/\bSHER\b/, 'SHERIFF')
  role = role.replace(/\bSHERRIFF\b/, 'SHERIFF')
  role = role.replace(/\bSHERRIF\b/, 'SHERIFF')
  role = role.replace(/\bSHERI\b/, 'SHERIFF')
  role = role.replace(/\bSHERRI\b/, 'SHERIFF')
  role = role.replace(/\bTRAN\b/, 'TRANSPORTER')
  role = role.replace(/\bTRANS\b/, 'TRANSPORTER')
  role = role.replace(/\bVET\b/, 'VETERAN')
  role = role.replace(/\bVIG\b/, 'VIGILANTE')
  role = role.replace(/\bVIGI\b/, 'VIGILANTE')
  role = role.replace(/\bARSO\b/, 'ARSONIST')
  role = role.replace(/\bEXE\b/, 'EXECUTIONER')
  role = role.replace(/\bEXEC\b/, 'EXECUTIONER')
  role = role.replace(/\bJEST\b/, 'JESTER')
  role = role.replace(/\bSK\b/, 'SERIAL KILLER')
  role = role.replace(/\bSERIALKILLER\b/, 'SERIAL KILLER')
  role = role.replace(/\bWW\b/, 'WEREWOLF')
  role = role.replace(/\bINNO\b/, 'INNOCENT')
  role = role.replace(/\bTS\b/, 'TOWN SUPPORT')
  role = role.replace(/\bTK\b/, 'TOWN KILLING')
  role = role.replace(/\bTOWN KILLER\b/, 'TOWN KILLING')
  role = role.replace(/\bRT\b/, 'RANDOM TOWN')
  role = role.replace(/\bRM\b/, 'RANDOM MAFIA')
  role = role.replace(/\bTI\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INV\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INVEST\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INVESTI\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INVESTIGATOR\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTP\b/, 'TOWN PROTECTIVE')
  role = role.replace(/\bTP\b/, 'TOWN PROTECTOR')
  role = role.replace(/\bNE\b/, 'NEUTRAL EVIL')
  role = role.replace(/\bNEUT\b/, 'NEUTRAL')
  role = role.replace(/\bNK\b/, 'NEUTRAL KILLER')
  return role
}


let defaultNames = `Cotton Mather
Deodat Lawson
Edward Bishop
Giles Corey
James Bayley
James Russel
John Hathorne
John Proctor
John Willard
Jonathan Corwin
Samuel Parris
Samuel Sewall
Thomas Danforth
William Hobbs
William Phips
Abigail Hobbs
Alice Parker
Alice Young
Ann Hibbins
Ann Putnam
Ann Sears
Betty Parris
Dorothy Good
Lydia Dustin
Martha Corey
Mary Eastey
Mary Johnson
Mary Warren
Sarah Bishop
Sarah Good
Sarah Wildes`.split('\n')

let defaultNamesMale = `Cotton Mather
Deodat Lawson
Edward Bishop
Giles Corey
James Bayley
James Russel
John Hathorne
John Proctor
John Willard
Jonathan Corwin
Samuel Parris
Samuel Sewall
Thomas Danforth
William Hobbs
William Phips`.split('\n')

let defaultNamesFemale = `Abigail Hobbs
Alice Parker
Alice Young
Ann Hibbins
Ann Putnam
Ann Sears
Betty Parris
Dorothy Good
Lydia Dustin
Martha Corey
Mary Eastey
Mary Johnson
Mary Warren
Sarah Bishop
Sarah Good
Sarah Wildes`.split('\n')

let stopwords = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "cause", "causes", "certain", "certainly", "changes", "clearly", "co", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "inc", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "j", "just", "k", "keep", "keeps", "kept", "know", "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take", "taken", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various", "very", "via", "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "y", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"]
for (let i = 0; i < stopwords.length; i++) {
  stopwords[i] = stopwords[i].toUpperCase().replace(/'/g, '')
}
function removeStopwords(str) {
  let res = []
  let wrds = str.split(' ')
  for (i = 0; i < wrds.length; i++) {
    if (!stopwords.includes(wrds[i])) {
      res.push(wrds[i])
    }
  }
  return (res.join(' '))
}

function spaceCount(str) {
  return count(str, ' ')
}

function HASH(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

function count(main_str, sub_str) {
  main_str += '';
  sub_str += '';
  if (sub_str.length <= 0) {
    return main_str.length + 1;
  }
  subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}

function avg(array) {
  return array.reduce((p, c, i) => { return p + (c - p) / (i + 1) }, 0)
}

function pad(n) {
  return n.toString().padStart(3, '0')
}

let townRolelist = `Investigator
Lookout
Sheriff
Spy
Veteran
Vigilante
Bodyguard
Jailor
Doctor
Escort
Mayor
Medium
Retributionist
Transporter`.toUpperCase().split('\n')

let mafiaRolelist = `Disguiser
Forger
Janitor
Godfather
Mafioso
Blackmailer
Consigliere
Consort`.toUpperCase().split('\n')

/*
let I = 0
recursiveReportOpener(I)
function recursiveReportOpener(i) {
  let filename = `${rankedIds[I]}.html`
  let reportId = rankedIds[I]
  parseReport(filename).then((report) => {
    doStuff(report, reportId)
    I++
    if (I < rankedIds.length) {
      recursiveReportOpener(I)
    }
  }).catch((e) => { console.log(e) })
}*/


let I = 0
recursiveReportOpener(I)
function recursiveReportOpener(i) {
  let filename = `{idealIds[I]}.html`
  let reportId = idealIds[I]
  parseReport(filename).then((report) => {
    doStuff(report, reportId)
    I++
    if (I < idealIds.length) {
      recursiveReportOpener(I)
    }
  }).catch((e) => { console.log(e) })
}


const perc = (n, t) => parseFloat(((n / t) * 100).toFixed(1))

let stream1 = fs.createWriteStream('output1.json', { flags: 'a' });
let stream2 = fs.createWriteStream('output2.json', { flags: 'a' });

let dupeCount = 0
let dupes = []
let matchesTotal = 0
let matchesProcessed = 0
let OUTPUT = {}

function doStuff(report, reportId) {
  matchesTotal++
  let players = report.players
  let entries = report.entries
  let metaData = report.metaData

  let hash = JSON.stringify(players)
  hash = HASH(hash)
  if (dupes.includes(hash)) {
    console.log(reportId + ' Duplicate')
    dupeCount++
    console.log('Dupe count: ' + dupeCount)
    return
  } else {
    dupes.push(hash)
  }

  if (metaData.reportReason == 'Gamethrowing') {
    console.log(`${reportId} ` + 'Gamethrower!'.red)
    //return
  }
  if (metaData.reportReason == 'Cheating') {
    console.log(`${reportId} ` + 'Cheating!'.magenta)
    //return
  }
  /*
  for (let name in players) {
    if (players[name].account == metaData.reportedPlayer) {
      console.log(reportId + ' ' + players[name].role + ' REPORTED!')
      OUTPUT[players[name].role] = ++OUTPUT[players[name].role] || 1
    }
  }*/

  /*
  for (let name in players) {
    let player = players[name]
    if (player.left) {
      let date = player.left.split('.')[0]
      if (date == 'D0' || date == 'D1' || date == 'N1') {
        console.log(`${reportId} ` + `${player.role} left d0`.yellow)
        return
      }
    }
  }*/

  let ROLES = []
  let J = 0
  for (let name in players) {
    ROLES.push(players[name].role)
    J++
  }

  var map = {};
  var count = ROLES.map(function (val) {
    return map[val] = (typeof map[val] === "undefined") ? 1 : map[val] + 1;
  });

  var newArray = ROLES.map(function (val, index) {
    if (map[val] === 1) {
      return val;
    } else {
      return val + '' + count[index];
    }
  });

  J = 0
  for (let name in players) {
    players[name].role = newArray[J]
    J++
  }

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    if (entry.type == 'TRIAL OUTCOME' && entry.time.split('.')[0] == 'D2') {
      let accused = entry.accused
      let player = players[accused]
      if (player.faction == 'Mafia') {
        let votes = entry.votes
        let otherAbstains = 0
        let otherGuilties = 0
        let otherInnoes = 0

        let mafiaVoters = 0
        //console.log(reportId)
        for (let j = 0; j < votes.length; j++) {
          let vote = votes[j]
          //console.log(`${players[vote.author].faction} ${vote.vote}`)
          if (players[vote.author].faction != 'Mafia') {
            if (vote.vote == 'abstain') { otherAbstains++; console.log(`Town`.white) }
            if (vote.vote == 'guilty') { otherGuilties++; console.log(`Town`.red) }
            if (vote.vote == 'innocent') { otherInnoes++; console.log(`Town`.green) }
          } else {
            mafiaVoters++
            if (vote.vote == 'abstain') { console.log(`Mafia`.white) }
            if (vote.vote == 'guilty') { console.log(`Mafia`.red) }
            if (vote.vote == 'innocent') { console.log(`Mafia`.green) }
          }
        }
        let potentialOutcome = (otherGuilties > (otherInnoes + mafiaVoters)).toString()
        potentialOutcome = potentialOutcome.replace('true', 'lynched').replace('false', 'pardoned')
        let defaultOutcome = (otherGuilties > otherInnoes).toString()
        defaultOutcome = defaultOutcome.replace('true', 'lynched').replace('false', 'pardoned')
        let output1 = ''
        let output2 = ''
        let output3 = ''
        if (defaultOutcome == 'lynched') { output1 = `${defaultOutcome}`.red }
        if (defaultOutcome == 'pardoned') { output1 = `${defaultOutcome}`.green }
        if (entry.outcome == 'lynched') { output2 = `${entry.outcome}`.red }
        if (entry.outcome == 'pardoned') { output2 = `${entry.outcome}`.green }
        if (potentialOutcome == 'lynched') { output3 = `${potentialOutcome}`.red }
        if (potentialOutcome == 'pardoned') { output3 = `${potentialOutcome}`.green }
        let townChoice = output1
        let reality = output2
        let ifMafiaInnoed = output3
        console.log('Outcome: ' + reality, '\nTown choice: ' + townChoice, '\nIf maf innoed: ' + ifMafiaInnoed)

        OUTPUT['TOTAL'] = ++OUTPUT['TOTAL'] || 1

        if (entry.outcome == defaultOutcome && entry.outcome == potentialOutcome) {
          console.log(`Mafia votes were useless!`.cyan)
          OUTPUT['NO AFFECT'] = ++OUTPUT['NO AFFECT'] || 1
        }

        if (reality.includes('pardoned') && townChoice.includes('lynched')) {
          console.log(`Mafia saved their own!`.green)
          OUTPUT['SAVED'] = ++OUTPUT['SAVED'] || 1
        }

        if (reality.includes('lynched') && ifMafiaInnoed.includes('pardoned')) {
          console.log(`Mafia should have pardoned!`.yellow)
          OUTPUT['COULD HAVE PARDONED'] = ++OUTPUT['COULD HAVE PARDONED'] || 1
        }
        if (reality.includes('lynched') && townChoice.includes('pardoned')) {
          console.log(`Mafia forced the lynch of their own member!`.magenta)
          OUTPUT['FORCED LYNCH'] = ++OUTPUT['FORCED LYNCH'] || 1
        }
      }
    }
  }

  matchesProcessed++
  console.log(reportId + ' ' + matchesProcessed + ' ' + matchesTotal)
}

process.on('exit', () => {
  console.log('exit')
  stream1.write(JSON.stringify(OUTPUT, null, 2), (() => { }))
  console.log('Saved to file.')
})

process.on('SIGINT', () => {
  console.log('SIGINT')
  console.log(JSON.colorStringify(OUTPUT, null, 2))
  process.exit(); // Add code if necessary
});

/*
phrase = phrase
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, '')
        .replace(/[0-9]/g, '#')
        .replace(/###/g, '#')
        .replace(/##/g, '#')
        .trim()
      if (phrases[phrase] === undefined) {
        phrases[phrase] = { WON: 0, LOST: 0 }
      }
      phrases[phrase][outcome]++
      */
