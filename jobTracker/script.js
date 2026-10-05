 
 
 // دالة لجلب وتنسيق التاريخ الحالي
        function updateCurrentDate() {
            const dateElement = document.getElementById('current-date');

            // إنشاء كائن تاريخ جديد يمثل اليوم
            const today = new Date();
            
            // خيارات لتنسيق التاريخ ليظهر بالشكل الإنجليزي المناسب (مثال: Aug 26, 2026)
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            
            // تحويل التاريخ إلى صيغة نصية مقروءة
            const formattedDate = today.toLocaleDateString('en-US', options);
            
            // وضع التاريخ داخل العنصر في الصفحة
            dateElement.textContent = formattedDate;
        }
        updateCurrentDate();




 // Get saved jobs
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];


// Elements
const modal = document.getElementById("jobModal");
const addJobButton = document.getElementById("addJobButton");
const closeModal = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");
const jobForm = document.getElementById("jobForm");
const jobsTable = document.getElementById("jobsTable");
const emptyMessage = document.getElementById("emptyMessage");


// Open modal
addJobButton.addEventListener("click", function () {
    modal.classList.add("show");
});


// Close modal
closeModal.addEventListener("click", closeModalFunction);
cancelButton.addEventListener("click", closeModalFunction);


function closeModalFunction() {
    modal.classList.remove("show");
    jobForm.reset();

}


// Add new job
jobForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const company =
        document.getElementById("company").value;

    const role =
        document.getElementById("role").value;

    const appliedDate =
        document.getElementById("appliedDate").value;

    const followUp =
        document.getElementById("followUp").value;

    const status =
        document.getElementById("status").value;

    const newJob = {

        id: Date.now(),
        company: company,
        role: role,
        appliedDate: appliedDate,
        followUp: followUp,
        status: status

    };

    jobs.push(newJob);
    saveJobs();
    renderJobs();
    updateStatistics();
    closeModalFunction();

});


// Display jobs
function renderJobs() {
    jobsTable.innerHTML = "";

    if (jobs.length === 0) {

        emptyMessage.style.display = "block";
        return;

    }


    emptyMessage.style.display = "none";

    jobs.forEach(function (job) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${job.company}
            </td>

            <td>
                ${job.role}
            </td>

            <td>
                ${formatDate(job.appliedDate)}
            </td>

            <td>

                <select
                    class="status ${job.status}"
                    onchange="changeStatus(${job.id}, this.value)"
                >

                    <option
                        value="Applied"
                        ${job.status === "Applied" ? "selected" : ""}
                    >
                        Applied
                    </option>

                    <option
                        value="Screening"
                        ${job.status === "Screening" ? "selected" : ""}
                    >
                        Screening
                    </option>

                    <option
                        value="Interviewing"
                        ${job.status === "Interviewing" ? "selected" : ""}
                    >
                        Interviewing
                    </option>

                    <option
                        value="Offer"
                        ${job.status === "Offer" ? "selected" : ""}
                    >
                        Offer
                    </option>

                    <option
                        value="Rejected"
                        ${job.status === "Rejected" ? "selected" : ""}
                    >
                        Rejected
                    </option>

                </select>

            </td>

            <td>
                ${job.followUp
                    ? formatDate(job.followUp)
                    : "—"
                }
            </td>

            <td>

                <button
                    class="delete-button"
                    onclick="deleteJob(${job.id})"
                >
                    Delete
                </button>

            </td>

        `;

        jobsTable.appendChild(row);

    });

}



// Change status
function changeStatus(id, newStatus) {

    const job = jobs.find(function (job) {

        return job.id === id;

    });


    if (job) {

        job.status = newStatus;

        saveJobs();
        renderJobs();
        updateStatistics();

    }

}


// Delete job
function deleteJob(id) {

    const confirmed =
        confirm("Are you sure you want to delete this application?");


    if (!confirmed) {

        return;

    }


    jobs = jobs.filter(function (job) {

        return job.id !== id;

    });

    saveJobs();
    renderJobs();
    updateStatistics();

}


// Update statistics
function updateStatistics() {

    const total =
        jobs.length;


    const active =
        jobs.filter(function (job) {

            return (
                job.status === "Applied" ||
                job.status === "Screening" ||
                job.status === "Interviewing"
            );

        }).length;


    const interviews =
        jobs.filter(function (job) {

            return job.status === "Interviewing";

        }).length;


    const responses =
        jobs.filter(function (job) {

            return (
                job.status === "Screening" ||
                job.status === "Interviewing" ||
                job.status === "Offer" ||
                job.status === "Rejected"
            );

        }).length;


    const responseRate =
        total === 0
            ? 0
            : Math.round((responses / total) * 100);


    document.getElementById(
        "applicationsCount"
    ).textContent = total;


    document.getElementById(
        "activeCount"
    ).textContent = active;


    document.getElementById(
        "interviewCount"
    ).textContent = interviews;


    document.getElementById(
        "responseRate"
    ).textContent = responseRate + "%";

}


// Save data
function saveJobs() {

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );

}


// Format date
function formatDate(date) {

    if (!date) {
        return "—";
    }


    const parts =
        date.split("-");


    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


// Load page
renderJobs();

updateStatistics();


