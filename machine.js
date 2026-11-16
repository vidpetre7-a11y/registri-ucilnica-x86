const RA86 = (function machine86(){
"use strict";
const base=4096,stack=1<<19,end=1<<20,registers="eax ebx ecx edx esi edi ebp esp".split(" ");
const low={ax:["eax",16,0],bx:["ebx",16,0],cx:["ecx",16,0],dx:["edx",16,0],sp:["esp",16,0],bp:["ebp",16,0],si:["esi",16,0],di:["edi",16,0],al:["eax",8,0],ah:["eax",8,8],bl:["ebx",8,0],bh:["ebx",8,8],cl:["ecx",8,0],ch:["ecx",8,8],dl:["edx",8,0],dh:["edx",8,8]};
const owned=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const width=k=>registers.includes(k)?32:owned(low,k)?low[k][1]:0;
const max=b=>b===32?4294967295:2**b-1, unsigned=(v,b)=>b===32?v>>>0:v&max(b),signed=(v,b)=>b===32?v|0:(v<<(32-b))>>(32-b);
function die(s){throw Error(s);}
function encode(t){return typeof TextEncoder==="function"?Array.from(new TextEncoder().encode(t)):Array.from(unescape(encodeURIComponent(t)),c=>c.charCodeAt(0));}
function decode(b){if(typeof TextDecoder==="function")return new TextDecoder().decode(Uint8Array.from(b));try{return decodeURIComponent(b.map(v=>"%"+v.toString(16).padStart(2,"0")).join(""));}catch{return String.fromCharCode(...b);}}
function split(text,separator,comment=false){let quote="",start=0;const result=[];for(let i=0;i<text.length;i++){const c=text[i];if(quote){if(c===quote)quote="";}else if(c==='"'||c==="'")quote=c;else if(c===separator){result.push(text.slice(start,i).trim());if(comment)return result;start=i+1;}}if(quote)die("Niz nima zaključnega narekovaja.");result.push(text.slice(start).trim());return result;}
function literal(s){if(/^(['"]).\1$/u.test(s))return s.codePointAt(1);if(/^[+-]?(?:0x[0-9a-f]+|0b[01]+|\d+)$/i.test(s))return (s[0]==="-"?-1:1)*Number(s.replace(/^[+-]/,""));if(/^[0-9][\da-f]*h$/i.test(s))return parseInt(s.slice(0,-1),16);if(/^[01]+b$/i.test(s))return parseInt(s.slice(0,-1),2);}
const qualify=(s,parent)=>s.startsWith(".")?parent+s:s;
const arity={mov:[2],lea:[2],movsx:[2],movzx:[2],xchg:[2],add:[2],sub:[2],cmp:[2],test:[2],and:[2],or:[2],xor:[2],shl:[2],sal:[2],shr:[2],sar:[2],inc:[1],dec:[1],neg:[1],not:[1],imul:[1,2,3],mul:[1],div:[1],idiv:[1],cdq:[0],push:[1],pop:[1],call:[1],ret:[0,1],leave:[0],nop:[0],jmp:[1],loop:[1],int:[1]};
const aliases={e:"e",z:"e",ne:"ne",nz:"ne",l:"l",nge:"l",le:"le",ng:"le",g:"g",nle:"g",ge:"ge",nl:"ge",b:"b",c:"b",nae:"b",be:"be",na:"be",a:"a",nbe:"a",ae:"ae",nc:"ae",nb:"ae",s:"s",ns:"ns",o:"o",no:"no"};
const jump=op=>op[0]==="j"&&owned(aliases,op.slice(1))?aliases[op.slice(1)]:null;
function compile(source){
 if(source.length>160000)die("Program je predolg za simulator.");
 const code=[],labels=new Map(),data=new Map(),define=new Map(),bytes=[],globals=new Set();
 let sec="text",parent="",line=0;
 function bind(map,k,v){if([data,labels,define].some(m=>m.has(k)))die("Podvojena oznaka "+k+".");map.set(k,v);}
 function constant(s){const n=literal(s);if(n!==undefined)return n;if(define.has(s))return define.get(s);const m=s.match(/^\$\s*-\s*(\S+)$/);if(m&&data.has(m[1]))return base+bytes.length-data.get(m[1]);die("Neznan podatkovni izraz "+s+".");}
 try{for(const raw of source.split(/\r?\n/)){line++;let s=split(raw,";",true)[0];if(!s)continue;
 let m=s.match(/^\[?bits\s+(\d+)\]?$/i);if(m){if(m[1]!=="32")die("Uporabi bits 32.");continue;}
 m=s.match(/^\[?(?:section|segment)\s+\.?([\w.-]+)/i);if(m){sec=m[1].toLowerCase();continue;}
 m=s.match(/^global\s+(.+)$/i);if(m){split(m[1],",").forEach(x=>globals.add(x));continue;}if(/^extern\s+/i.test(s))continue;
 m=s.match(/^([\w.$]+)\s+equ\s+(.+)$/i);if(m){bind(define,m[1],constant(m[2]));continue;}
 m=s.match(/^([a-z_.$][\w.$]*)\s*:\s*(.*)$/i);if(!m&&sec!=="text")m=s.match(/^([a-z_.$][\w.$]*)\s+((?:d[bwd]|res[bwd])\s+.*)$/i);
 if(m){const k=qualify(m[1],parent);if(!m[1].startsWith("."))parent=m[1];bind(sec==="text"?labels:data,k,sec==="text"?code.length:base+bytes.length);s=m[2];if(!s)continue;}
 if(sec!=="text"){
 m=s.match(/^align\s+(\d+)$/i);if(m){const n=+m[1];if(n<1||n>256)die("Nepodprta poravnava.");while((base+bytes.length)%n)bytes.push(0);continue;}
 m=s.match(/^(d[bwd]|res[bwd])\s+(.+)$/i);if(!m)die("Pričakujem db, dw, dd, resb, resw ali resd.");const cmd=m[1].toLowerCase(),size={b:1,w:2,d:4}[cmd.at(-1)];
 if(cmd.startsWith("res")){const n=constant(m[2]);if(!Number.isSafeInteger(n)||n<0||base+bytes.length+n*size>=stack)die("Prevelika rezervacija.");for(let i=0;i<n*size;i++)bytes.push(0);}
 else for(const t of split(m[2],",")){if(size===1&&/^(['"])(.*)\1$/s.test(t)){for(const b of encode(t.slice(1,-1)))bytes.push(b);}else{const n=constant(t);for(let i=0;i<size;i++)bytes.push(n>>>(i*8)&255);}}
 if(base+bytes.length>=stack)die("Podatkovni del je prevelik.");continue;}
 m=s.match(/^([a-z]+)(?:\s+(.*))?$/i);if(!m)die("Uporabi sintakso NASM brez makrov.");const op=m[1].toLowerCase(),args=m[2]?split(m[2],","):[],allowed=owned(arity,op)?arity[op]:jump(op)?[1]:null;
 if(!allowed)die("Učni simulator ne podpira ukaza "+op+".");if(!allowed.includes(args.length))die("Preveri število operandov ukaza "+op+".");code.push({op,args,line,parent});
 }}catch(e){die("Vrstica "+line+" · "+e.message);}
 const entry=globals.has("_start")&&labels.has("_start")?"_start":labels.has("main")?"main":labels.has("_start")?"_start":null;if(!entry)die("Dodaj vstopno oznako main: ali _start:.");return {code,labels,data,define,bytes,entry};
}
function run(source,input=""){
 const p=typeof source==="string"?compile(source):source,memory=new Uint8Array(end),view=new DataView(memory.buffer);memory.set(p.bytes,base);
 const r=Object.fromEntries(registers.map(k=>[k,0]));r.esp=end-16;const f={z:false,s:false,c:false,o:false};
 let pc=p.labels.get(p.entry),parent="",line=0,steps=0,pos=0,output="",done=false,exitCode=0,readCount=0;
 function check(a,n){a>>>=0;if(!((a>=base&&a+n<=base+p.bytes.length)||(a>=stack&&a+n<=end)))die("Neveljaven naslov 0x"+a.toString(16)+". Preveri oklepaje in argumente na skladu.");return a;}
 function read(a,b){a=check(a,b/8);return b===8?memory[a]:b===16?view.getUint16(a,true):view.getUint32(a,true);}
 function write(a,b,v){a=check(a,b/8);if(b===8)memory[a]=v;else if(b===16)view.setUint16(a,v,true);else view.setUint32(a,v,true);}
 function get(k){if(registers.includes(k))return r[k]>>>0;const [reg,b,shift]=low[k];return (r[reg]>>>shift)&max(b);}
 function set(k,v){if(registers.includes(k)){r[k]=v>>>0;return;}const [reg,b,shift]=low[k],mask=max(b)<<shift;r[reg]=((r[reg]&~mask)|((v<<shift)&mask))>>>0;}
 function push(v){r.esp=(r.esp-4)>>>0;write(r.esp,32,v);}function pop(){const v=read(r.esp,32);r.esp=(r.esp+4)>>>0;return v;}
 if(p.entry==="main")push(0xffffffff);
 function atom(s){s=s.trim();const k=s.toLowerCase(),n=literal(s);if(width(k))return get(k);if(n!==undefined)return n;const q=qualify(s,parent);if(p.data.has(q))return p.data.get(q);if(p.define.has(q))return p.define.get(q);die("Neznan operand »"+s+"«.");}
 function expr(s){s=s.trim();if(literal(s)!==undefined)return atom(s);const e=s.replace(/\s/g,""),elements=e.match(/[+-]?[^+-]+/g);if(!elements||elements.join("")!==e)die("Neveljaven izraz "+s+".");return elements.reduce((sum,t)=>{const n=t[0]==="-"?-1:1,terms=t.replace(/^[+-]/,"").split("*");if(terms.length>2)die("Neveljavno merilo.");return sum+n*terms.reduce((v,k)=>v*atom(k),1);},0);}
 function operand(t){const m=t.match(/^(byte|word|dword)\s+(?:ptr\s+)?/i),b=m?{byte:8,word:16,dword:32}[m[1].toLowerCase()]:0;if(m)t=t.slice(m[0].length).trim();const k=t.toLowerCase();if(width(k))return {type:"reg",k,b:width(k)};if(t.startsWith("[")&&t.endsWith("]"))return {type:"mem",a:expr(t.slice(1,-1))>>>0,b};return {type:"imm",v:expr(t),b};}
 const val=(o,b)=>o.type==="reg"?get(o.k):o.type==="mem"?read(o.a,o.b||b):o.v;
 function put(o,b,v){if(o.type==="reg")set(o.k,v);else if(o.type==="mem")write(o.a,o.b||b,v);else die("Cilj mora biti register ali pomnilnik.");}
 function go(n){const k=qualify(n.replace(/^(?:short|near)\s+/i,""),parent);if(!p.labels.has(k))die("Neznana oznaka »"+n+"«.");pc=p.labels.get(k);}
 function flags(v,b){f.z=unsigned(v,b)===0;f.s=signed(v,b)<0;}
 function arith(x,y,b,sub){x=unsigned(x,b);y=unsigned(y,b);const z=sub?x-y:x+y,result=unsigned(z,b);f.c=sub?x<y:z>max(b);f.o=Boolean((sub?(x^y)&(x^result):~(x^y)&(x^result))&(2**(b-1)));flags(result,b);return result;}
 const take=k=>({e:f.z,ne:!f.z,l:f.s!==f.o,le:f.z||f.s!==f.o,g:!f.z&&f.s===f.o,ge:f.s===f.o,b:f.c,be:f.c||f.z,a:!f.c&&!f.z,ae:!f.c,s:f.s,ns:!f.s,o:f.o,no:!f.o})[k];
 function cstr(a){const bytes=[];for(let j=0;j<=65536;j++){const v=read(a+j,8);if(!v)return decode(bytes);bytes.push(v);}die("Predolg niz ali manjkajoča zaključna ničla.");}
 function emit(s){if(output.length+s.length>65536)die("Izpis je predolg. Preveri zanko.");output+=s;}
 const arg=n=>read(r.esp+4*n,32);
 function printf(){const fmt=cstr(arg(0));let txt="",j=1;for(let i=0;i<fmt.length;i++){if(fmt[i]!=="%"){txt+=fmt[i];continue;}const m=fmt.slice(i).match(/^%(0)?(\d{1,3})?([diuxXcs%])/);if(!m)die("Nepodprt format printf.");i+=m[0].length-1;const t=m[3];if(t==="%"){txt+="%";continue;}const v=arg(j++);let part=t==="s"?cstr(v):t==="c"?String.fromCharCode(v&255):t==="d"||t==="i"?String(v|0):t.toLowerCase()==="x"?v.toString(16):String(v);if(t==="X")part=part.toUpperCase();const w=Number(m[2]||0);if(w>part.length)part=part[0]==="-"&&m[1]?"-"+part.slice(1).padStart(w-1,"0"):part.padStart(w,m[1]?"0":" ");txt+=part;}emit(txt);return encode(txt).length;}
 function scanf(){const fmt=cstr(arg(0));let setCount=0,j=1;for(let i=0;i<fmt.length;i++){const c=fmt[i];if(/\s/.test(c)){while(pos<input.length&&/\s/.test(input[pos]))pos++;continue;}if(c!=="%"||fmt[i+1]==="%"){if(c==="%")i++;if(input[pos]!==c)break;pos++;continue;}const m=fmt.slice(i).match(/^%(\d{1,3})?([diuxcs])/);if(!m)die("Nepodprt format scanf.");i+=m[0].length-1;const t=m[2];if(t!=="c")while(pos<input.length&&/\s/.test(input[pos]))pos++;
 if(pos>=input.length)return setCount||-1;const tail=input.slice(pos,m[1]?pos+Number(m[1]):undefined);
 const re=t==="s"?/^\S+/:t==="c"?/^[\s\S]/u:t==="x"?/^[+-]?(?:0x)?[\da-f]+/i:t==="i"?/^[+-]?(?:0x[\da-f]+|0[0-7]*|[1-9]\d*)/i:/^[+-]?\d+/;const token=tail.match(re);if(!token)break;const h=token[0];pos+=h.length;const dst=arg(j++);if(t==="s"||t==="c"){const b=encode(h);b.forEach((v,n)=>write(dst+n,8,v));if(t==="s")write(dst+b.length,8,0);}else{const radix=t==="x"||/^[+-]?0x/i.test(h)?16:t==="i"&&/^[+-]?0[0-7]/.test(h)?8:10;write(dst,32,parseInt(h,radix));}setCount++;readCount++;}return setCount;}
 function library(n){let v;if(n==="printf")v=printf();else if(n==="scanf"||n==="__isoc99_scanf")v=scanf();else if(n==="puts"){emit(cstr(arg(0))+"\n");v=1;}else if(n==="putchar"){v=arg(0)&255;emit(String.fromCharCode(v));}else if(n==="exit"){exitCode=arg(0)|0;done=true;return true;}else return false;r.eax=v>>>0;r.ecx=0;r.edx=0;return true;}
 function sys(){if(r.eax===1){exitCode=r.ebx|0;done=true;}else if(r.eax===4&&(r.ebx===1||r.ebx===2)){const n=r.edx;if(n>65536)die("Izpis je predolg.");if(n)check(r.ecx,n);emit(decode(Array.from(memory.slice(r.ecx,r.ecx+n))));r.eax=n;}else if(r.eax===3&&r.ebx===0){const b=encode(input.slice(pos)),n=Math.min(r.edx,b.length);if(n)check(r.ecx,n);memory.set(b.slice(0,n),r.ecx);pos+=decode(b.slice(0,n)).length;r.eax=n;}else die("Podprti so sistemski klici exit (1), read (3) in write (4).");}
 try{while(!done){if(++steps>160000)die("Meja 160.000 ukazov. Preveri izstopni pogoj zanke.");const ins=p.code[pc++];if(!ins)die("Izvajanje je zapustilo program. Dodaj ret ali sys_exit.");const {op,args}=ins;parent=ins.parent;line=ins.line;const cond=jump(op);
 if(cond){if(take(cond))go(args[0]);continue;}if(op==="jmp"){go(args[0]);continue;}if(op==="loop"){r.ecx=(r.ecx-1)>>>0;if(r.ecx)go(args[0]);continue;}
 if(op==="call"){if(!library(args[0])){push(pc);go(args[0]);}continue;}if(op==="ret"){const target=pop();if(args.length)r.esp=(r.esp+expr(args[0]))>>>0;if(target===0xffffffff){exitCode=r.eax|0;done=true;}else pc=target;continue;}
 if(op==="leave"){r.esp=r.ebp;r.ebp=pop();continue;}if(op==="nop")continue;if(op==="cdq"){r.edx=(r.eax|0)<0?4294967295:0;continue;}if(op==="int"){if(expr(args[0])!==128)die("Podprt je int 0x80.");sys();continue;}
 const a=operand(args[0]),b=args.length>1?operand(args[1]):null;
 if(op==="push"){if(a.b&&a.b!==32)die("PUSH v simulatorju podpira dword.");push(val(a,32));continue;}if(op==="pop"){put(a,32,pop());continue;}
 if(a.type==="mem"&&b?.type==="mem")die("Oba operanda ne moreta biti v pomnilniku.");
 const bits=a.b||b?.b;if(!bits)die("Določi velikost operanda, npr. dword [n].");
 if(b&&a.b&&b.b&&a.b!==b.b&&!["movsx","movzx","lea","shl","sal","sar","shr"].includes(op))die("Operanda imata različno širino.");
 if(op==="lea"){if(a.type!=="reg"||b.type!=="mem")die("LEA potrebuje naslov v oglatih oklepajih.");put(a,bits,b.a);continue;}if(op==="mov"){put(a,bits,val(b,bits));continue;}
 if(op==="movsx"||op==="movzx"){if(!b.b||b.b>=bits)die("Izvorni operand mora biti ožji.");const v=val(b,b.b);put(a,bits,op==="movsx"?signed(v,b.b):unsigned(v,b.b));continue;}
 const x=unsigned(val(a,bits),bits),y=b?unsigned(val(b,bits),bits):0;let z;
 switch(op){
 case "add":case "sub":case "cmp":z=arith(x,y,bits,op!=="add");if(op==="cmp")continue;break;
 case "inc":case "dec":{const cf=f.c;z=arith(x,1,bits,op==="dec");f.c=cf;break;}
 case "neg":z=arith(0,x,bits,true);break;case "not":z=~x;break;
 case "and":case "or":case "xor":case "test":z=op==="and"||op==="test"?x&y:op==="or"?x|y:x^y;flags(z,bits);f.c=false;f.o=false;if(op==="test")continue;break;
 case "xchg":put(b,bits,x);z=y;break;
 case "shl":case "sal":case "shr":case "sar":{const n=y&31;if(!n)continue;const left=op==="shl"||op==="sal";z=left?x<<n:op==="sar"?signed(x,bits)>>n:x>>>n;f.c=Boolean(left?(n<=bits&&(x>>>(bits-n))&1):(x>>>(n-1))&1);if(n===1)f.o=left?(signed(z,bits)<0)!==f.c:op==="shr"&&signed(x,bits)<0;flags(z,bits);break;}
 case "mul":case "imul":{if(args.length===1){if(bits!==32)die("Enooperandno množenje podpira dword.");const sign=op==="imul",n=BigInt(sign?r.eax|0:r.eax)*BigInt(sign?x|0:x);r.eax=Number(BigInt.asUintN(32,n));r.edx=Number(BigInt.asUintN(32,n>>32n));f.c=f.o=sign?n!==BigInt.asIntN(32,n):r.edx!==0;continue;}const left=args.length===3?y:x,right=args.length===3?val(operand(args[2]),bits):y,n=BigInt(signed(left,bits))*BigInt(signed(right,bits));z=Number(BigInt.asUintN(bits,n));f.c=f.o=n!==BigInt.asIntN(bits,n);break;}
 case "div":case "idiv":{if(bits!==32)die("Deljenje podpira dword.");if(!x)die("Deljenje z nič.");const sign=op==="idiv",pair=(BigInt(r.edx)<<32n)|BigInt(r.eax),num=sign?BigInt.asIntN(64,pair):pair,den=BigInt(sign?x|0:x),q=num/den;if((sign?BigInt.asIntN(32,q):BigInt.asUintN(32,q))!==q)die("Količnik presega 32 bitov.");r.eax=Number(BigInt.asUintN(32,q));r.edx=Number(BigInt.asUintN(32,num%den));continue;}
 default:die("Nepodprt ukaz "+op+".");}put(a,bits,z);
 }}catch(e){const err=Error("Vrstica "+line+" · "+e.message);err.output=output;throw err;}return {output,exitCode,steps,readCount,registers:{...r}};
}return {compile,run};
})();
