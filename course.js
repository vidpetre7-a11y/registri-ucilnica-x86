/* Vsebinski sklopi učilnice Registri. */
const lessons = [
  {
    "id": "logika",
    "no": "02",
    "name": "Digitalna logika",
    "sig": "A∧B",
    "desc": "Od resničnostne tabele do vezja, ki sešteva, izbira in hrani stanje.",
    "file": "02_RA_Digitalna_logika.pdf",
    "parts": [
      [
        "Bit in logična vrata",
        "Bit ima dve možni vrednosti, 0 in 1. Resničnostna tabela našteje vse kombinacije vhodov. Pri n neodvisnih bitih ima 2ⁿ vrstic. AND zahteva oba vhoda, OR vsaj enega, XOR pa pri dveh vhodih natanko eno enico. NOT obrne vhod. NAND je negacija AND, NOR pa negacija OR.",
        {
          "table": [
            [
              "A",
              "B",
              "AND",
              "OR",
              "XOR"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "1",
              "0",
              "1",
              "1"
            ],
            [
              "1",
              "0",
              "0",
              "1",
              "1"
            ],
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ]
          ]
        }
      ],
      [
        "Od tabele do izraza",
        "Za vsako vrstico, v kateri je izhod 1, sestavi člen AND vseh vhodov. Vhod z vrednostjo 0 zapiši negirano, vhod z vrednostjo 1 pa neposredno. Vse dobljene člene poveži z OR. Če je izhod 1 le pri 01 in 10, dobiš (¬A ∧ B) ∨ (A ∧ ¬B), torej XOR. De Morganova zakona povesta, kako negacija spremeni AND v OR in obratno.",
        {
          "code": "¬(A ∧ B) = ¬A ∨ ¬B\n¬(A ∨ B) = ¬A ∧ ¬B\nA ∧ (A ∨ B) = A"
        }
      ],
      [
        "Poenostavljanje in Karnaughova karta",
        "Če se dva člena razlikujeta samo po eni spremenljivki in njeni negaciji, lahko to spremenljivko odstraniš. V Karnaughovi karti so vrstice in stolpci urejeni po Grayevem zaporedju, na primer 00, 01, 11, 10. Združujemo pravokotne skupine z 1, 2, 4 … celicami. Robovi se stikajo, diagonalne celice pa niso sosede. Nedefinirane kombinacije lahko uporabiš za večjo skupino.",
        {
          "example": "(A ∧ B) ∨ (A ∧ ¬B) = A ∧ (B ∨ ¬B) = A. Znotraj združenega para se spreminja le B, zato v krajšem izrazu ostane A."
        }
      ],
      [
        "Multiplekser, dekoder in seštevalnik",
        "Multiplekser z izbiro S poveže enega od vhodov z izhodom. Dekoder n-bitno kodo pretvori v izbor ene od 2ⁿ izhodnih linij. Polovični seštevalnik sešteje dva bita. Popolni seštevalnik prišteje še vhodni prenos Cᵢ. Izhodni prenos uporabimo kot vhodni prenos naslednjega mesta.",
        {
          "code": "MUX 2 v 1: Y = (¬S ∧ D₀) ∨ (S ∧ D₁)\nPolovični seštevalnik: vsota = A XOR B, prenos = A ∧ B\nPopolni seštevalnik: vsota = A XOR B XOR Cᵢ\nIzhodni prenos je 1, če sta vsaj dva od treh vhodov 1."
        }
      ],
      [
        "Sekvenčna vezja in ura",
        "Pri kombinacijskem vezju je izhod določen s trenutnimi vhodi. Sekvenčno vezje hrani stanje. Nivojsko proženi pomnilni element se lahko med aktivno ravnijo odziva na spremembe. Robno proženi D-element vzorči D ob aktivnem robu ure. Več D-elementov z isto uro sestavlja register. Pomikalni register premika bite med mesti, števec pa s povratno povezavo prehaja v naslednje stanje.",
        {
          "example": "D je ob naraščajočem robu 1. Izhod Q po robu postane 1. Če se nato med dvema robovoma D spremeni na 0, Q obdrži 1 do naslednjega aktivnega roba."
        }
      ]
    ],
    "quick": [
      "Za katera vhoda se izhoda OR in XOR razlikujeta?",
      [
        "A = 0, B = 0",
        "A = 1, B = 1",
        "A = 0, B = 1"
      ],
      1,
      "Pri dveh enicah je OR enak 1, XOR pa 0."
    ]
  },
  {
    "id": "podatki",
    "no": "04",
    "name": "Predstavitev podatkov",
    "sig": "0x2A",
    "desc": "Pretvorbe, dvojiški komplement, preliv in zapis realnih števil.",
    "file": "04_RA_Predstavitev_podatkov.pdf",
    "parts": [
      [
        "Mestni zapis in pretvarjanje",
        "V bazi b je vrednost vsota števk, pomnoženih z ustreznimi potencami b. Bite za šestnajstiški zapis razdeli od desne v skupine po štiri, za osmiški zapis pa po tri. Desetiško celo število pretvoriš v dvojiško z zaporednim deljenjem z 2 in branjem ostankov od zadnjega proti prvemu. Pri ulomku množi preostanek z 2 in sproti odčitaj cele dele.",
        {
          "code": "0010 1010₂ = 2 × 16 + 10 = 2A₁₆ = 42₁₀\n101,01₂ = 4 + 1 + ¼ = 5,25₁₀\n101 110₂ = 56₈ = 46₁₀"
        }
      ],
      [
        "Predznak in komplement",
        "Z n biti brez predznaka predstaviš od 0 do 2ⁿ − 1. Dvojiški komplement predstavlja števila od −2⁽ⁿ⁻¹⁾ do 2⁽ⁿ⁻¹⁾ − 1. Nasprotno vrednost dobiš tako, da obrneš vse bite in prišteješ 1 v isti širini. Predznak z absolutno vrednostjo in eniški komplement imata dve predstavitvi ničle. Pri razširitvi predznačene vrednosti v dvojiškem komplementu ponovi najvišji bit, pri nepredznačeni pa dodaj ničle.",
        {
          "table": [
            [
              "8-bitni vzorec",
              "Brez predznaka",
              "Dvojiški komplement"
            ],
            [
              "0111 1111",
              "127",
              "127"
            ],
            [
              "1000 0000",
              "128",
              "−128"
            ],
            [
              "1111 1111",
              "255",
              "−1"
            ]
          ]
        }
      ],
      [
        "Seštevanje, odštevanje in preliv",
        "Pri 8-bitnem seštevanju shraniš spodnjih osem bitov. CF na x86 označuje prenos iz najvišjega bita pri seštevanju oziroma izposojo pri odštevanju. OF označuje, da matematični predznačeni rezultat ni predstavljiv. Pri seštevanju dveh pozitivnih ali dveh negativnih števil prepoznaš predznačeni preliv, če rezultat dobi nasprotni predznak. Pri odštevanju drugega operanda lahko prišteješ njegov dvojiški komplement.",
        {
          "example": "01111111 + 1 = 10000000. OF = 1 in CF = 0. Pri 11111111 + 1 dobiš 00000000, CF = 1 in OF = 0. Za 7 − 3 lahko v 8 bitih sešteješ 00000111 in 11111101. Spodnjih osem bitov je 00000100."
        }
      ],
      [
        "Decimalna koda in fiksna vejica",
        "Pri pakirani kodi BCD vsaka decimalna števka zasede štiri bite. Pri fiksni vejici pa je mesto dvojiške vejice dogovorjeno vnaprej. Če je f ulomnih bitov, shraniš celo število k in ga bereš kot k/2ᶠ. Več ulomnih bitov zmanjša korak med predstavljenimi vrednostmi, za isto skupno širino pa zmanjša razpon.",
        {
          "code": "42₁₀ → pakirani BCD: 0100 0010\n42₁₀ → običajni dvojiški zapis: 0010 1010\nVzorec 00010110 s štirimi ulomnimi biti:\n22 / 16 = 1,375"
        }
      ],
      [
        "Plavajoča vejica IEEE 754",
        "Binary32 uporablja 1 bit za predznak s, 8 za eksponent E s pristranskostjo 127 in 23 za ulomek F. Za normalizirano število velja (−1)ˢ × (1 + F) × 2^(E − 127). Polje eksponenta 0 kodira ničlo ali subnormalno vrednost, 255 pa neskončnost ali NaN. Binary64 uporablja razrez 1 + 11 + 52 in pristranskost 1023. Desetiški ulomek 0,1 ima neskončen dvojiški zapis, zato ga pri končni širini zaokrožimo.",
        {
          "code": "5,5₁₀ = 101,1₂ = 1,011₂ × 2²\ns = 0      E = 2 + 127 = 129 = 10000001₂\nulomek = 01100000000000000000000"
        }
      ]
    ],
    "quick": [
      "Kaj pomeni vzorec 1111 1011 v 8-bitnem dvojiškem komplementu?",
      [
        "−4",
        "251",
        "−5"
      ],
      2,
      "Vzorec brez predznaka je 251. Ker je najvišji bit 1, v tej širini odštej 256. Rezultat je −5."
    ]
  },
  {
    "id": "znaki",
    "no": "05",
    "name": "Znaki in drugi podatki",
    "sig": "U+",
    "desc": "Kako se znaki, besedilo, slike in zvok preslikajo v bajte.",
    "file": "05_RA_Znaki_in_ostali.pdf",
    "parts": [
      [
        "Znak in njegova koda",
        "ASCII uporablja 7 bitov in 128 možnih kod. Števke, črke in kontrolni znaki imajo določene kode. Znak '0' ima vrednost 48, številska ničla pa 0. Starejše 8-bitne kodne strani lahko isti vrednosti pripišejo različna znaka. EBCDIC je druga družina kodiranj. Unicode dodeljuje kodne točke. UTF-8, UTF-16 in UTF-32 določajo, kako te točke kodiramo.",
        {
          "table": [
            [
              "Znak",
              "Kodna točka",
              "Bajti UTF-8 (hex)"
            ],
            [
              "A",
              "U+0041",
              "41"
            ],
            [
              "č",
              "U+010D",
              "C4 8D"
            ],
            [
              "€",
              "U+20AC",
              "E2 82 AC"
            ]
          ]
        }
      ],
      [
        "Niz, dolžina in zaključek",
        "C-niz se konča z bajtom 0. NASM z direktivo db shrani naštete bajte. Vrednost 10 pomeni premik v novo vrstico v besedilu na Linuxu. UTF-8 za kodno točko porabi od 1 do 4 bajte. Število bajtov, kodnih točk in vidnih znakov se lahko razlikuje. Funkcija printf pri %s bere do zaključne ničle, medtem ko sistemskemu klicu za zapis podaš tudi dolžino.",
        {
          "code": "niz db \"A\", 10, 0   ; bajti 41 0A 00\nznak db \"0\"         ; bajt 30 (hex)\nstevilo db 0        ; bajt 00"
        }
      ],
      [
        "Vrstni red bajtov",
        "Pri večbajtnih številih little-endian shrani najmanj pomemben bajt na najnižji naslov. Pri big-endian je na najnižjem naslovu najbolj pomemben bajt. Arhitektura x86 uporablja little-endian. Zaporedje znakov v nizu ostane v zapisanem vrstnem redu.",
        {
          "table": [
            [
              "Dword 0x12345678",
              "naslov p",
              "p+1",
              "p+2",
              "p+3"
            ],
            [
              "Little-endian",
              "78",
              "56",
              "34",
              "12"
            ],
            [
              "Big-endian",
              "12",
              "34",
              "56",
              "78"
            ]
          ]
        }
      ],
      [
        "Slike in vzorčenje zvoka",
        "Pri rasterju ločljivost poda število slikovnih točk, barvna globina pa število bitov na točko. Vektorska slika opisuje geometrijske oblike. Pri zvoku frekvenca vzorčenja pove število vzorcev na sekundo na kanal, bitna globina pa število kvantizacijskih ravni. Spodnja izračuna veljata za nekomprimirane podatke brez glav datotek in izravnave vrstic.",
        {
          "code": "RGB 640 × 480 × 3 B = 921 600 B\nPCM stereo, 48 kHz, 16 bitov, 1 s:\n48 000 × 2 kanala × 2 B = 192 000 B"
        }
      ],
      [
        "Odvečnost in napake",
        "Paritetni bit zazna liho število spremenjenih bitov v zaščiteni besedi. Hammingova razdalja je število mest, na katerih se besedi razlikujeta. Koda z najmanjšo razdaljo d zazna do d − 1 napak oziroma popravi do ⌊(d − 1)/2⌋ napak. Brezizgubno stiskanje omogoča natančno obnovo podatkov. Izgubno kodiranje lahko zavrže del informacije.",
        {
          "example": "1011000 vsebuje tri enice. Za sodo pariteto dodamo bit 1. Po spremembi enega bita bo skupno število enic liho, zato napako zaznamo."
        }
      ]
    ],
    "quick": [
      "Koliko bajtov zavzame C-niz »čA« v UTF-8 skupaj z zaključnim bajtom?",
      [
        "3",
        "4",
        "2"
      ],
      1,
      "č zavzame 2 bajta, A enega, zaključna ničla pa še enega."
    ]
  },
  {
    "id": "ukazi",
    "no": "06",
    "name": "Instrukcije in naslavljanje",
    "sig": "[EA]",
    "desc": "Operandi, efektivni naslovi, primerjave in poti podatkov med ukazi.",
    "file": "06_RA_Instrukcije_in_naslavljanja.pdf",
    "parts": [
      [
        "Zgradba instrukcije",
        "Operacijska koda določa dejanje, operandi pa vrednosti ali mesta, nad katerimi deluje. Vrste ukazov obsegajo prenose, aritmetiko, bitno logiko, pomike, vhod/izhod in spremembo toka. Operandi so lahko navedeni izrecno ali določeni z ukazom. Sintaksa NASM praviloma navaja najprej cilj, nato vir. Pri običajnem MOV oba operanda ne moreta biti pomnilniška.",
        {
          "code": "mov eax, 12      ; takojšnja konstanta\nmov ebx, eax     ; EBX dobi kopijo\nadd eax, ebx     ; rezultat se vrne v EAX"
        }
      ],
      [
        "Koliko naslovov nosi ukaz?",
        "Pri običajnem dvonaslovnem seštevanju je cilj hkrati prvi vhod. Triadresni ukaz lahko ločeno določi oba vira in cilj. Enoadresna arhitektura pogosto uporablja implicitni akumulator, ničadresna pa za aritmetiko vrh sklada. Pri primerjavi arhitektur loči število eksplicitnih operandov od števila pomnilniških dostopov.",
        {
          "example": "Za C = A + B bi v skladovnem modelu lahko zapisal PUSH A, PUSH B, ADD, POP C. ADD dobi oba operanda implicitno s sklada. V dvoadresnem modelu lahko najprej kopiraš A v register in mu nato prišteješ B."
        }
      ],
      [
        "Kje se nahaja operand?",
        "Pri takojšnjem naslavljanju je operand v instrukciji, pri registrskem je v registru, pri neposrednem pomnilniškem pa na naslovu iz ukaza. Pri registrsko posrednem naslavljanju register vsebuje naslov. Pri pomnilniško posrednem naslavljanju v splošnem modelu ISA prebereš naslov iz pomnilnika in nato še podatek s tega naslova.",
        {
          "table": [
            [
              "Zapis NASM",
              "Kaj izvede"
            ],
            [
              "mov eax, x",
              "Naloži naslov oznake x"
            ],
            [
              "mov eax, [x]",
              "Prebere 4 B na naslovu x"
            ],
            [
              "mov eax, [ebx]",
              "Prebere 4 B z naslova v EBX"
            ],
            [
              "lea eax, [ebx+4]",
              "Izračuna EBX + 4"
            ]
          ]
        }
      ],
      [
        "Indeks, merilo in odmik",
        "Efektivni naslov na x86 je lahko baza + indeks × merilo + odmik. Merilo je 1, 2, 4 ali 8. Za tabelo 32-bitnih elementov indeks pomnožiš s 4. Pri relativnem skoku se kodirani odmik prišteje naslovu naslednje instrukcije. Sklad uporablja ESP. PUSH pri 32-bitnem operandu zmanjša ESP za 4 in shrani vrednost.",
        {
          "example": "Pri EBX = 1000 in ESI = 3 naslavljanje [ebx + esi*4 + 8] uporabi naslov 1020. LEA vrne 1020. MOV z oglatimi oklepaji prebere vsebino na tem naslovu."
        }
      ],
      [
        "Pogojni skoki in podprogrami",
        "CMP a,b nastavi zastavice kot a − b in ohrani oba operanda. JE in JNE preverjata enakost. JL, JLE, JG in JGE primerjajo predznačene vrednosti, JB, JBE, JA in JAE pa nepredznačene. CALL shrani povratni naslov, RET ga vzame s sklada. Pri zanki prepoznaj inicializacijo, pogoj, telo in korak.",
        {
          "code": "cmp eax, 26\njle konec       ; končaj pri predznačenem EAX ≤ 26\nsub eax, 26     ; izračunaj pozitivno zgornjo mejo"
        }
      ]
    ],
    "quick": [
      "EBX = 200, ESI = 2. Kaj vrne lea eax,[ebx+esi*4+4]?",
      [
        "212",
        "Vsebino na naslovu 212",
        "206"
      ],
      0,
      "LEA izračuna 200 + 2 × 4 + 4 = 212 in rezultat shrani v EAX."
    ]
  },
  {
    "id": "nasm",
    "no": "07",
    "name": "Intel x86 in NASM",
    "sig": "EAX",
    "desc": "Registri, sekcije, sklad in prvi klici printf ter scanf v 32-bitnem programu.",
    "file": "07_RA_Intelova_Arhitektura_x86_NASM.pdf",
    "parts": [
      [
        "32-bitni registri",
        "Laboratorij uporablja 32-bitni Linux i386 in sintakso Intel. EAX, EBX, ECX, EDX, ESI, EDI, EBP in ESP so 32-bitni splošnonamenski registri. AX je spodnjih 16 bitov EAX. AL je njegov najnižji bajt, AH pa naslednji. EIP kaže na naslednjo instrukcijo. Pri i386 cdecl klicana funkcija ohrani EBX, ESI, EDI in EBP. EAX, ECX in EDX se med klicem smejo spremeniti.",
        {
          "code": "mov eax, 0x12345678\nmov al, 0xFF        ; EAX = 0x123456FF\nxor eax, eax        ; EAX = 0"
        }
      ],
      [
        "Sekcije, oznake in velikosti",
        ".data vsebuje inicializirane podatke, .bss rezervira prostor, .text pa vsebuje ukaze. DB, DW in DD določijo 1, 2 in 4 bajte. RESB in RESD rezervirata bajte oziroma štiribajtne elemente. GLOBAL main izpostavi main povezovalniku. EXTERN označi simbol, ki ga zagotovi drug modul. Oznaka označuje naslov, oglati oklepaji pa dostop do vsebine na naslovu.",
        {
          "code": "bits 32\nglobal main\nextern printf, scanf\nsection .data\n    fmt db \"%d\", 0\nsection .bss\n    n resd 1\nsection .text\nmain:             ; telo funkcije"
        }
      ],
      [
        "Sklad in klicni dogovor",
        "V i386 cdecl podajaš argumente na sklad od zadnjega proti prvemu. CALL na sklad zapiše še povratni naslov. Klicatelj po vrnitvi odstrani argumente in poravnalno polnilo. V vajah s knjižnico C poravnamo ESP na 16 bajtov tik pred CALL. Ogrodje s shrambama EBP in ESP omogoča obnovitev prvotnega sklada. Glavna funkcija z EAX = 0 vrne izhodno kodo uspeha.",
        {
          "code": "push ebp\nmov ebp, esp\nand esp, -16      ; izhodišče za poravnane klice\n; ... telo funkcije ...\nxor eax, eax\nmov esp, ebp\npop ebp\nret"
        }
      ],
      [
        "Izpis s printf",
        "Format %d izpiše predznačeno celo število, %u nepredznačeno in %s niz. Vsak %s potrebuje naslov veljavnega niza z zaključnim bajtom 0. Pri printf(format, 42) torej najprej potisneš 42, nato naslov formata. Puts sprejme naslov enega niza in na konec izpisa doda novo vrstico.",
        {
          "code": "; ESP je trenutno poravnan na 16 B\n; v .data: izpis db \"%d\", 10, 0\nsub esp, 8\npush dword 42\npush dword izpis\ncall printf\nadd esp, 16       ; odstrani argumenta in polnilo"
        }
      ],
      [
        "Branje s scanf",
        "Scanf pri %d potrebuje naslov prostora za 4-bajtno vrednost. Pri printf uporabiš prebrano vrednost, ko želiš izpisati to število. Scanf v EAX vrne število uspešnih prirejanj. Pri branju enega števila primerjaj EAX z 1, preden prebrano vrednost uporabiš. Ogrodje in preverjanje z različnimi vhodi najdeš v laboratoriju.",
        {
          "code": "; ESP je poravnan, fmt vsebuje \"%d\",0\nsub esp, 8\npush dword n      ; naslov za vpis\npush dword fmt\ncall scanf\nadd esp, 16\ncmp eax, 1\njne konec\nmov eax, [n]      ; vrednost, ki jo je vpisal scanf"
        }
      ],
      [
        "Od izvorne do izvršljive datoteke",
        "NASM pretvori izvorno datoteko .asm v predmetno datoteko oblike ELF32. Povezovalnik doda zagonsko kodo in razreši zunanje simbole, na primer printf. Če uporabljaš vstopno točko main in knjižnico C, poveži program s 32-bitnim GCC. Spodnji ukazi so za Linux z nameščenimi NASM, GCC in 32-bitnimi razvojnimi knjižnicami.",
        {
          "code": "nasm -f elf32 program.asm -o program.o\ngcc -m32 -no-pie program.o -o program\nfile program     # preveri: ELF 32-bit\n./program"
        }
      ]
    ],
    "quick": [
      "Za n resd 1 in format %d moraš funkciji scanf kot drugi argument podati …",
      [
        "push dword [n]",
        "push dword n",
        "push dword 4"
      ],
      1,
      "Scanf vpiše rezultat na naslov n. [n] bi prebral staro vrednost."
    ]
  },
  {
    "id": "cikel",
    "no": "08",
    "name": "Instrukcijski cikel in prekinitve",
    "sig": "IRQ",
    "desc": "Pridobivanje ukazov, vloga registrov in odziv procesorja na dogodke.",
    "file": "08_RA_Instrukcijski_cikel_prekinitve_in_registri.pdf",
    "parts": [
      [
        "Sledi eni instrukciji",
        "Pri poenostavljenem procesorju programski števec PC poda naslov. Procesor prebere instrukcijo v IR in jo dekodira. Po potrebi izračuna naslov operanda, prebere podatke, izvede operacijo in zapiše rezultat. Skok spremeni običajno zaporedje naslovov. Na x86 se dolžina ukazov razlikuje, zato naslednji naslov ni vedno trenutni naslov plus štiri.",
        {
          "code": "Primer zajema v učnem modelu:\nMAR ← PC        ; izberi naslov instrukcije\nMDR ← M[MAR]    ; preberi pomnilnik\nIR  ← MDR       ; prevzemi ukaz"
        }
      ],
      [
        "Uporabniški in krmilni registri",
        "Splošnonamenski registri hranijo operande in naslove. ALU računa, krmilna enota usmerja prenose. PC/EIP sledi toku instrukcij, SP/ESP vrhu sklada, statusni register pa pogojem izračuna. V učnem modelu MAR hrani naslov dostopa, MDR/MBR pa prenesene podatke. Del notranjih registrov procesorja programerju ni neposredno dostopen.",
        {
          "table": [
            [
              "Zastavica x86",
              "Pomen po ustrezni operaciji"
            ],
            [
              "ZF",
              "Rezultat je nič"
            ],
            [
              "SF",
              "Najvišji bit rezultata je 1"
            ],
            [
              "CF",
              "Nepredznačeni prenos ali izposoja"
            ],
            [
              "OF",
              "Predznačeni preliv"
            ]
          ]
        }
      ],
      [
        "Prekinitev in izjema",
        "Zunanja naprava lahko sproži asinhrono prekinitveno zahtevo. Izjema, na primer deljenje z nič, je povezana z izvedbo konkretnega ukaza. Procesor shrani potrebno povratno stanje in preusmeri nadzor na obdelovalno rutino. Rutina shrani še registre, ki jih bo spreminjala, ter obdela dogodek. Za vrnitev iz obdelave se na x86 uporablja IRET oziroma IRETD, iz običajnega podprograma pa RET.",
        {
          "example": "Tipkovnica sporoči, da je pripravljen znak. Procesor pokliče obdelovalno rutino, ki prevzame znak, nato pa lahko nadaljuje prekinjeni program. Pri cikličnem preverjanju program status naprave redno preverja sam."
        }
      ],
      [
        "Prednost in vektorji",
        "Pri vektorski obravnavi številka ali vektor izbere vnos, povezan z ustrezno rutino. Maskiranje začasno zadrži obravnavo določenih zunanjih prekinitev. Pri gnezdenju lahko višjeprioritetna zahteva prekine nižjeprioritetno rutino, če sistem to dopušča. Pri več sočasnih zahtevah mora krmilje izbrati vrstni red obdelave.",
        {
          "example": "Če ima časovnik višjo prednost kot tipkovnica in sta zahtevi hkrati pripravljeni, se najprej začne obdelava časovnika. Gnezdenje določa, ali lahko poznejša višjeprioritetna zahteva prekine že tekočo rutino."
        }
      ],
      [
        "Prekrivanje faz in zastoji",
        "Cevovod časovno prekriva faze različnih ukazov in lahko izboljša prepustnost. Latenca posameznega ukaza se pri tem ne zmanjša nujno. Podatkovna odvisnost nastane, ko naslednji ukaz potrebuje rezultat prejšnjega. Pogojni skoki ustvarjajo negotovost o naslednjem naslovu. Če dva ukaza istočasno potrebujeta isti omejeni vir, nastane strukturni konflikt.",
        {
          "example": "Po ADD EAX,1 potrebuje naslednji MOV [x],EAX že novi rezultat. Procesor lahko počaka ali rezultat posreduje neposredno iz ustrezne faze cevovoda."
        }
      ]
    ],
    "quick": [
      "Kateri register v klasičnem učnem procesorju določi naslov naslednje instrukcije?",
      [
        "IR",
        "MDR",
        "PC"
      ],
      2,
      "PC vsebuje naslov, IR trenutno instrukcijo in MDR prenesene podatke."
    ]
  },
  {
    "id": "metrike",
    "no": "10",
    "name": "Zmogljivost in metrike",
    "sig": "CPI",
    "desc": "Čas izvajanja, prepustnost, tehtani CPI in meje pospešitve.",
    "file": "10_RA_Zmogljivost_in_metrike.pdf",
    "parts": [
      [
        "Latenca, prepustnost in ura",
        "Odzivni čas pove, kako dolgo traja naloga, prepustnost pa, koliko nalog se konča v časovni enoti. Pretečeni čas vključuje tudi čakanje na vhod/izhod, čas CPU pa opisuje procesorsko delo. Frekvenca f pove število ciklov na sekundo, perioda je 1/f. Za primerjavo dveh računalnikov s frekvenco upoštevaj tudi število izvedenih ukazov in ciklov na ukaz.",
        {
          "code": "2 GHz → 2 × 10⁹ ciklov/s → 0,5 ns/cikel\nčas CPU = število instrukcij (IC) × povprečni CPI / f"
        }
      ],
      [
        "Tehtano povprečje CPI",
        "CPI pomeni povprečno število ciklov na izvedeno instrukcijo. Pri več razredih instrukcij uporabimo delež izvedenih instrukcij v vsakem razredu. Če procesor povprečno zaključi več kot eno instrukcijo na cikel, je CPI manjši od 1. Statično število zapisanih ukazov se lahko razlikuje od dinamičnega, ker se ukazi v zanki večkrat izvedejo.",
        {
          "example": "80 % izvedenih ukazov ima CPI 1 in 20 % CPI 5. Povprečni CPI = 0,8 × 1 + 0,2 × 5 = 1,8. Za milijardo ukazov pri 3 GHz je čas CPU 0,6 s."
        }
      ],
      [
        "Pospešitev, IPC, MIPS in FLOPS",
        "Pospešitev je razmerje med starim in novim časom pri isti nalogi. IPC pomeni instrukcije na cikel. Pri istih merjenih ciklih in instrukcijah je IPC = 1/CPI. MIPS šteje milijone instrukcij na sekundo. FLOPS šteje operacije s plavajočo vejico na sekundo. Različne ISA lahko za isto nalogo potrebujejo različno število instrukcij.",
        {
          "code": "Stari čas 6 s, novi čas 4 s:\nS = 6 / 4 = 1,5\nSkrajšanje časa = (6 − 4) / 6 = 33,3 %\nPovečanje zmogljivosti = (1,5 − 1) × 100 % = 50 %"
        }
      ],
      [
        "Amdahlov zakon",
        "Če izboljšaš del, ki je prej zahteval delež izvedbenega časa p, za faktor k, dobiš skupno pospešitev S = 1 / ((1 − p) + p/k). Delež p je delež prvotnega časa tega dela. Tudi pri zelo velikem k ostane neizboljšani delež 1 − p. Enako razmišljanje velja pri pospeševanju le nekaterih instrukcij.",
        {
          "example": "Štirikrat pospešiš del, ki je zahteval 60 % časa. Novi čas je 0,4 + 0,6/4 = 0,55 prvotnega. Pospešitev je približno 1,82. Če bi ta del postal hipen, bi bila največja pospešitev 1/0,4 = 2,5."
        }
      ],
      [
        "Merilni programi in povprečja",
        "Pred primerjavo določi program, vhod, merjeno količino in merilne pogoje. Za skupni čas več nalog seštej njihove čase. Za normalizirana razmerja več merilnih programov pogosto uporabimo geometrijsko sredino. Razmerje, izračunano za en program, se lahko pri drugačni delovni obremenitvi spremeni.",
        {
          "example": "Pri dveh enako uteženih merilnih programih sta normalizirani pospešitvi 2 in 8. Geometrična sredina je √(2 × 8) = 4. Za skupni prihranek časa bi potrebovali tudi prvotna časa obeh programov."
        }
      ]
    ],
    "quick": [
      "Izvedeš 2 milijardi ukazov s CPI 1,5 pri 3 GHz. Koliko traja procesorsko delo?",
      [
        "1 s",
        "2,25 s",
        "0,5 s"
      ],
      0,
      "(2 × 10⁹ × 1,5) / (3 × 10⁹) = 1 s."
    ]
  },
  {
    "id": "pomnilnik",
    "no": "11",
    "name": "Pomnilnik",
    "sig": "L1",
    "desc": "Pomnilniške tehnologije, predpomnilniške vrstice in navidezni naslovi.",
    "file": "11_RA_Pomnilnik.pdf",
    "parts": [
      [
        "Hierarhija, kapaciteta in naslovi",
        "Od registrov prek L1, L2 in L3 do glavnega pomnilnika DRAM in sekundarnega pomnilnika se spreminjajo latenca, kapaciteta in cena na bit. V bajtno naslovljenem prostoru 32-bitni naslov razlikuje 2³² bajtnih položajev. 1 KiB je 1024 B, 1 kB je 1000 B. Pri organizaciji N × W določa N število naslovljivih besed, W pa število bitov na besedo.",
        {
          "code": "4 GiB = 4 × 2³⁰ B = 2³² B\nPomnilnik 1024 × 8 bitov ima kapaciteto 1 KiB.\nZa izbor ene od 1024 besed potrebuješ 10 naslovnih bitov."
        }
      ],
      [
        "Vrste in načini dostopa",
        "SRAM hrani bit v vezju in se zaradi kratkega dostopa pogosto uporablja v predpomnilniku. DRAM hrani naboj, zahteva obnavljanje in omogoča večjo gostoto. Obe vrsti izgubita podatke brez napajanja. ROM in flash podatke ohranita. Pri zaporednem dostopu je treba prehoditi predhodne elemente. Pri naključnem dostopu izbereš lokacijo z naslovom, pri asociativnem pa iščeš glede na vsebino.",
        {
          "table": [
            [
              "Vrsta",
              "Tipična uporaba",
              "Kaj si zapomniti"
            ],
            [
              "SRAM",
              "Predpomnilnik",
              "Kratek dostop, ni periodičnega osveževanja"
            ],
            [
              "DRAM",
              "Glavni pomnilnik",
              "Osveževanje, velika gostota"
            ],
            [
              "Flash",
              "SSD, vgrajeni sistemi",
              "Ohranitev podatkov brez napajanja"
            ]
          ]
        }
      ],
      [
        "Lokalnost in preslikave",
        "Časovna lokalnost pomeni, da bo nedavno uporabljen podatek verjetno kmalu ponovno uporabljen. Pri prostorski lokalnosti kmalu pričakujemo dostope do bližnjih naslovov. Predpomnilnik prenaša celotne bloke. Pri neposredni preslikavi ima blok eno možno vrstico. Pri naborno asociativni preslikavi izbere en nabor z več možnimi vrsticami, pri popolnoma asociativni pa lahko zasede katerokoli vrstico.",
        {
          "example": "Neposredno preslikan predpomnilnik ima 4 vrstice in bloke po 16 B. Naslov 72 je v bloku ⌊72/16⌋ = 4. Vrstica je 4 mod 4 = 0, odmik pa 72 mod 16 = 8."
        }
      ],
      [
        "Oznaka, indeks, odmik",
        "Odmik izbere bajt znotraj vrstice, indeks izbere nabor, oznaka (tag) pa preveri, ali izbrani nabor vsebuje pravi blok. Za dolžino vrstice 2ᵇ bajtov porabiš b spodnjih bitov, za 2ⁱ naborov naslednjih i bitov, preostanek naslova je oznaka. Število naborov dobiš tako, da kapaciteto podatkov deliš z dolžino vrstice in številom poti.",
        {
          "example": "32-bitni naslov, predpomnilnik 8 KiB, 2 poti in vrstice po 32 B. Naborov je 8192/(2 × 32) = 128. Odmik ima 5 bitov, indeks 7 bitov in oznaka 32 − 5 − 7 = 20 bitov."
        }
      ],
      [
        "Zadetki in pisanje",
        "Zadetek pomeni, da je zahtevan blok že prisoten. Pri zgrešitvi ga pridobiš na nižji ravni. Povprečni čas dostopa AMAT je čas zadetka + delež zgrešitev × dodatna kazen zgrešitve. Pri write-through spremembo posreduješ nižji ravni takoj, pri write-back pa spremenjeni blok navadno ob izločitvi. Pri več možnih žrtvah se uporabljajo npr. LRU, FIFO ali naključna izbira.",
        {
          "example": "Čas zadetka je 2 ns, delež zgrešitev 5 %, dodatna kazen pa 60 ns. Povprečni čas dostopa je 2 + 0,05 × 60 = 5 ns."
        }
      ],
      [
        "Navidezni pomnilnik",
        "Navidezni naslov razdeliš na številko strani in odmik. Tabela strani določa številko fizičnega okvirja. Odmik se pri preslikavi ne spremeni. TLB hrani nedavno uporabljene preslikave. Zgrešitev TLB zahteva pridobitev preslikave. Če zahtevana veljavna stran ni prisotna v fizičnem pomnilniku, napako strani (page fault) obravnava operacijski sistem.",
        {
          "example": "Pri straneh velikosti 4 KiB je odmik dolg 12 bitov. Navidezni naslov 0x12345 pripada strani 0x12 in ima odmik 0x345. Če je stran v fizičnem okviru 0xAB, je fizični naslov 0xAB345."
        }
      ]
    ],
    "quick": [
      "Koliko bitov za odmik potrebuje blok velikosti 64 B pri bajtnem naslavljanju?",
      [
        "8",
        "64",
        "6"
      ],
      2,
      "64 = 2⁶, zato 6 spodnjih bitov izbere bajt znotraj bloka."
    ]
  }
];
