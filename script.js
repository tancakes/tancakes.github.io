const createBtn = document.getElementById("create-new");
const mainDiv = document.getElementById("main");
let savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || {};

createBtn.addEventListener("click", () => {
  // Clear main  div  
  mainDiv.innerHTML = ``;
  
  const workoutDate = document.createElement('div');
  mainDiv.appendChild(workoutDate);
  const title = document.createElement("h1");

  // Calendar Input
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.id = "calendar-input";
  workoutDate.appendChild(dateInput);

  // Save date
  dateInput.addEventListener("change", () => {
    const selectedDateString = dateInput.value;
    const [year, month, day] = selectedDateString.split("-").map(num => parseInt(num, 10));
    const selectedDate = new Date(year, month - 1, day); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = selectedDate.toLocaleDateString('en-US', options);
    title.textContent = `${formatted}`;
    workoutDate.appendChild(title);
    workoutDate.removeChild(dateInput);
  })
  
  const workoutType = document.createElement('div');
  workoutType.className = "workout-type"
  mainDiv.appendChild(workoutType)
  const workoutTitle = document.createElement("h3")

  // Create workout input
  const workoutInput = document.createElement("input");
  workoutInput.type = "text";
  workoutInput.id = "workout-input";
  workoutInput.placeholder = "Workout Type"
  workoutType.appendChild(workoutInput);
  
  // Create save button
  const typeBtn = document.createElement("button");
  typeBtn.textContent = "Add";
  typeBtn.id = "type-btn";
  workoutType.appendChild(typeBtn); 
  
  typeBtn.addEventListener("click", () => {
    const workout = workoutInput.value.trim();
    if (workout) {
        workoutTitle.textContent = `${workout}`;
        workoutType.appendChild(workoutTitle);
        workoutType.removeChild(workoutInput);
        workoutType.removeChild(typeBtn); 
        }
    }); 
  
const exerciseSection = document.createElement('div');
mainDiv.appendChild(exerciseSection);
  
// Create a wrapper for table + button
const tableWrapper = document.createElement('div');
tableWrapper.style.display = 'flex';
tableWrapper.style.alignItems = 'flex-start'; // Align button to top
tableWrapper.style.gap = '10px';
exerciseSection.appendChild(tableWrapper)

// Create a table element
const table = document.createElement('table');
tableWrapper.appendChild(table);

// Create the table header
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
const header1 = document.createElement('th');
header1.textContent = "Exercise";
const header2 = document.createElement('th');
header2.textContent = "Weight";
const header3 = document.createElement('th');
header3.textContent = "Reps";

headerRow.appendChild(header1);
headerRow.appendChild(header2);
headerRow.appendChild(header3);
thead.appendChild(headerRow);
table.appendChild(thead);

// Create the table body
const tbody = document.createElement('tbody');
table.appendChild(tbody);

// Button to add a new row
const addRowBtn = document.createElement('button');
addRowBtn.textContent = "+";
addRowBtn.id = "add-row-btn";
exerciseSection.appendChild(addRowBtn);

// Button to add columns
const addColumnBtn = document.createElement('button');
addColumnBtn.textContent = "+";
addColumnBtn.id = "add-column-btn";
tableWrapper.appendChild(addColumnBtn);

// Track the number of columns in the table
let currentColumns = 3;  // Initially, we have 3 columns
  
// Add initial row with inputs
const addRow = () => {
  const row = document.createElement('tr');

// Loop through the number of columns to add the correct number of inputs
  for (let i = 0; i < currentColumns; i++) {
    const cell = document.createElement('td');
    let input;

    if (i === 0) {
      input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Exercise Name';
    } else if (i % 2 === 1) {
      // Odd columns (weight)
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'Weight';
    } else {
      // Even columns (reps)
      input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'Reps';
    }

    if (input) {
      cell.appendChild(input);  // Ensure valid input element is appended
      row.appendChild(cell);  // Append cell to row
    }
  }

  if (row) {
    tbody.appendChild(row);  // Ensure row is valid
  }
};
  
// Add columns for weight and reps
const addColumns = () => {
  // Add headers for the new columns
  const newHeader1 = document.createElement('th');
  newHeader1.textContent = 'Weight';
  thead.rows[0].appendChild(newHeader1);

  const newHeader2 = document.createElement('th');
  newHeader2.textContent = 'Reps';
  thead.rows[0].appendChild(newHeader2);

  // Increase the number of columns
  currentColumns += 2;

  // Add the new columns to all rows (including future rows)
  const rows = tbody.rows;
  for (let i = 0; i < rows.length; i++) {
    const newCell1 = document.createElement('td');
    const inputWeight = document.createElement('input');
    inputWeight.type = 'number';
    inputWeight.placeholder = 'Weight';
    newCell1.appendChild(inputWeight);
    rows[i].appendChild(newCell1);

    const newCell2 = document.createElement('td');
    const inputReps = document.createElement('input');
    inputReps.type = 'number';
    inputReps.placeholder = 'Reps';
    newCell2.appendChild(inputReps);
    rows[i].appendChild(newCell2);
  }
};
  
// Event listeners for the buttons
addRowBtn.addEventListener('click', addRow);
addColumnBtn.addEventListener('click', addColumns);

// Add initial row when the page loads
addRow();

const saveBtn = document.createElement("button");
saveBtn.textContent = "Save Workout";
saveBtn.id = "save-btn";
saveBtn.style.marginTop = "20px";
saveBtn.style.padding = "10px 16px";
saveBtn.style.backgroundColor = "#4CAF50";
saveBtn.style.color = "white";
saveBtn.style.border = "none";
saveBtn.style.borderRadius = "6px";
saveBtn.style.cursor = "pointer";
mainDiv.appendChild(saveBtn);

saveBtn.addEventListener("click", () => {
  // Get the title (date)
  const dateTitle = title.textContent || "Unnamed Workout";

  // Disable inputs
  const allInputs = mainDiv.querySelectorAll("input");
  allInputs.forEach(input => {
    input.disabled = true;
    input.style.backgroundColor = "#f4f4f4";
  });


// Collect raw row data
const rawRows = Array.from(tbody.rows).map(row => {
  return Array.from(row.cells).map(cell => {
    const input = cell.querySelector("input");
    return input ? input.value.trim() : cell.textContent.trim();
  });
});

// Filter out empty rows
const filteredRows = rawRows.filter(row => row.some(cell => cell !== ""));

// Remove empty columns (based on filtered rows)
let nonEmptyColIndices = [];
if (filteredRows.length > 0) {
  const colCount = filteredRows[0].length;

  for (let i = 0; i < colCount; i++) {
    const colHasData = filteredRows.some(row => row[i] !== "");
    if (colHasData) nonEmptyColIndices.push(i);
  }
}

// Keep only non-empty columns
const cleanedRows = filteredRows.map(row =>
  nonEmptyColIndices.map(i => row[i])
);

const workoutData = {
  title: dateTitle,
  workoutName: workoutTitle.textContent,
  rows: cleanedRows
};

savedWorkouts[dateTitle] = workoutData;
localStorage.setItem("workouts", JSON.stringify(savedWorkouts));

  // Add clickable item to nav
  createNavItem(dateTitle);

  mainDiv.innerHTML = '';
  loadWorkout(dateTitle);
});
});  

window.addEventListener("DOMContentLoaded", () => {
  Object.keys(savedWorkouts).forEach(dateTitle => {
    createNavItem(dateTitle);
  });
});

function loadWorkout(dateTitle) {
  const workout = savedWorkouts[dateTitle];
  if (!workout) return;

  mainDiv.innerHTML = ""; // Clear screen

  const title = document.createElement("h1");
  title.textContent = workout.title;
  mainDiv.appendChild(title);

  const workoutName = document.createElement("h3");
  workoutName.textContent = workout.workoutName;
  mainDiv.appendChild(workoutName);

  // Table
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  for (let i = 0; i < workout.rows[0].length; i++) {
    const th = document.createElement("th");
    th.textContent = i === 0 ? "Exercise" : (i % 2 === 1 ? "Weight" : "Reps");
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  workout.rows.forEach(rowData => {
    const row = document.createElement("tr");
    rowData.forEach(val => {
      const cell = document.createElement("td");
      cell.textContent = val;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  mainDiv.appendChild(table);
}

function createNavItem(dateTitle) {
  const navItemWrapper = document.createElement("div");
  navItemWrapper.style.display = "flex";
  navItemWrapper.style.justifyContent = "space-between";
  navItemWrapper.style.alignItems = "center";
  navItemWrapper.style.marginTop = "10px";

  const navItem = document.createElement("div");
  navItem.textContent = dateTitle;
  navItem.style.cursor = "pointer";
  navItem.style.textDecoration = "underline";
  navItem.style.flexGrow = "1";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.background = "none";
  deleteBtn.style.border = "none";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontSize = "14px";
  deleteBtn.style.color = "#b00";

  // Click handler for loading the workout
  navItem.addEventListener("click", () => {
    loadWorkout(dateTitle);
  });

  // Delete logic
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the load
    if (confirm(`Delete workout for "${dateTitle}"?`)) {
      delete savedWorkouts[dateTitle];
      localStorage.setItem("workouts", JSON.stringify(savedWorkouts));
      nav.removeChild(navItemWrapper);
      
      // Clear main view if this workout is open
      if (mainDiv.querySelector("h1")?.textContent === dateTitle) {
        mainDiv.innerHTML = "";
      }
    }
  });

  navItemWrapper.appendChild(navItem);
  navItemWrapper.appendChild(deleteBtn);
  nav.appendChild(navItemWrapper);
}