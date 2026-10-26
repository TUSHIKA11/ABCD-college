const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const modal=$("#modal"), modalContent=$("#modalContent"), toast=$("#toast");
const data={
about:["About ABC College","ABC College of Technology combines academic excellence, practical learning, innovation, industry exposure and student development. This demo content can be replaced with your college's real history, vision, mission, accreditation and leadership details."],
apply:["Online Admission","Application portal demo. Connect this form to your PHP/MySQL or Node/Express backend to make admissions fully functional.","<input placeholder='Full Name'><input placeholder='Email'><input placeholder='Phone'><button class='btn btn-dark' onclick='showToast(\"Application saved successfully\")'>Submit Application</button>"],
brochure:["College Brochure","Your downloadable PDF can be connected here. Replace this action with the real brochure file."],
login:["Student Login","<input placeholder='Student ID'><input type='password' placeholder='Password'><button class='btn btn-dark' onclick='showToast(\"Login system ready to connect\")'>Login</button>"],
video:["Campus Tour","<div style='aspect-ratio:16/9;background:#0b1736;border-radius:12px;display:grid;place-items:center;color:white'><div>▶ Campus Video<br><small>Add your MP4/YouTube/Pexels video here</small></div></div>"],
bca:["BCA – Bachelor of Computer Applications","3-year undergraduate program focused on programming, databases, web development, AI and modern computing."],
mca:["MCA – Master of Computer Applications","Postgraduate program covering advanced software development, cloud, data and emerging technologies."],
btech:["B.Tech Computer Science","Engineering program with practical projects, software development, AI, cloud and industry exposure."],
mtech:["M.Tech Computer Science","Advanced postgraduate study with research, specialization and emerging technology."],
bba:["BBA – Bachelor of Business Administration","Undergraduate program covering business fundamentals, leadership, marketing and entrepreneurship."],
mba:["MBA – Master of Business Administration","Postgraduate program developing strategic, analytical and leadership skills through practical business learning."],
bcom:["B.Com – Bachelor of Commerce","Undergraduate study in accounting, finance, taxation and commerce."],
datascience:["B.Sc Data Science","Undergraduate program in statistics, data analysis, machine learning and data visualization."],
biotech:["B.Sc Biotechnology","Undergraduate study of biology, biotechnology methods and laboratory practice."],
ai:["B.Tech Artificial Intelligence & Data Science","Engineering program applying artificial intelligence and data engineering to real-world problems."],
mechanical:["B.Tech Mechanical Engineering","Engineering program covering design, manufacturing, materials and mechanical systems."],
civil:["B.Tech Civil Engineering","Engineering program covering structural design, construction, surveying and sustainable infrastructure."],
news1:["Admissions Open","Admissions for 2026–27 are open. Connect your real admission portal or application form here."],
news2:["Annual Technical Fest","Students can participate in coding, robotics, project demonstrations and innovation activities."],
news3:["Industry Internship Drive","The career cell coordinates internship opportunities with industry partners."]
};
function openModal(key){const d=data[key];if(!d)return;modalContent.innerHTML=`<h2>${d[0]}</h2><p>${d[1]}</p>${d[2]||""}`;modal.classList.add("show")}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2800)}
$$("[data-modal]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();openModal(b.dataset.modal)}));
$("#modalClose").onclick=()=>modal.classList.remove("show");
modal.onclick=e=>{if(e.target===modal)modal.classList.remove("show")};
$("#menuToggle").onclick=()=>$("#mainNav").classList.toggle("open");
$$("#programFilters button").forEach(btn=>btn.onclick=()=>{ $$("#programFilters button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;$$(".program-card").forEach(c=>c.classList.toggle("hidden",f!=="all"&&!c.dataset.type.includes(f)))});
$("#contactForm").addEventListener("submit",e=>{e.preventDefault();showToast("Thank you! Your message has been received.");e.target.reset()});
const so=$("#searchOverlay");$("#searchBtn").onclick=()=>so.classList.add("show");$("#searchClose").onclick=()=>so.classList.remove("show");
so.onclick=e=>{if(e.target===so)so.classList.remove("show")};
$$("a[href^='#']").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));

const STUDENT_STORAGE_KEY="abcCollegeStudents";
const studentForm=$("#studentForm"),studentTableBody=$("#studentTableBody");
function readStudentRecords(){
  const stored=localStorage.getItem(STUDENT_STORAGE_KEY);
  if(!stored)return [];
  const records=JSON.parse(stored);
  if(!Array.isArray(records)||records.some(record=>!record||typeof record!=="object"||["id","name","email","phone","program","academicYear","registeredAt"].some(key=>typeof record[key]!=="string"))){
    throw new Error("Student records have an invalid format.");
  }
  return records;
}
function renderStudentRecords(records){
  $("#studentCount").textContent=String(records.length);
  studentTableBody.replaceChildren();
  if(!records.length){
    const row=document.createElement("tr"),cell=document.createElement("td");
    cell.colSpan=5;cell.textContent="No student records yet.";row.append(cell);studentTableBody.append(row);return;
  }
  records.forEach(record=>{
    const row=document.createElement("tr");
    [record.name,record.email,record.program,record.academicYear].forEach(value=>{
      const cell=document.createElement("td");cell.textContent=value;row.append(cell);
    });
    const actionCell=document.createElement("td"),removeButton=document.createElement("button");
    removeButton.type="button";removeButton.className="student-remove";removeButton.textContent="Remove";
    removeButton.addEventListener("click",()=>{
      try{
        const updated=readStudentRecords().filter(student=>student.id!==record.id);
        localStorage.setItem(STUDENT_STORAGE_KEY,JSON.stringify(updated));
        renderStudentRecords(updated);
        showToast("Student record removed.");
      }catch(error){showToast("Could not update student records in browser storage.");}
    });
    actionCell.append(removeButton);row.append(actionCell);studentTableBody.append(row);
  });
}
function csvCell(value){
  const safeValue=/^[=+\-@\t\r]/.test(value)?"'"+value:value;
  return `"${safeValue.replace(/"/g,'""')}"`;
}
try{renderStudentRecords(readStudentRecords());}
catch(error){showToast("Student records could not be loaded. Check browser storage before continuing.");}
studentForm.addEventListener("submit",event=>{
  event.preventDefault();
  const formData=new FormData(studentForm);
  const record={
    id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name:formData.get("name").trim(),
    email:formData.get("email").trim(),
    phone:formData.get("phone").trim(),
    program:formData.get("program"),
    academicYear:formData.get("academicYear").trim(),
    registeredAt:new Date().toISOString()
  };
  try{
    const records=readStudentRecords();
    records.push(record);
    localStorage.setItem(STUDENT_STORAGE_KEY,JSON.stringify(records));
    renderStudentRecords(records);
    studentForm.reset();
    showToast("Student record saved in this browser.");
  }catch(error){showToast("Could not save student record. Browser storage may be unavailable or invalid.");}
});
$("#exportStudents").addEventListener("click",()=>{
  try{
    const records=readStudentRecords();
    const columns=["id","name","email","phone","program","academicYear","registeredAt"];
    const lines=[columns.map(csvCell).join(","),...records.map(record=>columns.map(column=>csvCell(record[column])).join(","))];
    const file=new Blob(["\uFEFF"+lines.join("\r\n")],{type:"text/csv;charset=utf-8"});
    const link=document.createElement("a");
    link.href=URL.createObjectURL(file);link.download="students.csv";link.click();
    setTimeout(()=>URL.revokeObjectURL(link.href),1000);
    showToast("Student CSV exported.");
  }catch(error){showToast("Could not export student records.");}
});
