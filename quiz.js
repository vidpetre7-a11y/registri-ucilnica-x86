const quizBank = [
  [
    ["Izhod dvovhodnega vezja naj bo 1, kadar sta vhoda enaka. Kateri izraz uporabiš?",["A ∧ B","A ∨ B","¬(A XOR B)","A XOR B"],2,"Enaka vhoda sta 00 in 11. XOR v obeh primerih vrne 0, njegov komplement pa 1."],
    ["Polovični seštevalnik dobi A = 1 in B = 1. Kakšna sta bit vsote in izhodni prenos?",["0 in 1","1 in 0","1 in 1","0 in 0"],0,"Bit vsote je 1 XOR 1 = 0, prenos je 1 AND 1 = 1."],
    ["Koliko vrstic ima popolna resničnostna tabela funkcije s tremi neodvisnimi binarnimi vhodi?",["3","6","9","8"],3,"Vsak od treh vhodov ima dve možnosti. Skupaj je 2³ = 8 kombinacij."]
  ],
  [
    ["Kakšna je 8-bitna šestnajstiška predstavitev števila −2 v dvojiškem komplementu?",["0x82","0xFE","0xFD","0x02"],1,"Število 2 je 00000010. Po obračanju bitov in prištevanju 1 dobiš 11111110 oziroma FE."],
    ["Pri 8-bitnem seštevanju 0x7F + 0x01 nastane 0x80. Kakšni sta zastavici CF in OF?",["1 in 1","1 in 0","0 in 0","0 in 1"],3,"Iz najvišjega bita ni prenosa. Predznačena vsota 127 + 1 preseže največjo predstavljivo vrednost 127."],
    ["Pri normalizirani vrednosti IEEE 754 binary32 je polje eksponenta desetiško 130. Kateri eksponent dejansko uporabiš?",["3","130","−3","257"],0,"Od kodirane vrednosti odšteješ pristranskost 127 in dobiš 130 − 127 = 3."]
  ],
  [
    ["V kakšnem vrstnem redu so bajti na naraščajočih naslovih po zapisu 32-bitne vrednosti 0x11223344 na procesorju x86?",["11 22 33 44","44 33 22 11","22 11 44 33","33 44 11 22"],1,"Zapis little-endian postavi najmanj pomemben bajt 44 na najnižji naslov."],
    ["Koliko bajtov zavzame niz »A€« v UTF-8 skupaj z eno zaključno ničlo?",["2","3","4","5"],3,"A zavzame 1 bajt, € tri in zaključna ničla še enega. Skupaj je to 5 bajtov."],
    ["Koliko bajtov brez glave zasede ena sekunda enokanalnega zvoka PCM z 8000 vzorci/s in 16 biti/vzorec?",["8000","128000","16000","1000"],2,"16 bitov sta 2 bajta. Za 8000 vzorcev na enem kanalu dobiš 8000 × 2 = 16000 B."]
  ],
  [
    ["EAX = 3 in EBX = 100. Kateri naslov uporabi [ebx+eax*4+8]?",["111","120","432","112"],1,"100 + 3 × 4 + 8 = 120. Izraz vsebuje bazo, skalirani indeks in odmik."],
    ["Po cmp eax,ebx želiš skočiti, če je EAX strogo manjši kot predznačeno število. Kateri skok izbereš?",["jb","jle","jl","je"],2,"JL preverja predznačeno relacijo <. JLE sprejme tudi enakost, JB pa primerja brez predznaka."],
    ["Oznaka x ima naslov 1000, na tem naslovu je 32-bitna vrednost 7. Kaj vsebuje EAX po ukazu mov eax,[x]?",["1000","1007","4","7"],3,"Oglati oklepaji pomenijo branje vsebine pomnilnika na naslovu x."]
  ],
  [
    ["Kateri argument v 32-bitnem cdecl potisneš na sklad najprej za klic printf(fmt, 7)?",["Vrednost 7","Naslov fmt","Povratni naslov","Naslov registra EAX"],0,"Argumenti gredo na sklad od desne proti levi. Povratni naslov shrani ukaz CALL."],
    ["Scanf je s formatom %d uspešno prebral eno celo število. Kaj dobiš v EAX po vrnitvi?",["Naslov n","Vrednost prebranega števila","1","4"],2,"Vrnjena vrednost šteje uspešna prirejanja. Prebrano število je v pomnilniku na predanem naslovu."],
    ["Števec mora ohraniti vrednost skozi več klicev printf. Katera rešitev ustreza 32-bitnemu cdecl?",["Prepusti števec v ECX","Shrani števec v svojo pomnilniško spremenljivko","Prepusti števec v EAX","Uporabi EIP kot splošni števec"],1,"Spremenljivka v lastnem pomnilniku ohrani števec. Klic sme spremeniti EAX, ECX in EDX."]
  ],
  [
    ["Kateri dogodek običajno sproži zunanjo asinhrono prekinitev?",["Izvedba ukaza ADD","Deljenje z nič","Izvedba navadnega RET","Signal vhodno-izhodne naprave"],3,"Zahteva naprave lahko prispe med izvajanjem programa neodvisno od trenutne instrukcije."],
    ["Učni procesor mora med branjem pomnilnika zadržati naslov operanda. Kateri register je temu namenjen?",["IR","MAR","MDR","PSW"],1,"MAR hrani naslov pomnilniškega dostopa. MDR prenaša njegovo vsebino."],
    ["Kaj običajni x86 CALL shrani na sklad pred skokom v podprogram?",["Vse splošnonamenske registre","Trenutni EAX","Naslov naslednje instrukcije","Vsebino zastavic"],2,"RET pozneje s sklada prebere povratni naslov in na njem nadaljuje izvajanje."]
  ],
  [
    ["Program izvede 600 milijonov ukazov s povprečnim CPI 2 pri 3 GHz. Kolikšen je čas CPU?",["0,4 s","0,2 s","4 s","1,2 s"],0,"600 × 10⁶ × 2 / (3 × 10⁹) = 0,4 s."],
    ["Polovico prvotnega časa programa pospešiš dvakrat. Kolikšna je skupna pospešitev?",["2","1,5","4","4/3"],3,"Preostali čas je 0,5 + 0,5/2 = 0,75 prvotnega časa. Pospešitev je 1/0,75 = 4/3."],
    ["75 % izvedenih ukazov ima CPI 1, preostali CPI 5. Kakšen je povprečni CPI?",["3","2","1,25","4"],1,"0,75 × 1 + 0,25 × 5 = 2. Uteži so deleži dejansko izvedenih ukazov."]
  ],
  [
    ["Predpomnilnik ima čas zadetka 1 ns, 10 % zgrešitev in dodatno kazen 40 ns ob zgrešitvi. Kolikšen je povprečni čas dostopa?",["4 ns","41 ns","5 ns","4,9 ns"],2,"1 + 0,10 × 40 = 5 ns. Kazen je dodatni čas po preverjanju predpomnilnika."],
    ["Neposredno preslikan predpomnilnik ima 8 vrstic in 16 B na blok. Katero vrstico (0–7) uporabi bajt na desetiškem naslovu 160?",["2","0","5","6"],0,"Številka bloka je 160/16 = 10. Indeks vrstice je 10 mod 8 = 2."],
    ["Pri 4 KiB straneh se navidezna stran naslova 0x7A24 preslika v fizični okvir 0x19. Kakšen je fizični naslov?",["0x197A","0x197A24","0x7A19","0x19A24"],3,"Spodnjih 12 bitov (A24) je odmik. Pred njega postaviš številko fizičnega okvirja 19."]
  ]
];
