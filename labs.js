const RALab = (function makeLabs(){
  const profile = ["Ana", "Novak", "12345678", "GPT-4o", "Claude", "Gemini"];

  function frame(data, bss, body, imports = "printf, scanf") {
    const lines = ["bits 32", "global main", "extern " + imports, "", "section .data", data, ""];
    if (bss) lines.push("section .bss", bss, "");
    lines.push("section .text", "main:", "    push ebp", "    mov ebp, esp", "    and esp, -16",
      body, ".konec:", "    xor eax, eax", "    mov esp, ebp", "    pop ebp", "    ret", "");
    return lines.join("\n");
  }

  const numberFmt = '    vhod db "%d", 0\n    izhod db "%d", 10, 0';
  const pairFmt = '    vhod db "%d %d", 0\n    izhod db "%d", 10, 0';
  const n = "    n resd 1";
  const ab = "    a resd 1\n    b resd 1";
  const readN = [
    "    sub esp, 8", "    push dword n", "    push dword vhod", "    call scanf", "    add esp, 16",
    "    cmp eax, 1", "    jne .konec"
  ].join("\n");
  const readPair = [
    "    sub esp, 4", "    push dword b", "    push dword a", "    push dword vhod", "    call scanf",
    "    add esp, 16", "    cmp eax, 2", "    jne .konec"
  ].join("\n");
  const show = value => [
    "    sub esp, 8", "    push " + value, "    push dword izhod", "    call printf", "    add esp, 16"
  ].join("\n");
  const showString = label => [
    "    sub esp, 12", "    push dword " + label, "    call puts", "    add esp, 16"
  ].join("\n");
  const sequence = value => Array.from({length: Math.max(0, value - 26)}, (_, i) => i + 1).join(" ");

  function task(id, title, kind, prompt, data, bss, body, hints, cases, reads, imports) {
    return {
      id, title, kind, prompt, hints, cases, reads,
      starter: frame(data, bss, "    ; Tukaj napiši svojo rešitev.", imports),
      solution: frame(data, bss, body, imports)
    };
  }

  const items = [
    task("vizitka", "Osebna vizitka", "Izpis",
      "Izpiši ime, priimek, vpisno številko in tri različne modele umetne inteligence v zapisanem vrstnem redu. Presledki in nove vrstice so enakovredni. Spodaj lahko nastaviš svoje ali izmišljene podatke.",
      "    ; Tukaj definiraj svoje nize z db.", "", "",
      ["Za vsako vrstico lahko pripraviš niz, zaključen z bajtom 0.",
       "Puts sprejme naslov niza in doda novo vrstico. V nizu lahko uporabiš tudi bajt 10.",
       "Za printf je običajen format za besedilo %s. Če želiš ohraniti začetne ničle vpisne številke, jo shrani kot niz."],
      [["", profile.join("\n")]], 0, "printf, puts"),

    task("odmev", "Preberi in izpiši", "Vhod",
      "S scanf preberi eno predznačeno 32-bitno celo število. Izpiši prebrano vrednost.",
      numberFmt, n, readN + "\n" + show("dword [n]"),
      ["Scanf potrebuje naslov spremenljivke n in naslov formata.",
       "Po klicu preveri EAX. Prebrano število je na naslovu n.",
       "Pri printf uporabi push dword [n]."],
      [["17", "17"], ["0", "0"], ["-42", "-42"], ["2147483647", "2147483647"]], 1),

    task("sestej", "Vsota dveh števil", "Aritmetika",
      "S scanf preberi dve predznačeni celi števili in izpiši njuno vsoto. Vsota testnih števil je predstavljiva z 32 biti.",
      pairFmt, ab, readPair + "\n    mov eax, [a]\n    add eax, [b]\n" + show("eax"),
      ["Format je lahko %d %d in potrebuje dva naslova.",
       "Pri podajanju argumentov potisni najprej naslov b, potem a, nazadnje format.",
       "Izračunaj vsoto v registru in jo kot vrednost predaj funkciji printf."],
      [["3 8", "11"], ["-4 9", "5"], ["-8 -1", "-9"], ["0 0", "0"], ["11 -11", "0"]], 2),

    task("parnost", "Sodo ali liho", "Razvejanje",
      "S scanf preberi celo število. Za sodo število izpiši sodo, za liho pa liho. Upoštevaj tudi negativna števila in nič.",
      '    vhod db "%d", 0\n    sodo db "sodo", 0\n    liho db "liho", 0', n,
      readN + "\n    test dword [n], 1\n    jnz .liho\n" + showString("sodo") +
        "\n    jmp .konec\n.liho:\n" + showString("liho"),
      ["Poglej najnižji bit. Enak je 1 pri lihih številih.",
       "Ukaz test dword [n],1 nastavi ZF glede na bitni AND in ohrani vrednost n.",
       "Pripravi dve oznaki z besedilom in izpiši eno od njiju."],
      [["0", "sodo"], ["9", "liho"], ["-8", "sodo"], ["-3", "liho"]], 1, "printf, scanf, puts"),

    task("vecje", "Večje izmed dveh", "Primerjava",
      "S scanf preberi dve predznačeni celi števili. Izpiši večjo vrednost. Če sta enaki, izpiši to vrednost enkrat.",
      pairFmt, ab, readPair + "\n    mov eax, [a]\n    cmp eax, [b]\n    jge .izpis\n    mov eax, [b]\n.izpis:\n" + show("eax"),
      ["Uporabi cmp za primerjavo operandov.", "JG in JGE primerjata predznačene vrednosti.",
       "Obe poti lahko vodita v skupni odsek za izpis."],
      [["8 4", "8"], ["-9 -3", "-3"], ["3 3", "3"], ["-4 0", "0"], ["5 11", "11"]], 2),

    task("odstevaj", "Odštevanje do ena", "Zanka",
      "S scanf preberi N in izpiši cela števila od N do 1 v padajočem vrstnem redu. Če je N manjši od 1, pusti izpis prazen. Pri testih velja N ≤ 100.",
      numberFmt, n, readN + "\n.zanka:\n    cmp dword [n], 1\n    jl .konec\n" +
        show("dword [n]") + "\n    dec dword [n]\n    jmp .zanka",
      ["Pred prvim izpisom preveri, ali je N pozitiven.",
       "Števec shrani v pomnilnik, da preživi klic printf.",
       "Po vsakem izpisu števec zmanjšaj za 1."],
      [["4", "4 3 2 1"], ["1", "1"], ["0", ""], ["-4", ""], ["6", "6 5 4 3 2 1"]], 1),

    task("n26", "Zaporedje od 1 do N − 26", "Izpitna vaja",
      "S scanf preberi predznačeno 32-bitno celo število N. Izpiši vsa števila od 1 do vključno N − 26. Če je N ≤ 26, je izpis prazen. Posamezna števila loči s presledkom ali novo vrstico. Testi uporabljajo N ≤ 100.",
      numberFmt, n + "\n    meja resd 1\n    i resd 1",
      readN + "\n    mov eax, [n]\n    cmp eax, 26\n    jle .konec\n    sub eax, 26\n    mov [meja], eax" +
        "\n    mov dword [i], 1\n.zanka:\n    mov eax, [i]\n    cmp eax, [meja]\n    jg .konec\n" +
        show("dword [i]") + "\n    inc dword [i]\n    jmp .zanka",
      ["Ročno izračunaj izpis za N = 26, 27 in 29.",
       "Pred odštevanjem izloči N ≤ 26. Tako se izogneš prelivu pri zelo negativnem N.",
       "Števec začne pri 1. Zanko zapusti, ko je števec strogo večji od meje."],
      [30, 26, 27, 24, -2147483648, 32, 38].map(value => [String(value), sequence(value)]), 1),

    task("vsota", "Vsota od 1 do N", "Samostojni izziv",
      "S scanf preberi N. Izpiši seštevek števil od 1 do vključno N. Za N ≤ 0 izpiši 0. Pri testih velja −100 ≤ N ≤ 100.",
      numberFmt, n, readN + "\n    xor eax, eax\n    mov ecx, [n]\n    cmp ecx, 0\n    jle .izpis\n.zanka:" +
        "\n    add eax, ecx\n    dec ecx\n    jnz .zanka\n.izpis:\n" + show("eax"),
      ["Seštevek pred zanko postavi na 0.", "Seštevati smeš tudi od N proti 1.",
       "Pri N = 0 preskoči zanko in vseeno izpiši 0."],
      [["4", "10"], ["1", "1"], ["0", "0"], ["-5", "0"], ["10", "55"], ["100", "5050"]], 1)
  ];

  function identitySolution(values) {
    const fields = values.map(value => {
      const bytes = Array.from(unescape(encodeURIComponent(value)), c => c.charCodeAt(0));
      const plain = bytes.every(byte => byte >= 32 && byte <= 126) && !value.includes('"');
      return plain ? '"' + value + '"' : bytes.join(", ");
    });
    return frame("    vizitka db " + fields.join(", 10, ") + ", 0", "", showString("vizitka"), "printf, puts");
  }

  items[0].solution = identitySolution(profile);
  const sample = frame('    pozdrav db "Pozdrav, procesor!", 0', "", showString("pozdrav"), "puts");
  const normalize = text => text.trim().split(/\s+/u).join(" ");

  function assess(item, source, profileValues, machine) {
    const cases = item.id === "vizitka" ? [["", profileValues.join("\n")]] : item.cases;
    const program = machine.compile(source);
    return cases.map(([input, expected]) => {
      try {
        const run = machine.run(program, input);
        const ok = normalize(run.output) === normalize(expected) && run.exitCode === 0 && run.readCount >= item.reads;
        const error = run.readCount < item.reads ? "Scanf mora uspešno prebrati zahtevane podatke."
          : run.exitCode !== 0 ? "Izhodna koda je " + run.exitCode + "." : "";
        return {input, expected, actual: run.output, ok, error};
      } catch (e) {
        return {input, expected, actual: e.output || "", ok: false, error: e.message};
      }
    });
  }

  return {items, profile, sample, identitySolution, assess};
})();
