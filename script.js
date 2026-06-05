'use strict';
const STORAGE_KEY = 'best-team-data-v2';
const $ = (id) => document.getElementById(id);
const defaultMembers = [
  {id: makeId(), name:'ملك', role:'Marketing Reddit', prompt:"You're on reddit and want to post a topic about: (( ############################## )) - Talk like a mainstream woman with simplified and casual writing style. - Use slang language and don't be formal formatting your text. - Don't use lists, and sound like a story teller. - Make it quick an easy read piece of writing.", plan:'--r/BeautyGear--\nالمطلوب يومياً لكل حساب:\n* 4 بوستات\n* 4 كومنتات على بوستات عشوائية (بوستات وفيديوهات)\n* لايك واحد فقط\n----------------------\nفيه كمان شغل إضافي:\nملف متقسم علينا 200 كلمة.\nكل واحد يشتغل مرتين أسبوعياً.\nكل مرة نعمل 4 بوستات جديدة والباقي يعملوا عليها كومنتات، وصاحب البوست يرد على التعليقات.', accounts:4},
  {id: makeId(), name:'إسراء', role:'Marketing Reddit', prompt:"You're on reddit and want to post a topic about: (( ############################## )) - Talk like a mainstream woman with simplified and casual writing style. - Use slang language and don't be formal formatting your text. - Don't use lists, and sound like a story teller. - Make it quick an easy read piece of writing. ------------------------------ rewrite and improve this title for a reddit post: ( rewrite and improve this title for a reddit post: )", plan:'--r/BeautyGear--\nالمطلوب يومياً لكل حساب:\n* 4 بوستات\n* 4 كومنتات على بوستات عشوائية (بوستات وفيديوهات)\n* لايك واحد فقط\n----------------------\nفيه كمان شغل إضافي:\nملف متقسم علينا 200 كلمة.\nكل واحد يشتغل مرتين أسبوعياً.\nكل مرة نعمل 4 بوستات جديدة والباقي يعملوا عليها كومنتات، وصاحب البوست يرد على التعليقات.\n----------------------\n--r/BedroomBuild--\nالمطلوب يومياً لكل حساب:\n* 2 بوستات\n* 4 كومنتات على بوستات عشوائية (بوستات وفيديوهات)', accounts:5},
  {id: makeId(), name:'بسمة', role:'Marketing Reddit', prompt:'none', plan:'--r/BeautyGear--\nالمطلوب يومياً لكل حساب:\n* 4 بوستات\n* 4 كومنتات على بوستات عشوائية (بوستات وفيديوهات)\n* لايك واحد فقط\n----------------------\nفيه كمان شغل إضافي:\nملف متقسم علينا 200 كلمة.\nكل واحد يشتغل مرتين أسبوعياً.\nكل مرة نعمل 4 بوستات جديدة والباقي يعملوا عليها كومنتات، وصاحب البوست يرد على التعليقات.', accounts:4}
];
let members = loadMembers();
let currentSearch = '';
const els = {
  cards:$('cards'), modal:$('memberModal'), form:$('memberForm'), memberId:$('memberId'), name:$('name'), role:$('role'), prompt:$('prompt'), plan:$('plan'), accounts:$('accounts'),
  avatar:$('modalAvatar'), title:$('modalTitle'), search:$('searchInput'), membersCount:$('membersCount'), totalAccounts:$('totalAccounts'), activeProjects:$('activeProjects'), avgAccounts:$('avgAccounts')
};
function makeId(){ return (crypto && crypto.randomUUID) ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function clone(x){ return JSON.parse(JSON.stringify(x)); }
function loadMembers(){
  try{
    const oldData = localStorage.getItem('best-team-data-v1');
    const data = localStorage.getItem(STORAGE_KEY) || oldData;
    const parsed = data ? JSON.parse(data) : clone(defaultMembers);
    return Array.isArray(parsed) ? parsed.map(normalizeMember) : clone(defaultMembers);
  }catch{ return clone(defaultMembers); }
}
function normalizeMember(m){ return {id:m.id || makeId(), name:m.name || '', role:m.role || '', prompt:m.prompt || '', plan:m.plan || '', accounts:Number(m.accounts || 0)}; }
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(members)); render(); }
function firstLetter(name){ return (String(name || '؟').trim()[0] || '؟'); }
function escapeHtml(text=''){ return String(text).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function projectCount(){ const list = members.flatMap(m => (m.plan || '').match(/r\/[A-Za-z0-9_]+/g) || []); return new Set(list).size; }
function filteredMembers(){
  const q = currentSearch.trim().toLowerCase();
  if(!q) return members;
  return members.filter(m => `${m.name} ${m.role} ${m.prompt} ${m.plan}`.toLowerCase().includes(q));
}
function render(){
  els.membersCount.textContent = members.length;
  const totalActiveAccounts = members.reduce((sum,m)=>sum + Number(m.accounts || 0),0);
  els.totalAccounts.textContent = totalActiveAccounts;
  els.avgAccounts.textContent = members.length ? (totalActiveAccounts / members.length).toFixed(1).replace('.0','') : 0;
  els.activeProjects.textContent = projectCount();
  const data = filteredMembers();
  els.cards.innerHTML = data.length ? '' : '<div class="empty">لا توجد نتائج مطابقة للبحث</div>';
  data.forEach(m => {
    const card = document.createElement('article');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="card-head">
        <div class="avatar">${escapeHtml(firstLetter(m.name))}</div>
        <div class="info"><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.role)}</p></div>
        <span class="accounts-count"><b>${escapeHtml(m.accounts)}</b> حسابات نشطة</span>
      </div>
      <div class="section"><div class="section-title"><span>Prompt الخاص</span><button class="copy" data-copy="prompt">نسخ</button></div><div class="text-box">${escapeHtml(m.prompt || 'لا يوجد')}</div></div>
      <div class="section"><div class="section-title"><span>خطة العمل</span><button class="copy" data-copy="plan">نسخ</button></div><div class="text-box">${escapeHtml(m.plan || 'لا يوجد')}</div></div>
      <div class="card-actions"><button class="btn primary" data-action="edit">تعديل</button><button class="btn soft" data-action="view">عرض الملف</button><button class="btn delete" data-action="delete">حذف العضو</button></div>`;
    card.querySelector('[data-action="edit"]').addEventListener('click',()=>openEdit(m.id));
    card.querySelector('[data-action="view"]').addEventListener('click',()=>openEdit(m.id));
    card.querySelector('[data-action="delete"]').addEventListener('click',()=>deleteMember(m.id));
    card.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click',()=>copyText(m[btn.dataset.copy] || '')));
    els.cards.appendChild(card);
  });
}
function fillForm(m={id:'',name:'',role:'Marketing Reddit',prompt:'',plan:'',accounts:0}){
  els.memberId.value = m.id; els.name.value = m.name; els.role.value = m.role; els.prompt.value = m.prompt; els.plan.value = m.plan; els.accounts.value = m.accounts;
  els.avatar.textContent = firstLetter(m.name); els.title.textContent = m.id ? 'تعديل بيانات العضو' : 'إضافة عضو جديد';
}
function openEdit(id){ const m = members.find(x=>x.id===id); if(!m) return; fillForm(m); els.modal.showModal(); }
function deleteMember(id){ if(confirm('هل تريد حذف هذا العضو؟')){ members = members.filter(m=>m.id!==id); persist(); } }
async function copyText(text){ try{ await navigator.clipboard.writeText(text); alert('تم النسخ'); }catch{ alert('لم يتم النسخ، انسخ النص يدوياً.'); } }
$('addMemberBtn').addEventListener('click',()=>{ fillForm(); els.modal.showModal(); });
$('closeModal').addEventListener('click',()=>els.modal.close());
$('cancelBtn').addEventListener('click',()=>els.modal.close());
els.name.addEventListener('input',()=>{ els.avatar.textContent = firstLetter(els.name.value); });
els.search.addEventListener('input',(e)=>{ currentSearch = e.target.value; render(); });
els.form.addEventListener('submit',(e)=>{
  e.preventDefault();
  const data = normalizeMember({id:els.memberId.value || makeId(), name:els.name.value.trim(), role:els.role.value.trim(), prompt:els.prompt.value.trim(), plan:els.plan.value.trim(), accounts:els.accounts.value});
  const index = members.findIndex(m=>m.id===data.id);
  if(index >= 0) members[index] = data; else members.push(data);
  persist(); els.modal.close();
});
$('resetBtn').addEventListener('click',()=>{ if(confirm('سيتم حذف البيانات الحالية والرجوع للبيانات الأساسية.')){ members = clone(defaultMembers); persist(); }});
$('exportBtn').addEventListener('click',()=>{
  const blob = new Blob([JSON.stringify(members,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'best-team-data.json'; a.click(); URL.revokeObjectURL(url);
});
$('importFile').addEventListener('change',async(e)=>{
  const file = e.target.files[0]; if(!file) return;
  try{ const data = JSON.parse(await file.text()); if(!Array.isArray(data)) throw new Error('bad'); members = data.map(normalizeMember); persist(); alert('تم استيراد البيانات بنجاح'); }
  catch{ alert('ملف غير صالح. يجب أن يكون JSON صادر من الموقع.'); }
  e.target.value = '';
});
render();
