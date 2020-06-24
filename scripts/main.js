
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 * Copied from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array#answer-6274381
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


const cohortMemberID = (id) => `cohortMember${id}`;

const studentImage = (img, alt, id) => `<img class="card-img-top" src="${img}" alt="${alt}" data-toggle="modal" data-target="#${cohortMemberID(id)}" style="cursor:pointer;">`
const studentProImage = (record) => studentImage(record.proImg, `${record.firstName} ${record.lastName}`, record.id);
const studentFunImage = (record) => studentImage(record.funImg, `${record.firstName} ${record.lastName}`, record.id);

const studentName = (record) => `<h4 class="card-title title-font">${record.firstName} ${record.lastName}</h4>`
const studentReelThemIn = (record) => record.reelThemIn == null ? "" : `<p class="card-text">${record.reelThemIn}</p>`

// if they don't have an href, don't display the icon.
const buildHREFIcon = (href, icon) => href == null ? `<a href=${href} target="_blank" class="disabled" disabled>${icon}</i></a>` : `<a href=${href} target="_blank">${icon}</i></a>`

const buildFabIcon = (label) => `<i class="fab fa-${label} fa-2x contactIcons"></i>`
const buildFasIcon = (label) => `<i class="fas fa-${label} fa-2x contactIcons"></i>`

const buildPortfolio = (href) => buildHREFIcon(href, buildFasIcon("globe"));
const buildGithub = (href) => buildHREFIcon(href, buildFabIcon("github"));
const buildLinkedin = (href) => buildHREFIcon(href, buildFabIcon("linkedin"));

const hireMe = (record) => record.job_searching == false ? "" : `<div class="hire-me">Hire me!</div>`;


function studentContact(record) {
  return `<div class="studentContact">
    ${buildPortfolio(record.portfolio)}
    ${buildGithub(record.github)}
    ${buildLinkedin(record.linkedin)}
  </div>`
}


function studentResume(record) {
  if (record.resume == null) return "";

  let resumeButton = `
    <center>
      <a target="_blank" href="${record.resume}">
        <button type="button" class="btn btn-block btn-outline-primary resumeButton title-font bottom">
          Resume
        </button>
      </a>
    </center>`;

  return resumeButton
}


function studentLearnMore(record) {
  if (record.bio == null) return "";

  let learnMoreButton = `<center><button type="button" class="btn btn-block btn-outline-primary learnMoreButton title-font bottom" data-toggle="modal" data-target="#${cohortMemberID(record.id)}">Learn More!</button></center>`;
  let modal = `
    <div class="modal fade" id="${cohortMemberID(record.id)}" tabindex="-1" role="dialog" aria-labelledby="${cohortMemberID(record.id)}Label" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title title-font" id="${cohortMemberID(record.id)}Label">${record.firstName} ${record.lastName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <center>${studentFunImage(record)}</center><br>
            ${studentContact(record)}
            ${record.bio}
          </div>
        </div>
      </div>
    </div>
  `;

  return learnMoreButton + modal
}


function buildCohortCard(record) {
  return `
  <div class="col-md-3 d-flex flex-column cohortMems">
    ${hireMe(record)}
    ${studentProImage(record)}
    <div class="card-body cohortCard--studentInfo">
      ${studentName(record)}
      ${studentReelThemIn(record)}
    </div>
    <div class="mt-auto cohortCard--learnMore">
      ${studentContact(record)}
      ${studentLearnMore(record)}
    </div>
  </div>`;

}


function buildTech(record) {
  return `
  <div class="col-sm-2 technologies">
     <center>
       <a href="${record.link}" target="_blank"><img class="techs" src="${record.image}" alt="${record.name}" data-toggle="tooltip" data-placement="top" title="${record.name}"></a>
       <br>
     </center>
  </div>`;
}


function createCohortMembersVisuals(data) {
  let isJobSearching = data.filter((item) => item.job_searching == true);
  let isNotJobSearching = data.filter((item) => item.job_searching == false);

  // randomizing students
  shuffle(isJobSearching);
  shuffle(isNotJobSearching);

  isJobSearching.forEach((item) => document.getElementById("cohort").innerHTML += buildCohortCard(item));
  isNotJobSearching.forEach((item) => document.getElementById("cohort").innerHTML += buildCohortCard(item));
}


function createTechVisuals(list) {
  let data = list.techs;
  data.forEach((item) =>  document.getElementById("techs").innerHTML += buildTech(item));
}


function loadData(fp, callback) {
  $.ajax({
    url: fp
  })
    .done(callback)
    .fail(function(error) {
      console.log("error", error);
    });
}


$(function() {
  loadData("data/cohort.json", createCohortMembersVisuals);
  loadData("data/techs.json", createTechVisuals);
});


// initialize the tool-tip plugin for Bootstrap4
$(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $("#year").html(new Date().getFullYear());
  $(document).on("click", function() {
    $(".collapse").collapse("hide");
  });
});
