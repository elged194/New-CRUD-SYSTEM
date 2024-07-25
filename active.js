/*
 - Add LocalStorage of Array [1]
 - Submit Form [2]
 - Add Member [3]
 - Close Form [4]
 - Upload Img [5]
 - Calculat Array of Table --> PreLoadCalculations() [6]
 - Pagination Button  --> displayIndexBtn() [7]
 - pagination Button Style --> paginationBtn() [8]
 - Show Entries & Show pagination Button --> highlightIndexBtn() [9]
 - Next Button pagination --> next() [10]
 - Previous Button pagination  --> prev() [11]
 - Selected table Size [12]
 - Show Data --> showInfo() [13]
 - Delete Item Data --> deleteInfo() [14]
 - Edit Item Data -- editInfo() [15]
 - Reading Item Data -- readInfo() [16]
 - Open and Close Dropdown [17]
 - Filter Age , Salary , Date -- applyFilters() [18]
 - Clear Filter -- clearFilters() [19]
 - Search Input -- searchFilter() [20]

*/

// ----------------------- / Start Valuo / -------------------------------
// ---------- Elements ----------
const addMemberBtn = document.querySelector(".addMemberBtn"),
  popup_bg = document.querySelector(".popup_bg"),
  popup = document.querySelector(".popup"),
  closeBtn = document.querySelector(".closeBtn"),
  submitBtn = document.querySelector(".submitBtn"),
  modalTitle = document.querySelector(".modalTitle"),
  popupFooter = document.querySelector(".popupFooter"),
  imgInput = document.querySelector(".img"),
  form = document.querySelector("form"),
  uploadimg = document.querySelector("#uploadimg"),
  showEntries = document.querySelector(".showEntries"),
  table_size = document.getElementById("table_size"),
  userInfo = document.querySelector(".userInfo"),
  table = document.querySelector("table"),
  imgHolder = document.querySelector(".imgholder");

// ---------- form ----------
const fName = document.getElementById("fName"),
  lName = document.getElementById("lName"),
  age = document.getElementById("age"),
  city = document.getElementById("city"),
  position = document.getElementById("position"),
  salary = document.getElementById("salary"),
  sDate = document.getElementById("sDate"),
  email = document.getElementById("email"),
  phone = document.getElementById("phone"),
  formInputFields = document.querySelectorAll("form input");

// ---------- pagination ----------
let arrayLength = 0;
let tableSize = 5;
let pageStartIndex = 1;
let pageEndIndex = 0;
let indexPage = 1;
let totalPages = 0;
// ----------------------- / End Valuo / -------------------------------

// ---------- / 1 / Add LocalStorage of Array ----------
// خطوة 1: استرجاع البيانات من localStorage
let originalData = localStorage.getItem("userProfile")
  ? JSON.parse(localStorage.getItem("userProfile"))
  : [];

// خطوة 2: إنشاء نسخة مستقلة من البيانات باستخدام spread operator
let getData = [...originalData];

// خطوة 3: تعريف متغيرات لإدارة عملية التعديل
let isEdit = false; // يتم استخدامه لتحديد ما إذا كان المستخدم يقوم بتعديل عنصر موجود
let editId; // يتم استخدامه لتخزين معرف العنصر المعدل

// ---------- / End / Add LocalStorage of Array ----------

// ----------------------- / 1 / Submit Form -----------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const information = {
    id: arrayLength,
    // يقوم بتحديد صورة الشخصية المدخلة، إذا لم يتم تحديدها فإنه يستخدم الصورة الافتراضية
    picture: imgInput.src == undefined ? "./img/pic1.png" : imgInput.src,
    fName: fName.value,
    lName: lName.value,
    ageVal: age.value,
    cityVal: city.value,
    positionVal: position.value,
    salaryVal: salary.value,
    sDateVal: sDate.value,
    emailVal: email.value,
    phoneVal: phone.value,
  };

  // إذا كانت عملية إضافة عنصر جديدة
  if (!isEdit) {
    originalData.push(information); // يضيف المعلومات الجديدة إلى المصفوفة originalData
  } else {
    originalData[editId] = information; // يقوم بتحديث المعلومات في المصفوفة originalData بناءً على editId
  }

  getData = [...originalData]; // يحدث المصفوفة getData بالبيانات الأخيرة من originalData
  localStorage.setItem("userProfile", JSON.stringify(originalData)); // يخزن البيانات في localStorage تحت المفتاح "userProfile"

  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";

  popup_bg.classList.remove("active");
  popup.classList.remove("active");
  form.reset();

  // ---------- pagination Button ----------
  let nextBtn = document.querySelector(".next");
  let prevBtn = document.querySelector(".prev");

  // إذا كان هناك صفحات أخرى بعد الصفحة الحالية
  if (totalPages > indexPage) {
    nextBtn.classList.add("act");

    // إذا كانت الصفحة الحالية هي الأخيرة
  } else {
    nextBtn.classList.remove("act");
  }

  // إذا كانت الصفحة الحالية ليست الأولى
  if (indexPage > 1) {
    prevBtn.classList.add("act");
  }

  highlightIndexBtn(); // يقوم بتحديث الأزرار للتأكيد على الصفحة الحالية
  displayIndexBtn(); // يقوم بإعادة عرض الأزرار للتسلسل الزمني
  showInfo(); // يقوم بإعادة عرض البيانات المحدثة على الجدول
});

// ----------------------- / 3 / Add Member -----------------------
addMemberBtn.addEventListener("click", () => {
  isEdit = false;
  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  popupFooter.style.display = "block";
  imgInput.src = "./img/pic1.png";

  popup_bg.classList.add("active");
  popup.classList.add("active");

  formInputFields.forEach((input) => {
    input.disabled = false;
  });
});

// ----------------------- / 4 / Close Form -----------------------
closeBtn.addEventListener("click", () => {
  popup_bg.classList.remove("active");
  popup.classList.remove("active");

  form.reset();
});

// ----------------------- / 5 / Upload Img -----------------------
uploadimg.onchange = function () {
  // التحقق من أن حجم الملف أقل من 1 ميجابايت
  if (uploadimg.files[0].size < 1000000) {
    // 1MB = 1000000
    let fileReader = new FileReader();

    // عند تحميل الملف بنجاح، يتم تنفيذ هذه الدالة
    fileReader.onload = (e) => {
      let imgUrl = e.target.result; // الحصول على رابط الصورة من نتيجة التحميل
      imgInput.src = imgUrl; // تعيين رابط الصورة كـ src لعنصر imgInput لعرض الصورة
    };

    fileReader.readAsDataURL(uploadimg.files[0]); // قراءة الملف المحدد كـ Data URL
  } else {
    // إذا كان حجم الملف أكبر من 1 ميجابايت، يتم عرض رسالة تنبيه
    alert("This file is too large!");
  }
};

// ----------------------- / 6 / Calculat Array of Table -- PreLoadCalculations() -----------------------
// يستخدم لتحديد عدد الصفحات التي سيتم تقسيم البيانات عليها عند عرضها في جدول
function preLoadCalculations() {
  arrayLength = getData.length;

  // تقوم بتقريب العدد الكسري إلى أقرب عدد صحيح أعلى
  totalPages = Math.ceil(arrayLength / tableSize);

  // if (arrayLength % tableSize > 0) {
  //   totalPages++;
  // }
}

// ----------------------- / 7 / Pagination Button -- displayIndexBtn() -----------------------
function displayIndexBtn() {
  preLoadCalculations();

  const pagination = document.querySelector(".pagination");

  pagination.innerHTML = "";

  pagination.innerHTML =
    '<button onclick="prev()" class="prev">Previous</button>';

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button onclick= "paginationBtn(${i})" index="${i}">${i}</button>`;
  }

  pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';

  highlightIndexBtn();
}
displayIndexBtn();

// ----------------------- / 8 / pagination Button Style -- paginationBtn() -----------------------
function paginationBtn(i) {
  let prevBtn = document.querySelector(".prev");
  let nextBtn = document.querySelector(".next");

  indexPage = i;

  highlightIndexBtn();

  if (indexPage > totalPages - 1) {
    nextBtn.classList.remove("act");
  } else {
    nextBtn.classList.add("act");
  }

  if (indexPage > 1) {
    prevBtn.classList.add("act");
  }

  if (indexPage < 2) {
    prevBtn.classList.remove("act");
  }
}

// ----------------------- / 9 / Show Entries & Show pagination Button -- highlightIndexBtn() -----------------------
function highlightIndexBtn() {
  pageStartIndex = (indexPage - 1) * tableSize + 1;
  pageEndIndex = pageStartIndex + tableSize - 1;

  if (pageEndIndex > arrayLength) {
    pageEndIndex = arrayLength;
  }

  if (totalPages >= 2) {
    let nextBtn = document.querySelector(".next");
    nextBtn.classList.add("act");
  }

  showEntries.textContent = `Showing ${indexPage} to ${pageEndIndex} Of ${arrayLength} Entries`;

  // ---------- pagination Button ----------
  let paginationBtns = document.querySelectorAll(".pagination button");
  paginationBtns.forEach((btn) => {
    btn.classList.remove("active");

    if (btn.getAttribute("index") === indexPage.toString()) {
      btn.classList.add("active");
    }
  });

  showInfo();
}

// ----------------------- / 10 / Next Button pagination -- next() -----------------------
function next() {
  let prevBtn = document.querySelector(".prev");
  let nextBtn = document.querySelector(".next");

  if (indexPage <= totalPages - 1) {
    indexPage++;

    prevBtn.classList.add("act");

    highlightIndexBtn();
  }

  if (indexPage > totalPages - 1) {
    nextBtn.classList.remove("act");
  }
}

// ----------------------- / 11 / Previous Button pagination -- prev() -----------------------
function prev() {
  let prevBtn = document.querySelector(".prev");

  if (indexPage > 1) {
    indexPage--;

    prevBtn.classList.add("act");
    highlightIndexBtn();
  }

  if (indexPage < 2) {
    prevBtn.classList.remove("act");
  }
}

// ----------------------- / 12 / Selected table Size -----------------------
table_size.addEventListener("change", () => {
  let selectedValue = Number(table_size.value);

  tableSize = selectedValue;
  indexPage = 1;
  pageStartIndex = 1;
  displayIndexBtn();
});

// ----------------------- / 13 / Show Data -- showInfo() -----------------------
function showInfo() {
  const employeeDetails = document.querySelectorAll(".employeeDetails");

  employeeDetails.forEach((info) => info.remove());

  let tab_start = pageStartIndex - 1;
  let tab_end = pageEndIndex;

  if (getData.length > 0) {
    for (let i = tab_start; i < tab_end; i++) {
      let item = getData[i];
      let dataItem = ` '${i}', '${item.picture}', '${item.fName}', '${item.lName}', '${item.ageVal}', '${item.cityVal}', '${item.positionVal}', '${item.salaryVal}', '${item.sDateVal}', '${item.emailVal}', '${item.phoneVal}' `;

      if (item) {
        let createElement = `<tr class = "employeeDetails">
              <td>${i + 1}</td>
              <td><img src="${item.picture}" alt="" width="40" height="40"></td>
              <td>${item.fName + " " + item.lName}</td>
              <td>${item.ageVal}</td>
              <td>${item.cityVal}</td>
              <td>${item.positionVal}</td>
              <td>${item.salaryVal}</td>
              <td>${item.sDateVal}</td>
              <td>${item.emailVal}</td>
              <td>${item.phoneVal}</td>
              <td>
                  <button onclick="readInfo(${dataItem})" ><i class='bx bx-show-alt'></i></button>

                  <button onclick="editInfo(${dataItem})" ><i class='bx bx-edit'></i></button>

                  <button onclick = "deleteInfo(${i})"><i class='bx bxs-trash' style='color:#ffffff' ></i></button>
              </td>
          </tr>`;

        userInfo.innerHTML += createElement;
        table.style.minWidth = "90vw";
      }
    }
  } else {
    userInfo.innerHTML = `<tr class="employeeDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`;
    table.style.minWidth = "90vw";
  }
}
showInfo();

// ----------------------- / 14 / Delete Item Data -- deleteInfo() -----------------------
function deleteInfo(index) {
  originalData.splice(index, 1);
  localStorage.setItem("userProfile", JSON.stringify(originalData));

  // Update getData after deleting the record
  getData = [...originalData];

  showInfo();
  highlightIndexBtn();
  displayIndexBtn();
}

// ----------------------- / 15 / Edit Item Data -- editInfo() -----------------------
function editInfo(
  id,
  picture,
  fname,
  lname,
  ageVal,
  cityVal,
  positionVal,
  salaryVal,
  sDateVal,
  emailVal,
  phoneVal
) {
  isEdit = true;
  editId = id;

  (imgInput.src = picture),
    (fName.value = fname),
    (lName.value = lname),
    (age.value = ageVal),
    (city.value = cityVal),
    (position.value = positionVal),
    (salary.value = salaryVal),
    (sDate.value = sDateVal),
    (email.value = emailVal),
    (phone.value = phoneVal),
    popup_bg.classList.add("active");
  popup.classList.add("active");
  popupFooter.style.display = "block";
  modalTitle.innerHTML = "Update the Form";
  submitBtn.innerHTML = "Update";

  imgHolder.style.pointerEvents = "auto";

  formInputFields.forEach((input) => {
    input.disabled = false;
  });
}

// ----------------------- / 16 / Reading Item Data -- readInfo() -----------------------
function readInfo(
  id,
  picture,
  fname,
  lname,
  ageVal,
  cityVal,
  positionVal,
  salaryVal,
  sDateVal,
  emailVal,
  phoneVal
) {
  (imgInput.src = picture),
    (fName.value = fname),
    (lName.value = lname),
    (age.value = ageVal),
    (city.value = cityVal),
    (position.value = positionVal),
    (salary.value = salaryVal),
    (sDate.value = sDateVal),
    (email.value = emailVal),
    (phone.value = phoneVal),
    popup_bg.classList.add("active");
  popup.classList.add("active");
  popupFooter.style.display = "none";
  modalTitle.innerHTML = "Profile";

  formInputFields.forEach((input) => {
    input.disabled = true;
  });

  imgHolder.style.pointerEvents = "none";
}

// ----------------------- / ***** / Filter / *** / -----------------------
const dropBtn = document.querySelector(".filterDropdown .dropbtn");
const dropdown_content = document.querySelector(".dropdown-content");
const dropBtnClose = document.querySelector(".dropdown-content .bx-x");

// ----------------------- / 17 / Open and Close Dropdown  -----------------------
dropBtn.addEventListener("click", () => {
  dropdown_content.classList.add("active");
});

dropBtnClose.addEventListener("click", () => {
  dropdown_content.classList.remove("active");
});

// ----------------------- / 18 / Filter Age , Salary , Date -- applyFilters() -----------------------
document.getElementById("applyFilters").addEventListener("click", applyFilters);

function applyFilters() {
  // الحصول على قيم الفلاتر
  const ageMin = document.getElementById("age_min").value;
  const ageMax = document.getElementById("age_max").value;
  const salaryMin = document.getElementById("salary_min").value;
  const salaryMax = document.getElementById("salary_max").value;
  const dateMin = document.getElementById("date_min").value;
  const dateMax = document.getElementById("date_max").value;

  // تصفية البيانات
  getData = originalData.filter((item) => {
    const ageValid =
      (!ageMin || item.ageVal >= ageMin) && (!ageMax || item.ageVal <= ageMax);

    const salaryValid =
      (!salaryMin || item.salaryVal >= salaryMin) &&
      (!salaryMax || item.salaryVal <= salaryMax);

    const dateValid =
      (!dateMin || item.sDateVal >= dateMin) &&
      (!dateMax || item.sDateVal <= dateMax);

    return ageValid && salaryValid && dateValid;
  });

  dropdown_content.classList.remove("active");

  // تحديث العرض بناءً على الفلاتر
  indexPage = 1;
  highlightIndexBtn();
  displayIndexBtn();
  showInfo();
}

// ----------------------- / 19 / Clear Filter -- clearFilters() -----------------------
document.getElementById("clearFilters").addEventListener("click", clearFilters);

function clearFilters() {
  // مسح القيم المدخلة في الفلاتر
  const inpFilte = document.querySelectorAll(".dropdown-content input");
  inpFilte.forEach((inp) => {
    inp.value = "";
  });

  // إعادة تعيين البيانات الأصلية
  getData = [...originalData];

  // تحديث العرض بناءً على البيانات الأصلية
  indexPage = 1;
  highlightIndexBtn();
  displayIndexBtn();
  showInfo();
}

// ----------------------- / 20 / Search Input -- searchFilter() -----------------------
document.getElementById("search").addEventListener("input", searchFilter);

function searchFilter() {
  let searchValue = document.getElementById("search").value.toLowerCase();

  getData = originalData.filter((item) => {
    return (
      item.fName.toLowerCase().includes(searchValue) ||
      item.lName.toLowerCase().includes(searchValue) ||
      item.cityVal.toLowerCase().includes(searchValue) ||
      item.positionVal.toLowerCase().includes(searchValue)
    );
  });

  // تحديث العرض بناءً على البيانات المصفاة
  indexPage = 1;
  highlightIndexBtn();
  displayIndexBtn();
  showInfo();
}
