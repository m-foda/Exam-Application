/* eslint-disable no-var, require-jsdoc, no-unused-vars, max-len, one-var */

// ===========Global Variables and Flags===========//
englishExamGrade = 0;
iqExamGrade = 0;

englishExamRecord = {}; // record to keep english exam answers
iqExamRecord = {}; // record to keep iq exam answers

finishButtonClicked = 0; // flag for finish button
submitAllButtonClicked = 0; // flag for submit all button

var engDtl = {correct: 0, incorrect: 0, time: '', grade: 0, tGrade: 0};
var iqDtl = {correct: 0, incorrect: 0, time: '', grade: 0, tGrade: 0};
var engModelAns = [];
var iqModelAns = [];

// ==========Timer Function==============
function timer(inputTime) {
  /* The following code is the logic of the timer */
  if (minutes) {
    if (seconds) {
      seconds--;
    } else {
      minutes--;
      seconds = 59;
    }
  } else if (seconds) {
    seconds--;
  }
  /* The following code is just formatting for the output */
  if (seconds == 0 && minutes == 0) {
    return '00:00';
  } else if (minutes >= 10 && seconds >= 10) {
    returnArray = [minutes.toString(), ':', seconds.toString()];
    return returnArray.join('');
  } else if (seconds >= 10 && minutes < 10) {
    returnArray = ['0', minutes.toString(), ':', seconds.toString()];
    return returnArray.join('');
  } else if (minutes >= 10 && seconds < 10) {
    returnArray = [minutes.toString(), ':0', seconds.toString()];
    return returnArray.join('');
  } else if (minutes < 10 && seconds < 10) {
    returnArray = ['0', minutes.toString(), ':0', seconds.toString()];
    return returnArray.join('');
  }
};

// ========Project Trial ================
window.addEventListener('load', function() {
  /* examMode is a global variable to store whether it's an exam or a practice*/
  examMode = '';
  /* fetch the hidden items*/
  hiddenDiv = document.getElementById('hiddenDiv');
  /* this is the div containing practice and exam buttons*/
  welcomeDiv = document.getElementById('welcomeDiv');
  /* we start fetching practice and exam buttons*/
  welcomeDiv.addEventListener('click', function(myEvent) {
    if (myEvent.target.type == 'button') {
      examMode = myEvent.target.value;
      welcomeDiv.style.display = 'none';
      /* Show the hidden Div*/
      hiddenDiv.style.display = 'block';
      if (examMode == 'Exam') {
        btnShowAnswer.style.display = 'none';
      }
      /* Arr is the array of random indices for English exam, as returned by the function random*/
      Arr = random(20, englishObj.Questions.length);
      /* currentExamObject is a global variable for the two exams*/
      currentExamObject = {
        time: 10,
        Questions: [],
      };
      /* The following loop will populate currentExamObject with English questions
      using indices in the array Arr*/
      for (var i = 0; i < Arr.length; i++) {
        currentExamObject.Questions[i] = englishObj.Questions[Arr[i]];
      }
      index = 0; // start exam from index zero

      var extDiv = document.getElementById('hiddenDiv');
      var mainModelAns = document.getElementById('mainModelAns');
      var viewModelAns = document.getElementById('modelAns');
      var btnModelAns = document.getElementById('nxtModelAns');
      var topa=document.getElementById("topa");
      topa.style.display='block';
      btnModelAns.addEventListener('click', function() {
          window.location.href="#top";
          modelAns.innerHTML = '';
          btnModelAns.style.display='none';
          modelAns.appendChild(modelAnswer(iqModelAns));
          btnBack.style.display = 'inline-block';
      });
      // ===========Create Elements ================
      qNoHead = document.createElement('h2'); // create element for q no
      qHead = document.createElement('h3'); // create element for q head
      pWrongText = document.createElement('p'); // create element for show answer
      pWrongText.style.display = 'none';
      btnNext.disabled = false; // enable next
      btnPrev.disabled = true; // disable prev
      // =========== Get Elements ===================
      mainDiv = document.getElementById('mainID');
      btnPrev = document.getElementById('btnPrev');
      btnNext = document.getElementById('btnNext');
      btnFinish = document.getElementById('btnFinish');
      btnSubmitAll = document.getElementById('btnSubmitAll');
      markdiv = document.getElementById('markDiv');
      answerdiv = document.getElementById('answerDiv');
      btnSubmitAll.style.display = 'none'; // hide Submit all button
      btnShowAnswer = document.getElementById('btnShowAnswer');
      btnBack = document.getElementById('btnback');
      btnTeam = document.getElementById('btnteam');
      // ============ Timer =========================
      timerDiv = document.getElementById('timerDiv');
      timerDiv.innerText = '10:00'; // display total time before countdown
      minutes = 10; // 1 minute just for testing purposes
      seconds = 0;
      intervalID = window.setInterval('timerDiv.innerText=timer(minutes)', 1000); // start timer
      window.setTimeout('if(finishButtonClicked==0){btnFinish.click()}', 600000); // trigger finish button if not clicked after 1 minute

      // ============================================
      setQuestion(index); /* display first question*/

      /* =========Event handlers for buttons===========*/
      btnNext.addEventListener('click', function() {
        pWrongText.style.display = 'none';
        answerdiv.style.display = 'none';
        if (!currentExamObject.Questions[index].userAnswer)
          btnMark.click();
        /* condition to increment index only if we aren't at the last question*/
        if (index < currentExamObject.Questions.length - 1)
          index++;
        /* condition to disable next button at the last question*/
        if (index == currentExamObject.Questions.length - 1)
          btnNext.disabled = true;
        /* this condition to make sure previous button is re-enabled if disabled*/
        else {
          btnPrev.disabled = false;
        }
        mainDiv.innerHTML = ' ';
        setQuestion(index);
        console.log(index + 1);
      });

      btnPrev.addEventListener('click', function() {
        pWrongText.style.display = 'none';
        answerdiv.style.display = 'none';
        /* condition to decrement index only if greater than zero*/
        if (index > 0)
          index--;
        /* condition to disable previous button at the first question*/
        if (index == 0)
          btnPrev.disabled = true;
        /* the following is a check to always make sure next button is enabled*/
        else {
          btnNext.disabled = false;
        }
        mainDiv.innerHTML = ' ';
        setQuestion(index);
        console.log(index + 1);
      });

      btnFinish.addEventListener('click', function() {
        pWrongText.style.display = 'none';
        answerdiv.style.display = 'none';
        markdiv.innerHTML = '';
        swal('English Exam is finished \n IQ Exam Started ');
        // flag that the button is clicked
        finishButtonClicked = 1;

        if (examMode == 'Exam') {
          currentExamObject.Questions.forEach(function(obj) {
              engDtl.tGrade += obj.grade;
          });

          engDtl.incorrect = currentExamObject.Questions.filter(function(obj, indx) {
              return obj.correctAnswer != obj.userAnswer;
          }).length;

          engDtl.correct = currentExamObject.Questions.filter(function(obj, indx) {
                if(obj.correctAnswer == obj.userAnswer) {
                    engDtl.grade += obj.grade;
                    return true;
                }
                return false;
          }).length;

          engDtl.time = spentTime(currentExamObject.time, minutes, seconds);
        } else if (examMode = 'Practice') {
          currentExamObject.Questions.forEach(function(obj) {
              engModelAns.push(obj);
          });
        }

        btnFinish.style.display = 'none'; // hide finish button
        btnSubmitAll.style.display = 'inline'; // display submit all button

        /* refill Arr with random indices for IQ exam*/
        Arr = random(30, iqObj.Questions.length);
        /* populate currentExamObject with iq Questions*/
        for (var i = 0; i < Arr.length; i++) {
          currentExamObject.Questions[i] = iqObj.Questions[Arr[i]];
        }
        index = 0;

        currentExamObject.time=15;

        minutes = 15;
        seconds = 0;
        window.setTimeout('if(submitAllButtonClicked==0){btnSubmitAll.click()}', 900000); // trigger for submitAllButton
        mainDiv.innerHTML = '';
        setQuestion(index);
        btnNext.disabled = false;
        btnPrev.disabled = true;
      });

      btnSubmitAll.addEventListener('click', function() {
        // Text.style.display="none"
        markdiv.innerHTML = '';
        submitAllButtonClicked = 1; // flag for submitAllButton
        var tbl = document.getElementById('tbl');
        var extDiv = document.getElementById('hiddenDiv');
        var totalGrd = 0;
        /* stop timer after iq exam*/
        window.clearInterval(intervalID);

        if (examMode == 'Exam') {
          currentExamObject.Questions.forEach(function(obj) {
              iqDtl.tGrade += obj.grade;
          });

          iqDtl.incorrect = currentExamObject.Questions.filter(function(obj, indx) {
              return obj.correctAnswer != obj.userAnswer;
          }).length;

          iqDtl.correct = currentExamObject.Questions.filter(function(obj, indx) {
              if(obj.correctAnswer == obj.userAnswer) {
                  iqDtl.grade += obj.grade;
                  return true;
              }
              return false;
          }).length;

          iqDtl.time = spentTime(currentExamObject.time, minutes, seconds);
          finalgrade = document.createElement('img');
          ttl = ((engDtl.grade + iqDtl.grade) * 100)/ (engDtl.tGrade + iqDtl.tGrade);
          if (ttl>60) {
            finalgrade.setAttribute('src', 'passed.png');
            swal('Successed Well Done ');
          } else {
            finalgrade.setAttribute('src', 'failed.png');
            swal('Failed  Keep Trying');
          }
          finalgrade.classList.add('gradeimg');
          tbl.appendChild(setDtlObj(engDtl, 'English exam'));
          tbl.appendChild(setDtlObj(iqDtl, 'IQ exam'));
          var conDiv = document.createElement('div');
          extDiv.style.display = 'none';
          tbl.style.display = 'block';
          btnBack.style.display = 'inline-block';
          btnTeam.style.display = 'inline-block';
          tbl.appendChild(finalgrade);
        } else if (examMode == 'Practice') {
          currentExamObject.Questions.forEach(function(obj) {
              iqModelAns.push(obj);
          });
          extDiv.style.display = 'none';
          mainModelAns.style.display = 'block';
          viewModelAns.appendChild(modelAnswer(engModelAns));
        }
      });

      var markQuestionitem;

      btnMark.addEventListener('click', function() {
        markQuestionitem = document.createElement('input');
        if (!currentExamObject.Questions[index].marked) {
          currentExamObject.Questions[index].marked = 1;

          markQuestionitem.setAttribute('type', 'button');
          markQuestionitem.setAttribute('value', 'Question' + (index + 1));
          markQuestionitem.setAttribute('id', index);
          markQuestionitem.classList.add('btnmarked');
          markdiv.appendChild(markQuestionitem);
        }
      });

      btnBack.addEventListener('click', function() {
        tbl.style.display = 'none';
        btnBack.style.display = 'none';
        btnTeam.style.display = 'none';
        welcomeDiv.style.display = 'block';
      });

      team = document.getElementById('team');

      btnTeam.addEventListener('click', function() {
        btnTeam.style.display = 'none';
        tbl.innerHTML = '';
        mainModelAns.style.display = 'none';
        team.style.display = 'block';
        tbl.appendChild(team);
      });

      markdiv.addEventListener('click', function(event) {
        clickedbtn = event.target;
        mainDiv.innerHTML = '';
        Qnum = Number(clickedbtn.getAttribute('id'));
        currentExamObject.Questions[Qnum].marked = 0;
        index = Qnum;
        setQuestion(index);
        markdiv.removeChild(clickedbtn);
      });

      btnShowAnswer.addEventListener('click', function() {
        // =========Trial=====
        /* pWrongText.innerText="";
        pWrongText.style.display="block";*/
        if (currentExamObject.Questions[index].userAnswer != currentExamObject.Questions[index].correctAnswer) {
          // alert("wrong");
          answerdiv.style.display = 'block';
          pWrongText.style.display = 'block';
          answerdiv.appendChild(pWrongText);
          // pWrongText.style.color = "green";
          pWrongText.innerText = currentExamObject.Questions[index].answers[currentExamObject.Questions[index].correctAnswer];
        } else {
          // pWrongText.style.color = "green";
          pWrongText.innerText = 'Correct Answer';
          answerdiv.style.display = 'block';
          pWrongText.style.display = 'block';
          answerdiv.appendChild(pWrongText);
        }
      });
      /* =============Display Question=============*/
      function setQuestion(index) {
        qNoHead.innerText = 'Question ' + (index + 1);
        qNoHead.classList.add('qnumber');
        var currentQues = currentExamObject.Questions[index];
        qHead.innerText = currentQues.head;
        qHead.classList.add('Qclass');
        mainDiv.appendChild(qNoHead);
        mainDiv.appendChild(qHead);
        var radiotable = document.createElement('table');

        for (var i = 0; i < currentQues.answers.length; i++) {
          rad = document.createElement('input');
          rad.setAttribute('type', 'radio');
          radrow = document.createElement('tr');
          raddata1 = document.createElement('td');
          rad.setAttribute('name', 'q' + index);
          rad.setAttribute('value', i);
          rad.classList.add('rad');
          rad.addEventListener('click', function() {
            qIndex = parseInt(this.name.substring(1));
            currentExamObject.Questions[qIndex].userAnswer = this.value;
          });
          // ===== save radio button State====
          if (currentExamObject.Questions[index].userAnswer != '') {
            if (i == currentExamObject.Questions[index].userAnswer) {
              rad.checked = true;
            }
          }
          mainDiv.appendChild(rad);

          label = document.createElement('label');
          label.innerText = currentQues.answers[i];
          raddata2 = document.createElement('td');
          raddata2.appendChild(label);
          raddata1.appendChild(rad);
          radrow.appendChild(raddata1);
          radrow.appendChild(raddata2);
          label.classList.add('labels');
          radiotable.appendChild(radrow);
          mainDiv.appendChild(radiotable);
        }
      }
    }
  });
});

/* ========= Random array function ============*/
function random(numberOfRandoms, lengthOfArray) {
  /* Declare Local Variable to populate with random elements*/
  var randomArray = [];
  /* Start populating the array*/
  for (var i = 0; i < numberOfRandoms; i++) {
    /* myRandomNumber stores the random element temporarily to check for duplicates*/
    myRandomNumber = Math.floor(Math.random() * lengthOfArray);
    /* Duplicates check*/
    if (randomArray.indexOf(myRandomNumber) === -1) {
      randomArray[i] = myRandomNumber;
    } else {
      i--;
    }
  }
  return randomArray;
};

/* ========= Create final table function ============*/
// function crtTr(obj, str) {
//   var tmpDiv = document.createElement('table');
//   var trObj, tdObj;
//
//   trObj = document.createElement('tr');
//   tdObj = document.createElement('th');
//   tdObj.textContent = ' ' + str + ' ';
//   tdObj.setAttribute('colspan', '2');
//   trObj.appendChild(tdObj);
//   tmpDiv.appendChild(trObj);
//
//   trObj = document.createElement('tr');
//   tdObj = document.createElement('td');
//
//   tdObj.textContent = ' Correct answer ';
//   trObj.appendChild(tdObj);
//   tdObj = document.createElement('td');
//   tdObj.textContent = obj.CorAns.length;
//   trObj.appendChild(tdObj);
//   tmpDiv.appendChild(trObj);
//
//   trObj = document.createElement('tr');
//   tdObj = document.createElement('td');
//   tdObj.textContent = ' Incorrect answer ';
//   trObj.appendChild(tdObj);
//   tdObj = document.createElement('td');
//   tdObj.textContent = obj.iCorAns.length;
//   trObj.appendChild(tdObj);
//   tmpDiv.appendChild(trObj);
//
//   trObj = document.createElement('tr');
//   tdObj = document.createElement('td');
//   tdObj.textContent = ' Time ';
//   trObj.appendChild(tdObj);
//   tdObj = document.createElement('td');
//   tdObj.textContent = obj.time;
//   trObj.appendChild(tdObj);
//   tmpDiv.appendChild(trObj);
//
//   trObj = document.createElement('tr');
//   tdObj = document.createElement('td');
//   tdObj.textContent = ' Grade ';
//   trObj.appendChild(tdObj);
//   tdObj = document.createElement('td');
//   tdObj.textContent = (obj.grade/obj.totalGrade)*100 + ' %';
//   trObj.appendChild(tdObj);
//   tmpDiv.appendChild(trObj);
//   tmpDiv.classList.add('gradetr');
//   return tmpDiv;
// }


function setRowWithHeader(str) {
    var tblRw = document.createElement('tr');
    var tblDt = document.createElement('th');

    tblDt.textContent = str;
    tblDt.setAttribute('colspan', '2');
    return tblRw.appendChild(tblDt);
}
function setRow(key, val) {
    var tblRw = document.createElement('tr');
    var tblDt = document.createElement('th');

    tblDt.textContent = key;
    tblRw.appendChild(tblDt);
    tblDt = document.createElement('td');
    tblDt.textContent = val;
    tblRw.appendChild(tblDt);

    return tblRw;
}
function setDtlObj(dtlObj, str) {
    var divContainer = document.createElement('div');
    divContainer.classList.add("gradetr");

    divContainer.appendChild(setRowWithHeader(str));
    for (var key in dtlObj) {
        if (key === 'grade') {
            divContainer.appendChild(setRow(key, Math.round((dtlObj.grade * 100) / dtlObj.tGrade) + ' %'));
        } else if (key === 'tGrade') {} else {
            divContainer.appendChild(setRow(key, dtlObj[key]));
        }
    }
    return divContainer;
}
/* =========Remaining Time Function========== */
/**
 *@param {int} totalTime - total exam time.
 *@param {int} myMinutes - minutes remaining in the timer.
 *@param {int} mySeconds - seconds remaining in the timer.
 *@return {string} concatenated string from remaining minutes and seconds.
 */
function spentTime(totalTime, myMinutes, mySeconds) {
    var spentTime = totalTime * 60 - (myMinutes * 60 + mySeconds);
    var spentMinutes = Math.floor(spentTime / 60);
    var spentSeconds = spentTime - spentMinutes * 60;
    if (spentSeconds < 10) {
      spentSeconds = '0' + spentSeconds;
    }
    if (spentMinutes < 10) {
      spentMinutes = '0' + spentMinutes;
    }
    return [spentMinutes, ':', spentSeconds].join('');
}

function modelAnswer(Qobj) {
    var subDiv = document.createElement('div');
    Qobj.forEach(function(Qes, indx) {
      var subsubDiv= document.createElement('div');
      subsubDiv.classList.add("modelanswerclass");
      // Qnum contains Qusetion number
      var Qnum = document.createElement('h2');
      Qnum.textContent = 'Question ' + (indx + 1);
      subsubDiv.appendChild(Qnum);

      //Qhead contains Question head
      var Qhead = document.createElement('h3');
      Qhead.textContent = Qes.head;
      subsubDiv.appendChild(Qhead);

      // Qans contains user answer
      var Qans=document.createElement("p");
      var userAns = '';
      if (!Qes.userAnswer) {
        userAns = 'You Skip This Qusetion';
      } else {
        userAns= Qes.answers[Qes.userAnswer];
      }
      Qans.textContent= 'Your answer: ' + userAns;
      subsubDiv.appendChild(Qans);
      var Qcorrectans = document.createElement("p");
      Qcorrectans.textContent = 'Correct Answer : ' + Qes.answers[Qes.correctAnswer];
      subsubDiv.appendChild(Qcorrectans);

      subDiv.appendChild(subsubDiv);
        // if(Qes.userAnswer === Qes.correctAnswer || Qes.userAnswer === undefined) {
        //     var Qans = document.createElement('h4');
        //     Qans.textContent = 'Corret Answer : ' + Qes.answers[Qes.correctAnswer].substr(3);
        //     subDiv.appendChild(Qans);
        // } else {
        //     var Qans = document.createElement('h4');
        //     Qans.textContent = 'Incorret Answer : ' + Qes.answers[Qes.userAnswer].substr(3);
        //     subDiv.appendChild(Qans);
        //     Qans = document.createElement('h4');
        //     Qans.textContent = 'Corret Answer : ' + Qes.answers[Qes.correctAnswer].substr(3);
        //     subDiv.appendChild(Qans);
        // }
    });
    return subDiv;
}
