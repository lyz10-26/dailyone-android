(function(g){
'use strict';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const words={
 python:'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case type',
 java:'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record sealed permits non-sealed',
 cpp:'alignas alignof and asm auto bool break case catch char class concept const consteval constexpr constinit continue co_await co_return co_yield decltype default delete do double else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not nullptr operator or private protected public register reinterpret_cast requires return short signed sizeof static static_cast struct switch template this thread_local throw true try typedef typename union unsigned using virtual void volatile wchar_t while',
 js:'as async await break case catch class const continue debugger default delete do else export extends finally for from function get if import in instanceof let new of return set static super switch this throw try typeof var void while with yield implements interface private protected public enum type declare readonly keyof infer never unknown any number string boolean',
 sql:'select from where join left right inner outer full on group by order having asc desc limit offset insert into values update set delete create table index primary key foreign references constraint distinct union all null is not and or in exists between like case when then else end count sum min max avg as with recursive over partition row_number rank dense_rank int varchar bigint double default alter drop true false',
 go:'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var',
 rust:'as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while',
 generic:'class def function func fn return public private protected static void int long double float bool boolean string char const let var val final if else for while do break continue try catch finally throw throws new null true false import from package using namespace struct enum interface extends implements async await yield with switch case default print'
};
const builtins=new Set(('print len range enumerate zip map filter sorted reversed sum max min abs all any list dict set tuple str int float bool object super self cls None True False System String Integer Long Double Boolean List ArrayList Map HashMap Set HashSet Math Arrays Collections Optional vector string unordered_map unordered_set pair queue stack priority_queue cout cin std size_t printf scanf Console console log Number Array Object Promise JSON Date Error NaN Infinity undefined nil Some Ok Err Vec Option Result println make append cap delete int64 uint64 ReadonlyArray').split(' '));
function family(lang){if(/^python/.test(lang))return 'python';if(['java','kotlin','scala'].includes(lang))return 'java';if(['cpp','c','csharp'].includes(lang))return 'cpp';if(['javascript','typescript','javascript-es6'].includes(lang))return 'js';if(['mysql','mssql','oraclesql','postgresql','sql'].includes(lang))return 'sql';if(lang==='golang')return 'go';if(lang==='rust')return 'rust';return 'generic';}
function highlight(src,lang){
 src=String(src);if(src.length>200000)return escape(src);
 const f=family(lang),keywords=new Set((words[f]||words.generic).split(' '));let out='',i=0;
 const wrap=(t,s)=>'<span class="tok-'+t+'">'+escape(s)+'</span>';
 while(i<src.length){let start=i,c=src[i],n=src[i+1];
 if((c==='/'&&n==='/'&&f!=='python'&&f!=='sql')||(c==='#'&&['python','generic'].includes(f))||(c==='-'&&n==='-'&&f==='sql')){while(i<src.length&&src[i]!=='\n')i++;out+=wrap('comment',src.slice(start,i));continue;}
 if(c==='/'&&n==='*'&&f!=='python'){let end=src.indexOf('*/',i+2);i=end<0?src.length:end+2;out+=wrap('comment',src.slice(start,i));continue;}
 if(c==='"'||c==="'"||c==='`'){const quote=c,triple=f==='python'&&src.slice(i,i+3)===c.repeat(3),mark=triple?c.repeat(3):c;i+=mark.length;while(i<src.length){if(src[i]==='\\'){i=Math.min(i+2,src.length);continue;}if(src.slice(i,i+mark.length)===mark){i+=mark.length;break;}if(src[i]==='\n'&&!triple&&quote!=='`')break;i++;}out+=wrap('string',src.slice(start,i));continue;}
 if(/[A-Za-z_$]/.test(c)){i++;while(i<src.length&&/[A-Za-z0-9_$]/.test(src[i]))i++;const w=src.slice(start,i),key=f==='sql'?w.toLowerCase():w;let j=i;while(j<src.length&&/\s/.test(src[j]))j++;const kind=keywords.has(key)?'keyword':builtins.has(w)?'builtin':/^(None|True|False|null|true|false|nil|undefined)$/.test(w)?'literal':src[j]==='('?'function':/^[A-Z]/.test(w)?'type':null;out+=kind?wrap(kind,w):escape(w);continue;}
 if(/\d/.test(c)&&(!i||!/[\w$]/.test(src[i-1]))){const m=src.slice(i).match(/^(?:0[xX][\da-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)[uUlLfF]*/);if(m){i+=m[0].length;out+=wrap('number',m[0]);continue;}}
 if(/[+\-*\/=<>!&|%^~?:]/.test(c)){out+=wrap('operator',c);i++;continue;}
 out+=escape(c);i++;
 }
 return out;
}
function markdown(html){const td=new g.TurndownService({headingStyle:'atx',codeBlockStyle:'fenced',bulletListMarker:'-'});if(g.turndownPluginGfm)td.use(g.turndownPluginGfm.gfm);td.keep(['sub','sup']);td.addRule('inlineCodeScripts',{filter:n=>['SUB','SUP'].includes(n.nodeName)&&!!n.closest('code'),replacement:(c,n)=>(n.nodeName==='SUB'?'_':'^')+c});td.addRule('math',{filter:n=>n.nodeName==='SPAN'&&n.getAttribute('class')?.includes('math'),replacement:(c,n)=>n.textContent});return td.turndown(html||'');}
function render(md){return g.marked.parse(md,{gfm:true,breaks:false});}
const api={escape,highlight,markdown,render,family};g.DailyCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
