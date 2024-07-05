import Sortable from "sortablejs";

const elmntExampleColumn = document.querySelector(".columnSub");

// Make columns sortable.
new Sortable(elmntExampleColumn, {
  animation: 150,
  handle: '.handle',
  forceFallback: true,
  fallbackTolerance: 3,
  delayOnTouchOnly: true,
  delay: 250,
  onChoose: function (evt) {
    //For touch devices, vibrate when drag item chosen (As at early 2024, doesn't work for IOS Safari devices.)
    navigator.vibrate([30]);
  }
});


const elmntColumnHeader = document.querySelector(".columnContainerHeader"),
  elmntExampleTask1 = document.querySelector("#exampleTask1"),
  elmntExampleTask1Title = elmntExampleTask1.querySelector(".taskHeaderContainer p"),
  elmntExampleTask1Subtask1 = elmntExampleTask1.querySelector(".exampleSubtask1"),
  elmntExampleTask1Subtask2 = elmntExampleTask1.querySelector(".exampleSubtask2"),
  elmntExampleTask1Subtask3 = elmntExampleTask1.querySelector(".exampleSubtask3"),
  elmntExampleTask2 = document.querySelector("#exampleTask2"),
  elmntExampleTask2Title = elmntExampleTask2.querySelector(".taskHeaderContainer p"),
  elmntExampleTask2Subtask1 = elmntExampleTask2.querySelector(".exampleSubtask1"),
  elmntExampleTask2Subtask2 = elmntExampleTask2.querySelector(".exampleSubtask2"),
  elmntExampleTask2Subtask3 = elmntExampleTask2.querySelector(".exampleSubtask3"),
  elmntExampleTask3 = document.querySelector("#exampleTask3"),
  elmntExampleTask3Title = elmntExampleTask3.querySelector(".taskHeaderContainer p"),
  elmntExampleTask3Subtask1 = elmntExampleTask3.querySelector(".exampleSubtask1"),
  elmntExampleTask3Subtask2 = elmntExampleTask3.querySelector(".exampleSubtask2"),
  elmntExampleTask3Subtask3 = elmntExampleTask3.querySelector(".exampleSubtask3");

const elmntAllSlideButtons = document.querySelectorAll(".dot");
let slideIndex = 0;
let timer = null;
showSlides();

for (let i = 0; i < elmntAllSlideButtons.length; i++) {
  elmntAllSlideButtons[i].addEventListener("click", function () {
    clearTimeout(timer);
    slideIndex = i;
    showSlides();
  })
};
function showSlides() {
  slideIndex++;

  if (slideIndex == 1) {
    slide1();

  } else if (slideIndex == 2) {
    slide2();

  } else if (slideIndex == 3) {
    slide3();

  } else if (slideIndex == 4) {
    slide4();

  } else if (slideIndex == 5) {
    slide5();

  } else if (slideIndex > 5) {
    slideIndex = 1;
    slide1();
  }

  for (let i = 0; i < elmntAllSlideButtons.length; i++) {
    elmntAllSlideButtons[i].className = elmntAllSlideButtons[i].className.replace(" active", "");
  }
  elmntAllSlideButtons[slideIndex - 1].className += " active";

  timer = setTimeout(showSlides, 8000); // Change image every 8 seconds
}

function slide1() {
  document.documentElement.setAttribute('data-theme-hue', "orange");
  elmntColumnHeader.innerText = "Tasks";
  elmntExampleTask1Title.innerText = "Read chapter 1";
  elmntExampleTask1.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask1.classList.remove("priorityStatusEnabled");
  elmntExampleTask1.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask1.querySelector("progress").value = 0;
  
  elmntExampleTask2.classList.remove("taskCompleted");
  elmntExampleTask2Title.innerText = "Week 3 online quiz";
  elmntExampleTask2.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-high";
  elmntExampleTask2.classList.add("priorityStatusEnabled");
  elmntExampleTask2.querySelector(".taskDueDate small").innerText = "Mar 1";
  elmntExampleTask2.querySelector("progress").value = 0;

  elmntExampleTask2Subtask1.querySelector("p").innerText = "";
  elmntExampleTask2Subtask2.querySelector("p").innerText = "";
  elmntExampleTask2Subtask3.querySelector("p").innerText = "";

  elmntExampleTask3Title.innerText = "Research essay";
  elmntExampleTask3.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask3.classList.remove("priorityStatusEnabled");
  elmntExampleTask3.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask3.querySelector("progress").value = 30;

  elmntExampleTask3.classList.remove("taskCompleted");
  elmntExampleTask3Subtask1.querySelector("p").innerText = "Introduction";
  elmntExampleTask3Subtask1.classList.add("taskCompleted");
  elmntExampleTask3Subtask2.querySelector("p").innerText = "Body paragraphs";
  elmntExampleTask3Subtask2.classList.remove("taskCompleted");
  elmntExampleTask3Subtask3.querySelector("p").innerText = "Conclusion";
  elmntExampleTask3Subtask3.classList.remove("taskCompleted");

}
function slide2() {
  document.documentElement.setAttribute('data-theme-hue', "green");
  elmntColumnHeader.innerText = "Intro to Linguistics";
  elmntExampleTask1Title.innerText = "Personal reflection task";
  elmntExampleTask1.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask1.classList.remove("priorityStatusEnabled");
  elmntExampleTask1.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask1.querySelector("progress").value = 0;

  elmntExampleTask2.classList.remove("taskCompleted");
  elmntExampleTask2Title.innerText = "Read chapter 3 on morphology";
  elmntExampleTask2.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask2.classList.remove("priorityStatusEnabled");
  elmntExampleTask2.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask2.querySelector("progress").value = 60;

  elmntExampleTask2Subtask1.querySelector("p").innerText = "";
  elmntExampleTask2Subtask2.querySelector("p").innerText = "";
  elmntExampleTask2Subtask3.querySelector("p").innerText = "";

  elmntExampleTask3Title.innerText = "Prepare for this week's practical";
  elmntExampleTask3.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-lower";
  elmntExampleTask3.classList.add("priorityStatusEnabled");
  elmntExampleTask3.querySelector(".taskDueDate small").innerText = "Jul 15";
  elmntExampleTask3.querySelector("progress").value = 0;

  elmntExampleTask3.classList.remove("taskCompleted");
  elmntExampleTask3Subtask1.querySelector("p").innerText = "Chapter 3 exercises";
  elmntExampleTask3Subtask1.classList.remove("taskCompleted");
  elmntExampleTask3Subtask2.querySelector("p").innerText = "";
  elmntExampleTask3Subtask3.querySelector("p").innerText = "";
}
function slide3() {
  document.documentElement.setAttribute('data-theme-hue', "blue");
  elmntColumnHeader.innerText = "Astronomy 101";
  elmntExampleTask1Title.innerText = "Moon observation practical";
  elmntExampleTask1.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask1.classList.remove("priorityStatusEnabled");
  elmntExampleTask1.querySelector(".taskDueDate small").innerText = "Sep 30";
  elmntExampleTask1.querySelector("progress").value = 10;

  elmntExampleTask2.classList.remove("taskCompleted");
  elmntExampleTask2Title.innerText = "Sundial practical";
  elmntExampleTask2.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask2.classList.remove("priorityStatusEnabled");
  elmntExampleTask2.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask2.querySelector("progress").value = 50;

  elmntExampleTask2Subtask1.querySelector("p").innerText = "Adjust for equation of time";
  elmntExampleTask2Subtask1.classList.add("taskCompleted");
  elmntExampleTask2Subtask2.querySelector("p").innerText = "Calculate hour angles";
  elmntExampleTask2Subtask2.classList.remove("taskCompleted");
  elmntExampleTask2Subtask3.querySelector("p").innerText = "";

  elmntExampleTask3.classList.add("taskCompleted");
  elmntExampleTask3Title.innerText = "Rewatch lecture 4 on comets";
  elmntExampleTask3.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask3.classList.remove("priorityStatusEnabled");
  elmntExampleTask3.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask3.querySelector("progress").value = 0;

  elmntExampleTask3Subtask1.querySelector("p").innerText = "";
  elmntExampleTask3Subtask2.querySelector("p").innerText = "";
  elmntExampleTask3Subtask3.querySelector("p").innerText = "";

}
function slide4() {
  document.documentElement.setAttribute('data-theme-hue', "purple");
  elmntColumnHeader.innerText = "Stage 3 Economics";
  elmntExampleTask1Title.innerText = "Price mechanism test revision";
  elmntExampleTask1.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-higher";
  elmntExampleTask1.classList.add("priorityStatusEnabled");
  elmntExampleTask1.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask1.querySelector("progress").value = 0;

  elmntExampleTask2.classList.add("taskCompleted");
  elmntExampleTask2Title.innerText = "Watch video on law of supply and demand";
  elmntExampleTask2.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask2.classList.remove("priorityStatusEnabled");
  elmntExampleTask2.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask2.querySelector("progress").value = 0;

  elmntExampleTask2Subtask1.querySelector("p").innerText = "";
  elmntExampleTask2Subtask2.querySelector("p").innerText = "";
  elmntExampleTask2Subtask3.querySelector("p").innerText = "";

  elmntExampleTask3.classList.remove("taskCompleted");
  elmntExampleTask3Title.innerText = "Price elasticity folio task";
  elmntExampleTask3.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask3.classList.remove("priorityStatusEnabled");
  elmntExampleTask3.querySelector(".taskDueDate small").innerText = "Apr 18";
  elmntExampleTask3.querySelector("progress").value = 10;

  elmntExampleTask3Subtask1.querySelector("p").innerText = "Question 1";
  elmntExampleTask3Subtask1.classList.remove("taskCompleted");
  elmntExampleTask3Subtask2.querySelector("p").innerText = "Question 2";
  elmntExampleTask3Subtask2.classList.remove("taskCompleted");
  elmntExampleTask3Subtask3.querySelector("p").innerText = "";
}
function slide5() {
  document.documentElement.setAttribute('data-theme-hue', "red");
  elmntColumnHeader.innerText = "Japanese 2C";
  elmntExampleTask1Title.innerText = "Test 1 revision";
  elmntExampleTask1.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-high";
  elmntExampleTask1.classList.add("priorityStatusEnabled");
  elmntExampleTask1.querySelector(".taskDueDate small").innerText = "Oct 3";
  elmntExampleTask1.querySelector("progress").value = 80;

  elmntExampleTask2.classList.remove("taskCompleted");
  elmntExampleTask2Title.innerText = "Revise vocabulary on fruits";
  elmntExampleTask2.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-medium";
  elmntExampleTask2.classList.add("priorityStatusEnabled");
  elmntExampleTask2.querySelector(".taskDueDate small").innerText = "";
  elmntExampleTask2.querySelector("progress").value = 0;

  elmntExampleTask2Subtask1.querySelector("p").innerText = "";
  elmntExampleTask2Subtask2.querySelector("p").innerText = "";
  elmntExampleTask2Subtask3.querySelector("p").innerText = "";

  elmntExampleTask3Title.innerText = "Chapter 30";
  elmntExampleTask3.querySelector(".taskHeaderContainer .priorityIcon").className = "priorityIcon priority-null";
  elmntExampleTask3.classList.remove("priorityStatusEnabled");
  elmntExampleTask3.querySelector(".taskDueDate small").innerText = "Oct 10";
  elmntExampleTask3.querySelector("progress").value = 10;

  elmntExampleTask3Subtask1.querySelector("p").innerText = "Grammar";
  elmntExampleTask3Subtask1.classList.add("taskCompleted");
  elmntExampleTask3Subtask2.querySelector("p").innerText = "Vocabulary";
  elmntExampleTask3Subtask2.classList.add("taskCompleted");
  elmntExampleTask3Subtask3.querySelector("p").innerText = "Kanji";
  elmntExampleTask3Subtask3.classList.remove("taskCompleted");
}