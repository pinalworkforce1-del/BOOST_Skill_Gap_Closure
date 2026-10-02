(()=>{
'use strict';
if(window.__BOOST_M5_LIVE_FLOW__)return;window.__BOOST_M5_LIVE_FLOW__=true;
const KEY='pinal_boost_career_exploration_v1',JOURNEY='pinal_boost_journey_v1';
const $=id=>document.getElementById(id);
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function currentWage(s){
 const m2=s?.module2||{},j=read(JOURNEY)||{},jm2=j?.modules?.module2||{};
 for(const v of [m2.currentHourlyWage,m2.wageBaseline?.hourly,jm2.currentHourlyWage,jm2.wageBaseline?.hourly,j?.participant?.currentHourlyWage]){
  const n=Number(v);if(Number.isFinite(n)&&n>0)return n;
 }return 0;
}
function evidence(){
 const s=read(KEY)||{},m4=s.module4||{},m2=s.module2||{},soc=m4.selectedSoc||m4.career?.soc||m4.careerTarget?.soc||'',row=m2.validationBySoc?.[soc]||{},qi=m4.preparationIntel||row.preparationIntel||{};
 return{s,m4,m2,row,qi,soc,career:m4.careerTitle||m4.career?.title||m4.careerTarget?.title||'',route:m4.route||'',preparation:m4.preparationReadiness||row.prep||qi.label||'Preparation gap identified',education:qi.baseline?.education||m4.typicalEducation||'Varies by occupation/employer',employerSupport:m4.employerSupportedRoute||m4.employerSupport||row.employerSupport||'No employer-supported route verified',regional:row.jobs||m4.regionalOpportunity||'Regional evidence carried forward',wage:currentWage(s)};
}
function style(){
 if($('boostLiveM5Style'))return;
 const st=document.createElement('style');st.id='boostLiveM5Style';st.textContent=`
 .boostCarry{margin:14px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
 .boostCarryCard{padding:12px;border:1px solid #d6e0e6;border-radius:12px;background:#f7fafc}
 .boostCarryCard small{display:block;color:#607788;font-weight:800;margin-bottom:4px}
 .boostGapBox{margin-top:14px;padding:14px;border:1px solid #c9dce5;border-left:5px solid #008f8c;border-radius:12px;background:#f7fbfc}
 .boostGapBox label{display:block;font-weight:850;margin:10px 0 5px}
 .boostGapBox select,.boostGapBox textarea{width:100%;border:1px solid #bdccd5;border-radius:10px;padding:10px;font:inherit;background:#fff}
 .boostGapBox textarea{min-height:78px;resize:vertical}
 .boostLiveSave{background:#173f61!important;color:#fff!important}
 .boostROINote{margin-top:12px;padding:12px;border-radius:12px;background:#eef7f6;border:1px solid #b9dedb}
 .boostM5ResetRow{display:flex;justify-content:flex-end;margin:10px 0 2px}
 .boostM5Reset{border:1px solid #b9c8d1;border-radius:999px;background:#fff;color:#17324d;padding:9px 13px;font:850 13px/1 system-ui;cursor:pointer}
 .boostM5Reset:hover{background:#f4f8fa}
 .boostM5ResetNote{margin-top:8px;color:#667c89;font-size:12px;line-height:1.4}
 `;document.head.appendChild(st);
}
function sameCareer(saved,ev){
 const a=String(saved?.selectedSoc||'').replace(/[^0-9-]/g,''),b=String(ev?.soc||'').replace(/[^0-9-]/g,'');
 if(a&&b)return a===b;
 const at=String(saved?.careerTitle||'').trim().toLowerCase(),bt=String(ev?.career||'').trim().toLowerCase();
 return !!at&&!!bt&&at===bt;
}
function archiveActiveModule5(reason,ev){
 const s=read(KEY)||{},j=read(JOURNEY)||{},active=s.module5||j?.modules?.module5||null;
 if(active&&Object.keys(active).length){
   const entry=Object.assign({},active,{archivedAt:new Date().toISOString(),archiveReason:reason||'reset',replacedBySoc:ev?.soc||'',replacedByCareer:ev?.career||''});
   s.module5History=Array.isArray(s.module5History)?s.module5History:[];
   s.module5History.push(entry);
   if(s.module5History.length>8)s.module5History=s.module5History.slice(-8);
   j.module5History=Array.isArray(j.module5History)?j.module5History:[];
   j.module5History.push(entry);
   if(j.module5History.length>8)j.module5History=j.module5History.slice(-8);
 }
 delete s.module5;s.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(s));
 j.modules=j.modules||{};delete j.modules.module5;
 j.progress=j.progress||{};j.progress.module5='stale';
 j.staleModules=j.staleModules||{};j.staleModules.module5={reason:reason==='career_changed'?'Career direction changed. Rebuild Career Investment for the current occupation.':'Career Investment was cleared and must be rebuilt.',markedAt:new Date().toISOString()};
 j.portal=j.portal||{};if(Array.isArray(j.portal.completed))j.portal.completed=j.portal.completed.filter(id=>id!=='module5');
 if(j.portal.mapState?.complete)delete j.portal.mapState.complete['m:module5'];
 j.updated_at=new Date().toISOString();localStorage.setItem(JOURNEY,JSON.stringify(j));
 try{const done=new Set(JSON.parse(localStorage.getItem('boostPortalCompleted_v2')||'[]'));done.delete('module5');localStorage.setItem('boostPortalCompleted_v2',JSON.stringify([...done]))}catch(_){}
 try{const ms=JSON.parse(localStorage.getItem('boostPathwaysV29')||'{}');ms.complete=ms.complete||{};delete ms.complete['m:module5'];localStorage.setItem('boostPathwaysV29',JSON.stringify(ms))}catch(_){}
 try{if(typeof compareIds!=='undefined')compareIds.clear()}catch(_){}
}
function resetIfCareerChanged(ev){
 const saved=ev?.s?.module5||read(JOURNEY)?.modules?.module5||null;
 if(saved?.evaluatedAt&&!sameCareer(saved,ev)){archiveActiveModule5('career_changed',ev);ev.s=read(KEY)||{};return true}
 return false;
}
function gapText(ev){return ev.qi?.baseline?.education||ev.qi?.label||ev.preparation||''}
function findOccupation(ev){
 if(typeof H3==='undefined'||!Array.isArray(H3))return null;
 return H3.find(o=>String(o.soc||'')===String(ev.soc||''))||
        H3.find(o=>String(o.title||'').toLowerCase()===String(ev.career||'').toLowerCase())||
        (typeof searchOccupations==='function'?searchOccupations(ev.career||'')[0]:null);
}
function moneyNumber(v){
 if(v==null||v==='')return null;
 const n=Number(String(v).replace(/[$,\s]/g,''));
 return Number.isFinite(n)&&n>=0?n:null;
}
function normalizeProgramCosts(){
 if(typeof PROGRAMS==='undefined'||!Array.isArray(PROGRAMS))return;
 PROGRAMS.forEach(p=>{
  if(!p||typeof p!=='object')return;
  const authoritative=[
   ['AJC Total In-State Program Cost',p.totalInStateProgramCost],
   ['AJC Total In-State Program Cost',p.total_in_state_program_cost],
   ['AJC Total Program Cost',p.totalProgramCost],
   ['AJC Total Program Cost',p.total_program_cost],
   ['Total Program Cost',p.programTotalCost],
   ['Total Program Cost',p.program_total_cost]
  ].map(([source,value])=>[source,moneyNumber(value)]).find(([,value])=>value!=null);
  if(authoritative){
   const [source,total]=authoritative,old=moneyNumber(p.cost);
   if(old!==total){
    p.costOriginal=old;
    p.cost=total;
    p.costCorrectionReason='Authoritative total program cost takes precedence over component costs.';
   }
   p.costSource=source;
   p.costVerifiedAt=p.costVerifiedAt||'2026-10-02';
   return;
  }
  const tuition=moneyNumber(p.tuition),listed=moneyNumber(p.cost);
  if(String(p.id||'')==='23244'&&listed===2160&&tuition===1080){
   p.costOriginal=2160;
   p.cost=1080;
   p.costSource='AJC Total In-State Program Cost';
   p.costCorrectionReason='Verified parser double-count: tuition was added to the authoritative total program cost.';
   p.costVerifiedAt='2026-10-02';
  }
 });
}
function saveResults(ev){
 const p=typeof selectedPlanProgram==='function'?selectedPlanProgram():null;
 if(!p){alert('Choose a program for your Career Investment Plan first.');return}
 const f=fundingFor(selectedOccupation,p);
 const gapAbility=document.querySelector('input[name="gapAbility"]:checked')?.value||'';
 if(f?.eligible&&Number(f.gap||0)>0&&!gapAbility){alert('Choose a response for the Potential Remaining Cost Acknowledgment before saving your Career Investment Results.');return}
 const acks=[...document.querySelectorAll('.finalAck')];
 if(acks.some(x=>!x.checked)){alert('Review and acknowledge the four decision statements before saving your Career Investment Results.');return}
 const finalAcknowledgments=acks.map((x,i)=>({index:i,checked:!!x.checked,text:String(x.parentElement?.textContent||'').trim()}));
 const cw=parseFloat($('currentWage')?.value||0)||0,target=Number(selectedOccupation?.hourly||0);
 const payload={module:'module5',selectedSoc:ev.soc,careerTitle:ev.career,route:ev.route,gapMode:$('boostGapMode')?.value||'carry',specificGap:$('boostGapStatement')?.value.trim()||ev.preparation,provider:p.provider,programName:p.name,programId:p.id,trainingPathway:trainingPathway(p),credentials:p.credentials||'',listedCost:p.cost||null,listedCostOriginal:p.costOriginal??null,costSource:p.costSource||null,costCorrectionReason:p.costCorrectionReason||null,costVerifiedAt:p.costVerifiedAt||null,potentialCareerInvestment:f.eligible?f.potential:null,potentialRemainingCost:f.eligible?f.gap:null,remainingCostAcknowledgment:gapAbility||null,finalAcknowledgments,currentHourlyWage:cw||null,targetHourlyReference:target||null,roiRatio:cw>0&&target>0?target/cw:null,roiBenchmarkMet:cw>0&&target>0?(target/cw)>=1.15:null,comparedProgramIds:Array.from(compareIds||[]),evaluatedAt:new Date().toISOString(),completedAt:new Date().toISOString(),source:'live_etpl_training_research'};
 const s=read(KEY)||{};s.module5=payload;s.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(s));
 const j=read(JOURNEY)||{};j.modules=j.modules||{};j.progress=j.progress||{};j.modules.module5=Object.assign({},j.modules.module5||{},payload,{completedAt:new Date().toISOString()});j.progress.module5='complete';if(j.staleModules)delete j.staleModules.module5;j.portal=j.portal||{};j.portal.completed=Array.from(new Set([...(j.portal.completed||[]),'module5']));j.updated_at=new Date().toISOString();localStorage.setItem(JOURNEY,JSON.stringify(j));
 try{const done=new Set(JSON.parse(localStorage.getItem('boostPortalCompleted_v2')||'[]'));done.add('module5');localStorage.setItem('boostPortalCompleted_v2',JSON.stringify([...done]))}catch(_){}
 try{const ms=JSON.parse(localStorage.getItem('boostPathwaysV29')||'{}');ms.complete=ms.complete||{};ms.complete['m:module5']=true;localStorage.setItem('boostPathwaysV29',JSON.stringify(ms))}catch(_){}
 parent.postMessage({type:'boost-module5-saved'},location.origin);
}
function restoreSaved(ev){
 const saved=ev.s?.module5||read(JOURNEY)?.modules?.module5||null;
 if(!saved?.evaluatedAt||!sameCareer(saved,ev))return;
 try{
  if($('boostGapMode')&&saved.gapMode)$('boostGapMode').value=saved.gapMode;
  if($('boostGapStatement')&&saved.specificGap)$('boostGapStatement').value=saved.specificGap;
  if($('currentWage')&&saved.currentHourlyWage!=null){$('currentWage').value=String(saved.currentHourlyWage);$('currentWage').dispatchEvent(new Event('input',{bubbles:true}))}
  const ids=Array.isArray(saved.comparedProgramIds)&&saved.comparedProgramIds.length?saved.comparedProgramIds:(saved.programId?[String(saved.programId)]:[]);
  compareIds.clear();ids.forEach(id=>compareIds.add(String(id)));
  if(typeof renderPrograms==='function')renderPrograms();
  if(typeof updateCompareBar==='function')updateCompareBar();
  if(ids.length&&$('openCompare')){
    if(typeof renderCompare==='function')renderCompare();
    $('comparePanel')?.classList.remove('hidden');
    $('s4')?.classList.add('active');
  }
  if(saved.programId&&$('selectedProgram')){
    const opt=[...$('selectedProgram').options].find(o=>String(o.value)===String(saved.programId));
    if(opt){$('selectedProgram').value=String(saved.programId);if(typeof updateInvestmentPlan==='function')updateInvestmentPlan()}
  }
  if(saved.remainingCostAcknowledgment){
    const gap=[...document.querySelectorAll('input[name="gapAbility"]')].find(x=>x.value===saved.remainingCostAcknowledgment);
    if(gap)gap.checked=true;
  }
  const savedAcks=Array.isArray(saved.finalAcknowledgments)?saved.finalAcknowledgments:[];
  document.querySelectorAll('.finalAck').forEach((x,i)=>{
    const match=savedAcks.find(a=>Number(a?.index)===i);
    x.checked=match?!!match.checked:false;
  });
  if(typeof buildPrintPlan==='function')buildPrintPlan();
 }catch(e){console.warn('BOOST Module 5 saved results could not be restored',e)}
}
function init(){
 normalizeProgramCosts();
 style();
 const ev=evidence();if(!ev.s?.module4)return;
 const careerWasReset=resetIfCareerChanged(ev);
 const steps=document.querySelectorAll('.stepbar .step');
 if(steps[0])steps[0].textContent='1. Evidence Carried Forward';
 if(steps[1])steps[1].textContent='2. Define the Gap';
 if(steps[2])steps[2].textContent='3. Research Training';
 if(steps[3])steps[3].textContent='4. Compare & Evaluate';
 const search=document.querySelector('.searchWrap'),goal=search?.closest('.panel');
 if(goal&&!$('boostCarryForward')){
  const eye=goal.querySelector('.eyebrow'),h=goal.querySelector('h2'),help=goal.querySelector('.help');
  if(eye)eye.textContent='Step 1 • What BOOST already knows';
  if(h)h.textContent='Your career direction and evidence carried forward';
  if(help)help.textContent='You already did this work. Module 5 starts with the career, wage, preparation, and regional evidence you built in Modules 2–4.';
  const carry=document.createElement('div');carry.id='boostCarryForward';carry.className='boostCarry';
  const items=[['Career',ev.career||ev.soc],['Current / recent wage',ev.wage?'$'+ev.wage.toFixed(2)+'/hr':'Not available'],['Preparation evidence',ev.preparation],['Typical entry education',ev.education],['Employer-supported route',ev.employerSupport],['Regional evidence',ev.regional]];
  carry.innerHTML=items.map(x=>'<div class="boostCarryCard"><small>'+esc(x[0])+'</small><b>'+esc(String(x[1]||'Carried forward'))+'</b></div>').join('');
  const occ=$('occCard');goal.insertBefore(carry,occ||null);
  const resetRow=document.createElement('div');resetRow.className='boostM5ResetRow';resetRow.innerHTML='<div><button type="button" id="boostM5Reset" class="boostM5Reset">↻ Clear Module 5 / Start Fresh</button><div class="boostM5ResetNote">Clears only Career Investment Explorer. Your Modules 1–4 evidence stays intact.</div></div>';goal.insertBefore(resetRow,occ||null);
  $('boostM5Reset')?.addEventListener('click',()=>{
    if(!confirm('Clear the current Career Investment Explorer work and start fresh for '+(ev.career||'this career')+'? Modules 1–4 will not be changed.'))return;
    archiveActiveModule5('manual_reset',ev);
    location.reload();
  });
  if(careerWasReset){
    const note=document.createElement('div');note.style.cssText='margin:12px 0;padding:12px 14px;border-radius:11px;background:#fff7dc;border-left:5px solid #d69a18;color:#4d3c13;font-weight:750;line-height:1.45';note.innerHTML='<b>Your career direction changed.</b><br>BOOST cleared the previous Career Investment comparison so the training research below is tied only to <b>'+esc(ev.career||'your current occupation')+'</b>. Your earlier result was archived for history.';goal.insertBefore(note,occ||null);
  }
 }
 const occ=findOccupation(ev);
 if(occ&&typeof selectOccupation==='function'){
  selectOccupation(occ);
  if(search)search.style.display='none';
 }else if(search){
  search.style.display='block';
 }
 const emp=$('employerPanel');
 if(emp&&!$('boostGapBox')){
  const eye=emp.querySelector('.eyebrow'),h=emp.querySelector('h2'),help=emp.querySelector('.help');
  if(eye)eye.textContent='Step 2 • Define the specific gap';
  if(h)h.textContent='What preparation gap are you actually trying to close?';
  if(help)help.textContent='BOOST has already identified that preparation deserves a closer look. Before researching programs, define the gap you want the training research to solve.';
  const rg=emp.querySelector('.realityGrid'),status=$('employerStatus');if(rg)rg.style.display='none';if(status)status.style.display='none';
  const box=document.createElement('div');box.id='boostGapBox';box.className='boostGapBox';box.innerHTML='<b>Carried-forward preparation evidence</b><div style="margin-top:4px">'+esc(ev.preparation)+'</div><div style="margin-top:6px;color:#607788">Typical entry education: <b>'+esc(ev.education)+'</b></div><label for="boostGapMode">How should BOOST treat the gap for training research?</label><select id="boostGapMode"><option value="carry">Use the carried-forward preparation evidence</option><option value="verify">I still need to verify the exact employer requirement</option><option value="specific">I identified a more specific credential, license, skill, or preparation step</option></select><label for="boostGapStatement">Specific gap to research</label><textarea id="boostGapStatement" placeholder="Example: Bachelor\'s degree, state license, CDL Class A, CNC programming skill..."></textarea>';
  const actions=$('continueToTraining')?.closest('.planActions');emp.insertBefore(box,actions||null);
  $('boostGapStatement').value=gapText(ev);
  if($('continueToTraining'))$('continueToTraining').textContent='Research Approved Training Options →';
 }
 const train=$('trainingPanel');if(train){const eye=train.querySelector('.eyebrow'),help=train.querySelector('.resultsHeader .help');if(eye)eye.textContent='Step 3 • Research approved training options';if(help)help.textContent='Review ETPL-listed and approved training options aligned to your target occupation. Compare pathway, credential, time, listed cost, and potential Pinal career investment before choosing a program.'}
 const compare=$('comparePanel');if(compare){
  const eye=compare.querySelector('.eyebrow'),h=compare.querySelector('h2');if(eye)eye.textContent='Step 4 • Compare, evaluate, and plan';if(h)h.textContent='Compare programs and evaluate the investment';
  const wage=$('currentWage');if(wage&&ev.wage&&!wage.value){wage.value=String(ev.wage);wage.dispatchEvent(new Event('input',{bubbles:true}))}
  const wl=document.querySelector('label[for="currentWage"]');if(wl)wl.textContent='Current or recent hourly wage (carried forward when available)';
  const outlook=$('outlook');if(outlook&&!$('boostROIGuardrail')){const roi=document.createElement('div');roi.id='boostROIGuardrail';roi.className='boostROINote';outlook.appendChild(roi);const update=()=>{const cw=parseFloat($('currentWage')?.value||0),tw=Number(selectedOccupation?.hourly||0);if(!cw||!tw){roi.textContent='BOOST will compare the target wage reference with your current/recent wage when both are available.';return}const ratio=tw/cw,pct=(ratio-1)*100;roi.innerHTML='<b>BOOST training-investment benchmark:</b> '+(ratio>=1.15?'At or above':'Below')+' 115% of current/recent wage. Target labor-market reference: <b>$'+tw.toFixed(2)+'/hr</b> vs. current/recent <b>$'+cw.toFixed(2)+'/hr</b> ('+(pct>=0?'+':'')+pct.toFixed(1)+'%). <span style="color:#607788">This is a coaching signal, not an automatic funding decision.</span>'};wage?.addEventListener('input',update);$('selectedProgram')?.addEventListener('change',update);update()}
  const actions=compare.querySelector('.planActions');if(actions&&!$('boostSaveInvestment')){const b=document.createElement('button');b.id='boostSaveInvestment';b.className='teal boostLiveSave';b.textContent='Save Career Investment Results';b.addEventListener('click',()=>saveResults(ev));actions.appendChild(b)}
 }
 restoreSaved(ev);
 window.__BOOST_M5_READY__={career:ev.career,soc:ev.soc,occupationMatched:!!occ};
 setTimeout(()=>window.scrollTo(0,0),100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();
