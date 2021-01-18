// fichier javascript pour Notifheure XL
// init variables
var init=1;
var debug=false;
var immp=false;
var boutons=["Aucune","Afficher / Masquer les secondes","Afficher / Masquer l'horloge","Mode luminosite Mini / Maxi / Automatique","On / Off Veilleuse","Historique Message","Afficher / masquer Minuteur","lancer Minuteur","Action 1","Action 2","Action 3","Sleep alarme","Eteindre alarme en cours","Afficher IP"];
var Actions = ['Aucune','Afficher / Masquer les Secondes', 'Activer / desactiver Horloge','Mode Manuel ( Mini ) - Manuel ( Maxi ) - Automatique','On / Off LED','Action 1','Action 2','Action 3','Action 4','Action 5','Action 6','Afficher Historique message'];
var couleurs=["Blanc","Rouge","Bleu","Vert","Jaune","Orange","Violet","Rose"];
var jours = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
var mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
var typeAudio = ["Absent","HP / Buzzer","MP3Player","Autre"];
var typeLed= ["Absent","LED Interne","Commande Relais","Neopixel Ring","Sortie Digitale"];
var buzMusic=["Mission Impossible","Star Wars","Indiana Jones","Panthere Rose","Famille Adam's","l'exorciste","The simpsons","Tetris","Arkanoid","Super Mario","Xfiles","AxelF","PacMan","dambuste","Muppet show","James Bond","Take On Me","Agence tout risque","Top Gun","les Schtroumpfs","l'arnaque","looney Tunes","20 century fox","Le bon, la brute ...","Retour vers le futur"];

// var pisteMP3=["Piste 1", "piste 2", "piste 3"];
var pisteMP3=[];

var ZXL=["Zone XL","Zone XL haut","Zone Message","Zone Notif 2","Zone notif 3","Zone notif 4","Zone Notif 5","Zone notif 6"];
var Z=["Zone Horloge","Zone Message","Zone Notif 2","Zone notif 3","Zone notif 4","Zone Notif 5","Zone Notif 6","Zone Notif 7"];
var fx=[ 'PRINT','SCROLL_LEFT','SCROLL_UP_LEFT','SCROLL_DOWN_LEFT','SCROLL_UP','GROW_UP','SCAN_HORIZ','BLINDS','WIPE','SCAN_VERTX','SLICE','FADE','OPENING_CURSOR','NO_EFFECT','SPRITE','CLOSING','SCAN_VERT','WIPE_CURSOR','SCAN_HORIZX','DISSOLVE','MESH','OPENING','CLOSING_CURSOR','GROW_DOWN','SCROLL_DOWN','SCROLL_DOWN_RIGHT','SCROLL_UP_RIGHT','SCROLL_RIGHT','RANDOM'];
var animation=['PACMAN','fleche 1',"Roll 1","Marcheur","space invader","chevron","Coeur","Bateau vapeur","Voilier","boule de feu","rocket","ligne","vague","fantome pacman","fleche 2","roll 2"];
var fxLed3=['on','flash','breath','rainbow','colorWipe','colorWipeFill','chaseColor'];
var fxLed2=['on'];
var fxLed1=['on','flash','breath'];
var typMat=['Parola','Genric','ICStation','FC16'];
var cr=false;
var crstp=false;
var tA,tL;
var ajaxload=false;
var ver;
var pause;
var color;
var nbAlarme=0;

function IsJsonString(str) {
try {
    JSON.parse(str);
} catch (e) {
    return false;
}
return true;
}
function notifheure(n,i,v,u,s) {
this.nom=n;
this.ip=i;
this.version=v;
this.up=u;
this.signal=s;
}

function unixToDate(unixStamp) {
var dt=eval(unixStamp*1000);
var myDate = new Date(dt);
return(myDate.toLocaleString( 'fr-FR',{ timeZone: 'UTC' }));
}

function up(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600*24));
var h = Math.floor(seconds % (3600*24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);

var dDisplay = d > 0 ? d + " J, " : "";
var hDisplay = h > 0 ? h + " H, " : "";
var mDisplay = m > 0 ? m + " m, " : "";
var sDisplay = s > 0 ? s + " s" : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
}
function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
// Example functionality to demonstrate a value feedback
function valueOutput(element) {
var value = element.value;
var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
output['innerText'] = value;
}

var DEBUG=false;

function checktime() {
  $.get('/Config?checktime');
  update_Info();
}

function checknet() {
  $.get('/Config?checknet',function(data){
  console.log(data);
  update_Info();
  });
}

function sendConfigHA() {
  $.get('/Config?mqttconfig',function(data){
  console.log(data);
  //update_Info();
  });
}

function goConfig() {
  window.location.href='/editconfig.html';
}

function getInfo() {
$.ajax({
     url: "/getInfo",
     type: "GET",
     dataType:"html",
     success: function(data) {
       console.log(data);
       if (IsJsonString(data)){
         var jinfo = JSON.parse(data);
         $("#display").text(jinfo.MAXDISPLAY);
         ver=jinfo.VERSION;
          $('#version').text(ver);
          $('#lieu').text(jinfo.NOM);
         WZT=jinfo.ZONETIME;
         $('#WZT').text(WZT);
         MZM=jinfo.MAXZONEMSG;
         TZ=jinfo.TOTALZONE;
         XL=jinfo.XL;
         ZP=jinfo.ZP;
         tA=jinfo.TYPEAUDIO;
         tL=parseInt(jinfo.TYPELED);
         pause=parseInt(jinfo.PAUSE);
         $('#MZM').text(MZM);
         $('#TZ').text(TZ);
         if (MZM>0) {
            $("#groupZone").removeClass("d-none");
            if (XL)  Zones=ZXL;
            else Zones=Z;
            numero="<ul class='list-group list-group-flush'>";
            //remplissage select
            for (i=0;i<=(XL?MZM+1:MZM);i++) {
              if ((!XL) || (XL && i!=1)) {
              $('#selectZone').append($('<option>', {
                      value: ZP[i],
                      text : Zones[i]
                  }));
            }
            numero=numero+"<li class='list-group-item d-flex justify-content-between align-items-center'>"+Zones[i]+"  <span class='badge badge-info badge-pill'>"+ZP[i]+"</span></li>";
            }
            numero=numero+"</ul>";
            $("#selectZone option:contains(Zone Message)").attr("selected", "selected");
            $("#num").html(numero);
         } else $("#num").text("Zone Horloge et Msg unique");
         $("#INT").val(jinfo.INTENSITY);
         $("#MINUT").val(jinfo.CRTIME);
         $("#groupLum output").val(jinfo.INTENSITY);
         $('#LUM').prop('checked',jinfo.LUM);
         $('#typMat').text(typMat[jinfo.TYPEMATRICE]);

         //$("#groupLed output").val(jinfo.LEDINT);
         $('#LUM').prop('checked',jinfo.LUM);       
         if (jinfo.PHOTOCELL) {
          $('#LUM').prop("disabled", false);
         }
         else $('#LUM').prop("disabled", true);
         $('#infoLUM').text(jinfo.INTENSITY);
         $('#SEC').prop('checked',jinfo.SEC);
         $('#HOR').prop('checked',jinfo.HOR);
         $('#tzname').text(jinfo.TZNAME);
         $('#hostname').text(jinfo.HOSTNAME);
         $('#mdns').text(jinfo.MDNS);
         $('#uptime').text(up(jinfo.UPTIME));
         $('#first').text(unixToDate(jinfo.STARTTIME));
         $('#last').text(unixToDate(jinfo.LASTSYNCHRO));
         $('#ddj').text(unixToDate(jinfo.DATE));
         $('#NTP').text(jinfo.NTPSERVER);
         if (jinfo.NTPOK) {
           $('#blocInfoNTP').addClass("bg-dark");
           $('#blocInfoNTP').removeClass("bg-danger");
           $('#NTP').addClass("text-dark");
           $('#NTP').removeClass("text-danger");
         }
         else {
            $('#blocInfoNTP').addClass("bg-danger");
            $('#blocInfoNTP').removeClass("bg-dark");
            $('#NTP').removeClass("text-dark");
            $('#NTP').addClass("text-danger");
          }
          if (jinfo.NETOK) {
            $("#net").text("En ligne");
            $('#net').addClass("text-success");
            $('#net').removeClass("text-danger");
            $('#blocInfoNet').addClass("bg-success");
            $('#blocInfoNet').removeClass("bg-danger");
          }
          else {
            $('#net').addClass("text-danger");
            $('#net').removeClass("text-success");
            $("#net").text("Hors Ligne");
            $('#blocInfoNet').addClass("bg-danger");
            $('#blocInfoNet').removeClass("bg-success");
          }
         $('#MAC').text(jinfo.MAC);
          $('#IP').text(jinfo.IP);
          $('#SSID').text(jinfo.SSID);
          $('#RSSI').text(jinfo.RSSI);
          $('#BSSID').text(jinfo.BSSID);
          $('#channel').text(jinfo.CHANNEL);
          $('#masque').text(jinfo.MASQUE);
          $('#passerelle').text(jinfo.PASSERELLE);
          $('#DNS').text(jinfo.DNS);
          $('#DNS2').text(jinfo.DNS2);
          if (jinfo.DHT) {
            $("#navdht").removeClass("disabled");
            $('#dht_box').removeClass('d-none');
            $('#Temp').text(jinfo.TEMP);
            $('#Hum').text(jinfo.HUM);
            $('#Modele').text(jinfo.DHTMODEL);
            $('#Status').text(jinfo.DHTSTATUS);
            $('#dhtdate').text(unixToDate(jinfo.STAMPDHT));
            $('#dht_t').text(jinfo.TEMP);
            $('#dht_h').text(jinfo.HUM);
            $('#dht_hi').text(parseInt(jinfo.HI).toFixed(2));
            $('#dht_p').text(parseInt(jinfo.ROSE.toFixed(2)));
            $('#DDHT').prop('checked',jinfo.DDHT);
          }
          else $('#dht_box').addClass('d-none');

          $('#isLED').text(typeLed[tL]);
          $('#isAUDIO').text(typeAudio[tA]);
          // si LED
          if (tL > 0)  {
            $('#LED').prop('disabled', false);
            $('#LED').prop('checked',jinfo.LED);
            $('#groupLED').removeClass('d-none');
            $('#BRI').val(jinfo.LEDINT);
            $('#infoTypeLed').text(" ("+typeLed[tL]+")");
            // pour fonctions
            if (jinfo.CRFX>0) $('#INVCR').text(fxLed3[jinfo.CRFX-1]);
            if (jinfo.ALFX>0) $('#INVAL').text(fxLed3[jinfo.ALFX-1]);
            if (tL>1) {
                if (tL !=2 ) $('#intLEDFX').val(jinfo.FXINT);
            }
            if (tL==3) {
              color=jinfo.COLOR;
              $('#COLOR').val(jinfo.COLOR);
              $('#loopLED').val(2);
                    }

          }
            else {
              $('#groupLED').addClass('d-none');
            }
          if (tA > 0)  {
            $('#groupAUDIO').removeClass('d-none');
            $('#infoTypeAudio').text(" ("+typeAudio[tA]+")");
            $('#volAUDIO').val(jinfo.VOLUME);
              if (jinfo.CRFXSOUND>0) $('#INACR').text(buzMusic[jinfo.CRFXSOUND-1]);
              if (jinfo.ALFXSOUND>0) $('#INAAL').text(buzMusic[jinfo.ALFXSOUND-1]);
            if (tA==2) {
              $('#cardMP3').removeClass('d-none');
              $('#MP3list').text(jinfo.TOTALMP3-jinfo.MP3_1);
              $('#MP3sound').text(jinfo.MP3_1);
              $('#MP3notif').text(jinfo.MP3NOTIF);
            }

        } else $('#groupAUDIO').addClass('d-none');
          if (XL) $('#XL').text('Activé');
          else $('#XL').text('Désactivé');
          if(jinfo.DEBUG) {
            $('#debug').text("Actif");
            DEBUG=true;
          }
                 else {
                   DEBUG=false;
                   $('#debug').text("inactif");
                 }
          if(jinfo.HA) {
            $('#HAP').removeClass("d-none");
            $('#HAtuto').removeClass("d-none");
          }
          else {
            $('#HAP').addClass("d-none");
            $('#HAtuto').addClass("d-none");
          }
          if(jinfo.PHOTOCELL) $('#photocell').text("Présent");
                  else $('#photocell').text("Absent");
          if(jinfo.DHT) { $('#dht').text("Présent");

        }
          else $('#dht').text("Absent");
          if(jinfo.BTN1) { $('#bouton1').text("Présent");
                        $("#cardbtn1").removeClass('d-none');
                        $('#btn1clic1').text(boutons[jinfo.btnclic[0]]);
                        $('#btn1clic2').text(boutons[jinfo.btnclic[1]]);
                        $('#btn1clic3').text(boutons[jinfo.btnclic[2]]);
                      }
                  else $('#bouton1').text("Absent");
          if(jinfo.BTN2) { $('#bouton2').text("Présent");
                  $("#cardbtn2").removeClass('d-none');
                  $('#btn2clic1').text(boutons[jinfo.btnclic[3]]);
                  $('#btn2clic2').text(boutons[jinfo.btnclic[4]]);
                  $('#btn2clic3').text(boutons[jinfo.btnclic[5]]);
        }
                  else $('#bouton2').text("Absent");
          if(jinfo.LED) $('#StatutLED').text("Présent");
                  else $('#StatutLED').text("Absent");
          if(jinfo.BOX) {
              $('#boxinfo').text("Activé");
              $("#cardbox").removeClass("d-none");
              $('#IUACR').text(Actions[jinfo.ACTION[0]]);
              $('#IUAAL').text(Actions[jinfo.ACTION[1]]);
              $('#infoaction1').text(jinfo.URL_ACT1);
              $('#infoaction2').text(jinfo.URL_ACT2);
              $('#infoaction3').text(jinfo.URL_ACT3);
              $('#infoupdate').text(jinfo.URL_UPD);
            }
              else {
                $('#boxinfo').text("Désactivée");
                $("#cardbox").addClass("d-none");
              }
            // $("#Alarme input").val(pad(jinfo.TIMEREV[0],2)+":"+pad(jinfo.TIMEREV[1],2));

          if (jinfo.REV) {
            $("#blocAl").addClass("text-danger");
            $("#blocAl").removeClass("text-secondary");
            $("#blocAl h3").text("Alarme Active");
            $("#blocAl h1").text($("#Alarme input").val());
          }
          else {
            $("#blocAl").addClass("text-secondary");
            $("#blocAl").removeClass("text-danger");
            $("#blocAl h3").text("Alarme Inactive");
          }
          cr=jinfo.CR;
          crstp=jinfo.CRSTOP;

          if (jinfo.BROKER) {
            $("#cardmqtt").removeClass("d-none");
            $('#mqttState').text("activé");
            if (jinfo.STATEBROKER) {
              $("#infostatemqtt").text("Connexion OK");
              $("#infostatemqtt").removeClass("text-danger");
            }
            else {
              $("#infostatemqtt").addClass("text-danger");
              $("#infostatemqtt").text("Erreur Connexion");
            }
            $("#infoipmqtt").text(jinfo.SRVBROKER);
            if (jinfo.UBROKER !="") $("#infousermqtt").text(jinfo.UBROKER);
            else $("#infousermqtt").text("Serveur MQTT anonyme");
            $("#infotempomqtt").text(jinfo.TEMPOBROKER);
            $("#infotopicS").text(jinfo.TOPIC);
            $("#infotopicO").text(jinfo.TOPICOPT);
            $("#infotopicP").text(jinfo.TOPICSTATE);
            $("#predisco").text(jinfo.PREFIXHA);
          }
          else {
              $("#cardmqtt").addClass("d-none");
          }
          //Jours
         // for (i=1;i<8;i++) {
          //  $("#alday"+i).prop('checked',jinfo.ALDAY[i]);
         // }
        }
   },
     error: function(resultat,statut) {
        // init();
     },
     complete: function(resultat, statut){
      ajaxload=true;
      if (cr) {
        $('#CR').text('Afficher');
      }
      else $('#CR').text('Masquer');
      checkLum();
      checkLed();
      setInterval('update_Info();',20000); /* rappel après 20 secondes  */
      checkGithub();
      if (tL==1) fxLed3=fxLed1;
      else if (tL==2) fxLed3=fxLed2;
      if (tL>0) {
        $.each(fxLed3, function (value, text) {
          $('#selectfxled').append($('<option>', {
                value: value+1,
                text : (value+1)+" - "+text
            }));
          });
        }
       if (tL==3) {
        $('#scoled').removeClass("d-none");
        $('#cycle').removeClass("d-none");
        $.each(couleurs, function (value, text) {
          $('#selectcolorled').append($('<option>', {
                value: value,
                text : value+" - "+text
            }));
          });
      }
 } // fin complete

 }); //fin ajax
}

function getAlarmes() {
 /*  tA = 2;
   var data="{\"NbAlarmes\":2,\"alarmes\":[\
     {\"id\":0,\"nom\":\"Mon Alarme n°1\",\"actif\":true,\"heure\":7,\"minute\":2,\"volumeAudio\":30,\"pisteMP3\":42,\"repeat\":true,\"timeSleep\":9,\
     \"ALDAY\":[false,true,false,true,false,false,false],\"audio\":true},{\"id\":0,\"NOM\":\"Mon Alarme n°1\",\"ACTIF\":true,\"HEURE\":10,\"MINUTE\":35,\"VOLUMEAUDIO\":30,\"pisteMP3\":2,\"repeat\":\"true\",\"timeSleep\":7,\
     \"ALDAY\":[false,true,false,true,false,false,false],\"audio\":true}]}";
   var json = JSON.parse(data);
*/
  $.getJSON( "/configAlarme?info", function( json ,status) {
    console.log(json);
    nbAlarme = json.NbAlarmes; 
    // console.log(nbAlarme);
    // création du HTML
    var visible=true;
    for(i=1;i<=nbAlarme;i++){
      $('#liReveil').append(getHtmlLiAlarme(i, visible));
      $('#myReveilTab').append(getHtmlAlarme(i, visible));
      visible = false;
    }
    reveilhtmlAudio();

    // remplissage des options
      //remplissage select
    $.each(buzMusic, function (value, text) {
      $('.buzaudio').append($('<option>', {
              value: value+1,
              text : (value+1)+" - "+text
          }));
    });

    //remplissage select MP3
    // categoriemp3
     $.each(pisteMP3, function (value, text) {
      $('.categoriemp3').append($('<option>', {
              value: value+1,
              text : (value+1)+" - "+text.categorie
          }));
    });

    // $('.alday').on('change',checkDay);
    $('.reveilAudio').on('change',reveilAudio);
    $('.categoriemp3').on('change',onChangeCategorieMP3);
    $('.repeatAlarme').on('change',changeRepeat);

    for (i=1;i<=nbAlarme;i++) {
      $('#btn_upAl'+i).on('click',upAl);
      $('#btn_stopAl'+i).on('click',stopAl);
    }
  
    $('input[type="range"]').rangeslider({
    polyfill: false
    });


    // remplissage des alarmes
    $.each(json.alarmes,function( key, val ) {
      id = key + 1;

      if(val.actif) {
        $("#reveil"+id+" #blocAl").addClass("text-danger");
        $("#reveil"+id+" #blocAl").removeClass("text-secondary");
        $("#reveil"+id+" #blocAl h3").text("Alarme Active");
      } else {
        $("#reveil"+id+" #blocAl").addClass("text-secondary");
        $("#reveil"+id+" #blocAl").removeClass("text-danger");
        $("#reveil"+id+" #blocAl h3").text("Alarme Inactive");
      }
      var minloc = val.minute;
      if(minloc<10) {minloc="0"+val.minute;}
      var heurloc=val.heure;
      if(heurloc<10){heurloc="0"+val.heure;}
      $("#reveil"+id+" #Alarme input").val(heurloc+":"+minloc);
      $("#reveil"+id+" #blocAl h1").text(heurloc+":"+minloc);
      $("#reveil"+id+" #titre h3").text(val.nom);
      $("#reveil"+id+" #reveilTitle input").val(val.nom);
      $('#reveilAudio'+id).prop('checked',val.audio);
      $('#infoTypeAudio'+id).text(" ("+typeAudio[tA]+")");
      
      if(val.audio) {
        if (tA==1) {
          $('#groupAUDIO1_'+id).removeClass("d-none");
          $("#selectTheme"+id).val(val.fxAL);
        }
        else if (tA==2) {
          $('#groupAUDIO2_'+id).removeClass("d-none");
        
          $('#volAUDIO'+id).val(val.volumeAudio); 
          valueOutput(document.getElementById('volAUDIO'+id));

          $("#numPisteMP3"+id).val(val.pisteMP3); 
          if(typeof pisteMP3 == 'undefined'){
            console.log("PisteMP3 pas encore initialisées");
         }else{
          setPisteMP3Alarme(id);
         }         
          
        }
      }
      //repeat
      $("#reveil"+id+" #repeatAlarme"+id).prop('checked',val.repeat);   
      if (val.repeat)  {
        $('#SleepTime'+id).val(val.timeSleep);
        $('#SleepTime'+id).removeClass("d-none");
        $('#infoSleepTime'+id).removeClass("d-none");
      }
      else {
       $('#SleepTime'+id).addClass("d-none");
       $('#infoSleepTime'+id).addClass("d-none");
      }
      // jour
      for (i=0;i<7;i++) {
        $("#reveil"+id+" #alday"+(i+1)).prop('checked',val.ALDAY[i]);
      }
    });
 });
}

function changeRepeat(e){
  
  var boutonid = e.target.id || e.target.parentNode.id;
    var id = boutonid.substring("repeatAlarme".length);
     if ($("#reveil"+id+" #repeatAlarme"+id).prop('checked'))  {
       $('#SleepTime'+id).removeClass("d-none");
       $('#infoSleepTime'+id).removeClass("d-none");
     }
     else {
      $('#SleepTime'+id).addClass("d-none");
      $('#infoSleepTime'+id).addClass("d-none");
     }
}

function getHisto() {
    $('#histoList').html("");
  $.getJSON( "/getInfo?HISTO", function( json ,status) {
    console.log(json);
    var n=1
    $("#badgehist").text(json.index);
    $.each(json.notif,function( key, val ) {
      $('#histoList').append( "<tr>"
        +"<td style='width:5%;'>"+n+"</td>"
        +"<td>"+unixToDate(json.date[key])+"</td>"
        +"<td style='width:60%;'>"+val+"</td>"
        +"<td>"+String.fromCharCode(json.flag[key])+"</td>"

      +"</tr>" );
      n++;
  });
});
}

function infoJson() {
  $.getJSON( "/info.json", function(json) {
    console.log(json.version);
    $('#vspiffs').text(json.version);
});
}



function update_Info() {
$.ajax({
     url: "/getInfo",
     type: "GET",
     dataType:"html",
     success: function(data) {
       if (IsJsonString(data)){
         var jinfo = JSON.parse(data);
        cr=jinfo.CR;
        $('#ddj').text(unixToDate(jinfo.DATE));
         $('#uptime').text(up(jinfo.UPTIME));
         $('#dhtdate').text(unixToDate(jinfo.STAMPDHT));
         $('#dht_t').text(jinfo.TEMP);
         $('#dht_h').text(jinfo.HUM);
         $('#dht_hi').text(parseInt(jinfo.HI).toFixed(2));
         $('#dht_p').text(parseInt(jinfo.ROSE.toFixed(2)));
         $('#RSSI').text(jinfo.RSSI);
         $('#last').text(unixToDate(jinfo.LASTSYNCHRO));
         $('#Temp').text(jinfo.TEMP);
         $('#Hum').text(jinfo.HUM);
         $('#infoLUM').text(jinfo.INTENSITY);
         if (jinfo.BROKER) {
         if (jinfo.STATEBROKER) {
           $('#blocInfoMQTT').removeClass("bg-danger");
           $('#blocInfoMQTT').removeClass("bg-dark");
           $('#blocInfoMQTT').addClass("bg-success");
           $("#infostatemqtt").text("Connexion OK");
           $("#infostatemqtt").removeClass("text-danger");
         }
         else {
           $("#infostatemqtt").addClass("text-danger");
           $("#infostatemqtt").text("Erreur Connexion");
           $('#blocInfoMQTT').removeClass("bg-dark");
           $('#blocInfoMQTT').removeClass("bg-success");
           $('#blocInfoMQTT').addClass("bg-danger");
         }
       }
       else {
         $('#blocInfoMQTT').removeClass("bg-danger");
         $('#blocInfoMQTT').removeClass("bg-success");
         $('#blocInfoMQTT').addClass("bg-dark");
         $('#mqttState').text("désactivé");
       }
         if (jinfo.NTPOK) {
           $('#blocInfoNTP').addClass("bg-dark");
           $('#blocInfoNTP').removeClass("bg-danger");
           $('#NTP').addClass("text-dark");
           $('#NTP').removeClass("text-danger");
         }
         else {
            $('#blocInfoNTP').addClass("bg-danger");
            $('#blocInfoNTP').removeClass("bg-dark");
            $('#NTP').removeClass("text-dark");
            $('#NTP').addClass("text-danger");
          }
          if (jinfo.NETOK) {
            $("#net").text("En ligne");
            $('#net').addClass("text-success");
            $('#net').removeClass("text-danger");
            $('#blocInfoNet').addClass("bg-success");
            $('#blocInfoNet').removeClass("bg-danger");
          }
          else {
            $('#net').addClass("text-danger");
            $('#net').removeClass("text-success");
            $("#net").text("Hors Ligne");
            $('#blocInfoNet').addClass("bg-danger");
            $('#blocInfoNet').removeClass("bg-success");
          }
         var httpcode=parseInt(jinfo.INFO);
         if (httpcode==200) {
         $('#infoEtatURL').text("derniére requéte URL : OK");
       }
         else {
            $('#infoEtatURL').text("derniére requéte URL : Erreur ( code  "+jinfo.INFO+" )");
         }
       }
      }
  });
}

function mdns_Info(IP,n) {
  console.log("recherche info pour ip : "+IP);
  $.getJSON( "http://"+IP+"/getInfo", function( data ) {
    console.log(data);
    if(data.hasOwnProperty('Options')){
      nom=data.system.lieu;
      version=data.system.version;
      uptime=data.system.uptime;
      signal=data.system.RSSI+" dBm";
          }
      else {
        nom=data.NOM;
        version=data.VERSION;
        uptime=up(data.UPTIME);
        signal=data.RSSI;
      }
        $('#mdnslist').append( "<tr>"
          +"<td >"+n+"</td>"
          +"<td>"+nom+"</td>"
          +"<td>"+IP+"</td>"
          +"<td>"+version+"</td>"
          +"<td>"+uptime+"</td>"
          +"<td>"+signal+"</td>"
        +"</tr>" );
  });

}

function getMdns() {
  $('#inforafraichir').text(" ... Scan du reseau en cours ...");
  $('#mdnslist').html("");
  $.ajax({
       url: "/getInfo?MDNS",
       type: "GET",
       dataType:"html",
       success: function(data) {
         console.log("rep " + data);
         var reponse = data.split(":");
                   if (reponse[1]=="0") $('#inforafraichir').text(" ... Aucun notifheure trouvé.");
                   else {
                       listnotif=reponse[1].split(",");
                       var n=listnotif.length;
                       n=n-1;
                       console.log("il y a "+n+" notifheure");
                       for (i=0;i<n;i++) {
                          $('#inforafraichir').text(" ... Récupération ip notifheure "+listnotif[i]+"...");
                          if (listnotif[i].length != 0 ) { mdns_Info(listnotif[i],i+1);}
                       }
                        $('#inforafraichir').text("fin recherche");

                      }

      }
});
}

$("#FormMsg").submit(function(){
Message=$('#inputMsg').val();
// valeur par défaut
audioValue=0;
ledValue=0;
numeroPiste=0;
animation=0;
P=pause;
fxled=0;
loop=1;
colorled=color;
//Si notif led
if ($('#notifLed').prop('checked')) {
  if (tL>0) fxled=$("#selectfxled option:selected").val();
  if (tL==1 || tL==3) {
    ledValue=$('#intLEDFX').val();
    loop=$("#loopLED").val();
  }
  if ( tL==3) {
    colorled=$("#selectcolorled option:selected").val();
  }
  if (tL==2) ledValue=100;
}

if ($('#notifAudio').prop('checked')) {
  if (tA==1) {
    numeroPiste=$("#selectTheme option:selected").val();
  }
  else if (tA==2) {
    audioValue=$("#volAUDIO").val();
  }
}

typ=$("#type option:selected").val();
if (typ==6) fio=$('#FX').val();
else if (typ==7) {
  fio=14;
  animation=$('#Anim').val();
}
else fio=1;
if (typ==1) P=parseInt($('#pauseInfo').val());

// Message = escape($('#msg').val()).replace(/\+/g, "%2B");
//Msg = Msg.replace("%u20AC", "%80");  // pour Euro


$.post('/Notification',
     {
msg:Message,
ledlum:ledValue,
audio:audioValue,
num:numeroPiste,
nzo:$("#selectZone option:selected").val(),
fio:fio,
anim:animation,
cycle:$("#cycle").val(),
type:typ,
pause:P,
ledfx:fxled,
color:colorled,
loop:loop
   }, function(data) {
     //$("#infoSubmit").text(data);
     console.log(data);
 }).done(function() {
     getHisto();
  });

return false;
});

function checkLum()
{
if ($('#LUM').prop('checked'))  {
 $('#groupLum').addClass("d-none");
 $('label[for="checkInt"]').text('Luminosité Auto');
// Options();
    }

else {
$('#groupLum').removeClass("d-none");
$('label[for="checkInt"]').text('Luminosité Manuelle');
$('#INT').rangeslider('update', true);
//$('#groupLum output').val();
}
}

function checkLed()
{
  $('#BRI').rangeslider('update', true);
  if ($('#LED').prop('checked'))  {
      if (tL!=2) $('#groupLed').removeClass("d-none");
      if (tL==3)  $('#groupled3').removeClass("d-none");
      // Options();
  }
  else {
   $('#groupLed').addClass("d-none");
   if (tL==3)  $('#groupled3').addClass("d-none");
}

}


function Options(cle = "" , valeur = "") {

key = ((typeof cle != 'object') ? cle : key=$(this).attr('id'));
console.log ( "valeur de key :"+$(this).attr('id')+" et type cle "+typeof cle);
if (key=="LUM") checkLum();
if (key=="LED") checkLed();
if (key=="INT" || key=="COLOR")   val=$(this).val();
else if (key=="BRI")   { val=$(this).val()+"&COLOR="+$("#COLOR").val();key="LEDINT";}
else if (key=="TIMEREV")  { val=$("#blocAl h1").text();}
else if (key=="REV")   val=false;
else if (key=="ALD") val=valeur;
else val=$(this).prop('checked');

console.log ("Envoie des valeur "+key+" et "+val);
url="/Options?"+key+"="+val;
$.get(url, function( data ) {
var res = data.split(":");
console.log("retour serveur : "+data);
if (res[0]=="INT") {
  $('#INT').val(res[1]);
  $('#INT').rangeslider('update', true);
  }

});
}


function Alarmes(id, cle = "" , valeur = "") {

  key = ((typeof cle != 'object') ? cle : key=$(this).attr('id'));
  additional = "";
 
  if (key=="ACTIF") 
  {
    val=valeur;
    if(val=="true")
    {
      time=$("#reveil"+id+" #blocAl h1").text().split(":");
      additional = "&heure="+time[0]+"&minute="+time[1];
      var nom = $("#reveil"+id+" #titre h3").text();
      if(nom!="") additional+= "&nom="+nom;
      
      if ($('#reveilAudio'+id).prop('checked')) {
        additional += "&audio=true";
        if (tA==1) {
          additional+="&FXSOUNDAL="+$("#selectTheme"+id+" option:selected").val();
        }
        else if (tA==2) {
          additional+="&VOLUMEAUDIO="+$("#volAUDIO"+id).val();
          additional+="&PISTEMP3="+$("#pistemp3"+id+" option:selected").val();
        }
      }
      else {
        additional += "&audio=false";
      }

      var ald="";
      for (i=1;i<8;i++) {
        ald+=$("#reveil"+id+" #alday"+i).prop('checked')+","; 
      }
      additional += "&ald="+ald;

      var isRepeat = $("#reveil"+id+" #repeatAlarme"+id).prop('checked');
      if(isRepeat)
      {
        additional += "&repeat=true";
        additional += "&stime=" + $("#reveil"+id+" #SleepTime"+id).val();
      }
      else
      {
        additional += "&repeat=false";
      }
      
    }
  }
  else val=$(this).prop('checked');
  
  console.log ("Envoie des valeur "+key+"="+val + " pour l'alarme d'id "+id+ " " + additional);
  url="/configAlarme?ID="+(id-1)+"&"+key+"="+val+additional; 
  $.get(url, function( data ) {
    console.log("retour serveur : "+data);
  });
  }

  function testson(actif,id){
    if(actif)
    {
      url="/testaudio?PLAY=true&VOL="+$("#volAUDIO"+id).val();
      url+="&PISTE="+$("#pistemp3"+id+" option:selected").val();
      
      $('#startTestSon'+id).addClass("d-none");
      $('#stopTestSon'+id).removeClass("d-none");
    }
    else
    {
      url="testaudio?PLAY=false";
      $('#startTestSon'+id).removeClass("d-none");
      $('#stopTestSon'+id).addClass("d-none");
    }

    $.get(url, function( data ) {
      console.log("retour serveur : "+data);
    });
  }

  function checkDay(e) {
    var reveilid = e.target.value || e.target.parentNode.value;
    ald="";
    for (i=1;i<8;i++) {
      ald+=$("#reveil"+reveilid+" #alday"+i).prop('checked')+(i==7?"":",");
    }
  }

  /***
   * Apeler si activ ation notification audio pour le réveil
   * @param {*} e event correspondant au bouton pressé
   */
  function reveilAudio(e){
    var boutonid = e.target.id || e.target.parentNode.id;
    var id = boutonid.substring("reveilAudio".length);
     if ($(this).prop('checked'))  {
      if (tA==1 ) {
          $('#groupAUDIO1_'+id).removeClass("d-none");
        }
        else if (tA==2) {
            $('#groupAUDIO2_'+id).removeClass("d-none");
            valueOutput(document.getElementById('volAUDIO'+id));
            $('#volAUDIO'+id).rangeslider('update', true);
          }
     }
     else {
       $('#groupAUDIO'+tA+"_"+id).addClass("d-none");
     }
  }
  /**
   * si activation de l'alarme
   * @param {*} e event correspondant au bouton pressé
   */
  function upAl(e) {;
    var boutonid = e.target.id || e.target.parentNode.id;
    var id = boutonid.substring("btn_upAl".length);

    $("#reveil"+id+" #blocAl").addClass("text-danger");
    $("#reveil"+id+" #blocAl").removeClass("text-secondary");
    $("#reveil"+id+" #blocAl h3").text("Alarme Active");
    $("#reveil"+id+" #blocAl h1").text($("#reveil"+id+" #Alarme input").val());
    nom = $("#reveil"+id+" #reveilTitle input").val();
    if(nom!="") $("#reveil"+id+" #titre h3").text(nom);

    Alarmes(id, "ACTIF", "true");
  }
  /**
   * si desactivation de l'alarme
   * @param {*} e event correspondant au bouton pressé
   */
  function stopAl(e) {
    var boutonid = e.target.id || e.target.parentNode.id;
    var id = boutonid.substring("btn_stopAl".length);

    $("#reveil"+id+" #blocAl").addClass("text-secondary");
    $("#reveil"+id+" #blocAl").removeClass("text-danger");
    $("#reveil"+id+" #blocAl h3").text("Alarme Inactive");

    Alarmes(id, "ACTIF", "false");
  }

function reveilhtmlAudio(){
  for(var i=1;i<=nbAlarme;i++)
  {
      if (tA > 0)  {
        $('#groupAUDIO_'+i).removeClass('d-none');
        // $('#groupAUDIO'+tA+'_'+i).removeClass('d-none');
        $('#infoTypeAudio').text(" ("+typeAudio[tA]+")");

    } else {
      $('#groupAUDIO_'+i).addClass('d-none');
      // $('#groupAUDIO'+tA+'_'+i).addClass('d-none');
    }
}
}

function getHtmlLiAlarme(id, visible)
{
  var html = "<li class=\"nav-item\"><a class=\"nav-link show"+ (visible?" active bg":"")+"\" data-toggle=\"tab\" href=\"#reveil"+id+"\">Réveil "+id+"</a></li>";
  return html;
}

/**
 * A voir pour faire de façon générique le code HTML des alamres...
 * @param {id de l'alarme} id 
 */
function getHtmlAlarme(id,visible){
  // console.log("start HtmlAlarme " + id);

  var html =" <div class=\"tab-pane fade"+ (visible?" active show":"")+"\" id=\"reveil"+id+"\">"; 
  html+="<div class=\"card border-primary\">";
  html+="    <div class=\"card-header bg-primary \" id=\"titre\">";
  html+="      <h3 class=\"text-center text-white\">Réveil "+id+"</h3>";
  html+="    </div>";
  html+="    <div class=\"card-body\">";
  html+="      <div class=\"text-center mb-4 text-secondary \" id=\"blocAl\">";
  html+="        <h1 class=\"display-3 \">--:--</h1>";
  html+="        <h3>Alarme Inactive</h3>";
  html+="      </div>";


  html+="     <form>";
  html+="     <div class=\"form-row\">";
  html+="       <div class=\"col-12\">";
  html+="		    	<div class=\"col-6 col-sm-6 col-md-5 col-lg-4\"></div>";
  html+="		    </div>";

  html+="	  	<div class=\"col-6\">";
  // saisie du titre
  html+="			 <div class=\"form-group \"  id='reveilTitle'><br />";
  html+="            <INPUT type='text' maxlength='50' placeholder=\"Nom de l'alarme\"";
  html+="                      class=\"form-control text-primary\" aria-describedby=\"msghelp\" />";
  html+="            <small id=\"msghelp\" class=\"form-text text-muted\">Titre limitée à 50 caractères.</small>";
  html+="      </div>";
// saisie de l'heure
  html+="        <div class=\"input-group my-3 mx-auto\" id=\"Alarme\">";
  html+="          <input type=\"time\" class=\"form-control text-primary\" value=\"07:00\" style=\"width:30px;\" />";
  html+="        </div>";
  html+="       <div class=\"row\">";
  html+="        <div class=\"col-6 align-self-center text-center mx-auto\">";
  html+="          <input class=\"form-check  form-check-inline repeatAlarme\" type=\"checkbox\" id=\"repeatAlarme"+id+"\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"repeatAlarme"+id+"\">Répétition</label>";
  html+="        </div>";
  html+="        <div class=\"col-6\">";
  html+="          <input type=\"number\" class=\"form-control text-primary d-none\" id=\"SleepTime"+id+"\" value=\"5\" min=\"01\" max=\"30\"/>";
  html+="            <label for=\"SleepTime"+id+"\" class=\"text-primry\"><small class=\"text-info d-none\" id=\"infoSleepTime"+id+"\">Délai de pause en minutes.</small></label>";
  html+="        </div>";
  html+="        </div>";
  html+="        </div>"; // fin div col-6
 

  // partie audio
 html+="	  	<div class=\"col-6\">";
 html+="			  <div class=\"form-group d-none mt-2\" id=\"groupAUDIO_"+id+"\">";
 html+="				<div class=\"custom-control custom-checkbox\">";
 html+="				  <input type=\"checkbox\" class=\"custom-control-input reveilAudio\" id=\"reveilAudio"+id+"\">";
 html+="				  <label class=\"custom-control-label text-primry\" for=\"reveilAudio"+id+"\">Notification AUDIO<small class=\"text-info\" id=\"infoTypeAudio"+id+"\"></small></label>";
 html+="				</div>";
 html+="			  </div>";
 html+="			  <div class=\"form-group d-none\" id=\"groupAUDIO1_"+id+"\">"; // pour le buzer
 html+="				<select class=\"form-control buzaudio\" name='theme' id='selectTheme"+id+"'>";
 html+="				</select>";
 html+="			  </div>";
 html+="			  <div class=\"mx-auto d-none\" id=\"groupAUDIO2_"+id+"\">"; // pour MP3
 html+="			     <input type=\"hidden\" name='numPisteMP3"+id+"' id='numPisteMP3"+id+"' value=\"-1\"/>";
 html+="			     <select class=\"form-control categoriemp3\" name='categoriemp3' id='categoriemp3"+id+"'></select>";
 html+="				   <select class=\"form-control pistemp3\" name='pistemp3' id='pistemp3"+id+"'></select><br />";
 html+="				  <input type=\"range\" id=\"volAUDIO"+id+"\" name=\"volume1\" min=\"0\" max=\"100\" value=\"40\" ";
 html+="				        oninput=\"valVolume"+id+".value = volume1.valueAsNumber\">";
 html+="				<output class=\"text-primary\" for=\"volAUDIO"+id+"\" name=\"valVolume"+id+"\"></output>";
 html+="				<div class=\"form-group text-right\">";
 html+="				<button type=\"button\" class=\"btn btn-outline-primary m-2\" id=\"startTestSon"+id+"\" onclick=\"testson(true,"+id+");\">Test</button>";
 html+="			  <button type=\"button\" class=\"btn btn-outline-danger m-2 d-none\" id=\"stopTestSon"+id+"\" onclick=\"testson(false,"+id+");\">Stop</button></div>";
 html+="			  </div>";
 html+="        </div>"; // fin div col-6

  html+="        </div>"; // fin div form-row
  html+="        </form>"; 

  // jour de réveil
  html+="      <div class=\"text-primary  text-center mx-auto\">";
  html+="        <div class=\"form-check  form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday2\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday2\">Lun</label>";
  html+="        </div>";
  html+="        <div class=\"form-check form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday3\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday3\">Mar</label>";
  html+="        </div>";
  html+="        <div class=\"form-check form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday4\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday4\">Mer</label>";
  html+="        </div>";
  html+="        <div class=\"form-check form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday5\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday5\">Jeu</label>";
  html+="        </div>";
  html+="        <div class=\"form-check form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday6\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday6\">Ven</label>";
  html+="        </div>";
  html+="        <div class=\"form-check form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday7\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday7\">Sam</label>";
  html+="        </div>";
  html+="        <div class=\"form-check form-check-inline\">";
  html+="          <input class=\"form-check-input alday\" type=\"checkbox\" id=\"alday1\" value="+id+">";
  html+="          <label class=\"form-check-label\" for=\"alday1\">Dim</label>";
  html+="        </div>";
  html+="      </div> <br />";
  
  html+="      <div class=\"form-group text-center\">";
  html+="        <button type=\"button\" class=\"btn btn-outline-dark\" id=\"btn_stopAl"+id+"\"><i class=\"fas fa-power-off h3\"></i></button>";
  html+="        <button type=\"button\" class=\"btn btn-outline-danger\" id=\"btn_upAl"+id+"\"><i class=\"fas fa-bell h3\"></i></button>";
  html+="      </div>";
  html+="    </div>";
  html+="  </div>";
  html+="</div>";

  return html;
}

function Minuteur(key) {
if (key=="MIN") {
  $('#MINUT').rangeslider('update', true);
   val=$('#MINUT').val();
   val=val*60;
   cr=true;
 }
 else if (key=="STP") {
   val=0;
   key="MIN";
 }
 else if (key=="CR") {
   cr=!cr;
   val=cr;
 }
 else if (key=="CRSTP") {
   crstp=!crstp;
   val=crstp;
 }
console.log("info minuteur :"+key+" = "+val);
url="/Options?"+key+"="+val;
$.get(url);
if (cr) {
  $('#CR').text('Masquer');
}
else $('#CR').text('Afficher');
}

function majMinut() {
// console.log("maj minut");
valueOutput(document.getElementById('MINUT'));
$('#MINUT').rangeslider('update', true);
}

$('#notifLed').change(function() {
  console.log("test notif : "+tL);
 if ($(this).prop('checked'))  {
  if (tL==1 || tL==3)  {
        $('#groupLED1').removeClass("d-none");
        valueOutput(document.getElementById('intLEDFX'));
        $('#intLEDFX').rangeslider('update', true);
        valueOutput(document.getElementById('loopLED'));
        $('#loopLED').rangeslider('update', true);
      }
  if (tL==2) {
      $('#groupLED1').removeClass("d-none");
      $('#groupledintfx').addClass("d-none");
    }
 }
 else {
   $('#groupLED1').addClass("d-none");
 }

});

$('#notifAudio').change(function() {
 if ($(this).prop('checked'))  {
  if (tA==1 ) {
      $('#groupAUDIO1').removeClass("d-none");
    }
    else if (tA==2) {
        $('#groupAUDIO2').removeClass("d-none");
        valueOutput(document.getElementById('volAUDIO'));
        $('#volAUDIO').rangeslider('update', true);
      }
 }
 else {
   $('#groupAUDIO'+tA).addClass("d-none");
 }
});


$('#type').change(function() {
  if ($(this).val()==6) $('#blocFx').removeClass("d-none");
  else {
    $('#blocFx').addClass("d-none");
  }
  if ($(this).val()==7) $('#blocAn').removeClass("d-none");
  else $('#blocAn').addClass("d-none");
  if ($(this).val()==1) $('#pausefield').removeClass("d-none");
  else  {
    $('#pausefield').addClass("d-none");
    $('#pauseInfo').val('3').change();
  }
});

$('#selectfxled').change(function() {
  if (tL==3) {
  if ($(this).val()==4) $('#scoled').addClass('d-none');
    else $('#scoled').removeClass('d-none');
    if ($(this).val()==6) $('#cycle').addClass('d-none');
    else $('#cycle').removeClass('d-none');
  }
  if (tL==3 || tL==1) {
    if ($(this).val()==1) $('#cycle').addClass('d-none');
    else $('#cycle').removeClass('d-none');
  }
});

function checkGithub() {
  $.getJSON( "https://api.github.com/repos/byfeel/NotifheureXL/releases/latest", function( data ) {
    if (data.hasOwnProperty('tag_name')) {
      console.log(data);
      var lastver=data.tag_name;
      var urlV=data.html_url;
      console.log("version : "+ver+" et new : "+lastver);
      if (ver!=lastver) {
        $("#newversion").text("nouvelle version ");
        $("#newversion").removeClass("bg-dark");
        $("#newversion").addClass("bg-warning");
        $("#lastversion").addClass("text-warning");
      }
       $("#lastversion").text(data.tag_name);
       $("#urlversion").attr('href',urlV);
  }
  });
}

function loadPisteMp3(){
  $.getJSON("mp3.json", function(data){
    console.log(data);
    pisteMP3 = data.PisteMP3;
    $.each(pisteMP3, function (value, text) {
      $('.categoriemp3').append($('<option>', {
              value: value+1,
              text : (value+1)+" - "+text.categorie
          }));
    });
    var pistes = pisteMP3[0];
    $.each(pistes.pistes, function (value, text) {
      $('.pistemp3').append($('<option>', {
              value: text.id,
              text : (value+1)+" - "+text.titre
          }));
    });

    for(i=1;i<=nbAlarme;i++){
      setPisteMP3Alarme(i);
    }
  });
}

function onChangeCategorieMP3(e){
  var boutonid = e.target.id || e.target.parentNode.id;
  var id = boutonid.substring("categoriemp3".length);
  changeCategorie(id);
}

function changeCategorie(id) {
  $('#pistemp3'+id)
    .find('option')
    .remove()
    .end();

    //remplissage select MP3
  var pistes = pisteMP3[$("#categoriemp3"+id).val()-1];
  $.each(pistes.pistes, function (value, text) {
    $('#pistemp3'+id).append($('<option>', {
            value: text.id,
            text : (value+1)+" - "+text.titre
        }));
  });
}

function setPisteMP3Alarme(id)
{

  var numPiste = $('#numPisteMP3'+id).val();
  if(numPiste==-1) return;

  var textPiste;
  if(numPiste<10) textPiste = "00"+numPiste;
  else if (numPiste<100) textPiste = "0"+numPiste;
  else textPiste = ""+numPiste;

  $.each(pisteMP3, function (value, text) {
    if(text.min<numPiste && text.max>numPiste)
    {
      // console.log("catégorie - " + text.categorie + ", " + textPiste);
      $("#categoriemp3"+id).val(value+1);
      changeCategorie(id);
      $.each(text.pistes, function (value, text2) {
        if(text2.id==textPiste)
        {
          console.log("Trouvé - "+ value+" - " + text2.titre);
          $("#pistemp3"+id).val(textPiste);
        }
      });
    }
  });

  // var pistes = pisteMP3[id-1];
}

$( document ).ready(function() {

  
  loadPisteMp3(); 

  getInfo();

  getAlarmes();

  getHisto();
  infoJson();
  update_Info();

  // ajout des listener
  $('#LUM').on('change',Options);
  $('#SEC').on('change',Options);
  $('#HOR').on('change',Options);
  $('#INT').on('change',Options);
  $('#REV').on('change',Options);
  $('#LED').on('change',Options);
  $('#BRI').on('change',Options);
  $('#COLOR').on('change',Options);
  $('#DDHT').on('change',Options);
  $('.reveilAudio').on('change',reveilAudio);

  $('input[type="range"]').rangeslider({
  polyfill: false
  });
  //remplissage select
  $.each(buzMusic, function (value, text) {
    $('.buzaudio').append($('<option>', {
            value: value+1,
            text : (value+1)+" - "+text
        }));
  });

  $.each(couleurs, function (value, text) {

    $('#COLOR').append($('<option>', {
            value: value,
            text : text
        }));
  });


  $.each(fx, function (value, text) {
    if (value<13 || value>14) {  //no sprite  no effect
    $('#FX').append($('<option>', {
            value: value,
            text : value+" - "+text
        }));
    }
  });

  $.each(animation, function (value, text) {
    $('#Anim').append($('<option>', {
            value: value,
            text : value+" - "+text
        }));

  });
  /*
  $('#Alarme').datetimepicker({
                      locale: 'fr',
                      format: 'HH:mm',
                      inline: false,
                      widgetPositioning:{
                        horizontal: 'left',
                        vertical: 'bottom'
                                    }

  });
  */
  $(document).on('input', 'input[type="range"]', function(e) {
          valueOutput(e.target);
      });

  //requete test version notifheure XL


}); // fin fonction document
