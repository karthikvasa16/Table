// Get references to input fields, button, table body, and search controls
const nameInput = document.getElementById('nameInput');
const roleInput = document.getElementById('roleInput');
const statusInput = document.getElementById('statusInput');
const addButton = document.getElementById('addButton');
const tableBody = document.querySelector('#dataTable tbody');

const searchName = document.getElementById('searchName');
const searchRole = document.getElementById('searchRole');
const searchStatus = document.getElementById('searchStatus');
const searchButton = document.getElementById('searchButton');
const clearSearchButton = document.getElementById('clearSearchButton');

// Counter for row numbers
let counter = 1;
let editingRow = null;

// Function to add or update a row
function addOrUpdateEntry() {
  const name = nameInput.value.trim();
  const role = roleInput.value;
  const status = statusInput.value;

  if (name === '' || role === '' || status === '') {
    alert('Please fill in all fields.');
    return;
  }

  if (editingRow) {
    editingRow.cells[1].textContent = name;
    editingRow.cells[2].textContent = role;
    editingRow.cells[3].textContent = status;
    editingRow = null;
    addButton.textContent = 'Add Entry';
  } else {
    const row = document.createElement('tr');
    const cellNumber = document.createElement('td');
    const cellName = document.createElement('td');
    const cellRole = document.createElement('td');
    const cellStatus = document.createElement('td');
    const cellActions = document.createElement('td');

    cellNumber.textContent = counter++;
    cellName.textContent = name;
    cellRole.textContent = role;
    cellStatus.textContent = status;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.addEventListener('click', () => editEntry(row));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', () => deleteEntry(row));

    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    cellActions.appendChild(actionButtons);

    row.appendChild(cellNumber);
    row.appendChild(cellName);
    row.appendChild(cellRole);
    row.appendChild(cellStatus);
    row.appendChild(cellActions);

    tableBody.appendChild(row);
  }

  clearInputs();
}

// Function to clear input fields
function clearInputs() {
  nameInput.value = '';
  roleInput.value = '';
  statusInput.value = '';
}

// Function to edit a row
function editEntry(row) {
  nameInput.value = row.cells[1].textContent;
  roleInput.value = row.cells[2].textContent;
  statusInput.value = row.cells[3].textContent;
  editingRow = row;
  addButton.textContent = 'Update Entry';
}

// Function to delete a row
function deleteEntry(row) {
  tableBody.removeChild(row);
  updateRowNumbers();
}

// Function to update row numbers
function updateRowNumbers() {
  counter = 1;
  Array.from(tableBody.rows).forEach(row => {
    row.cells[0].textContent = counter++;
  });
}

// Function to filter rows based on search inputs
function filterRows() {
  const nameFilter = searchName.value.toLowerCase().trim();
  const roleFilter = searchRole.value;
  const statusFilter = searchStatus.value;

  Array.from(tableBody.rows).forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    const role = row.cells[2].textContent;
    const status = row.cells[3].textContent;

    const matchesName = !nameFilter || name.includes(nameFilter);
    const matchesRole = !roleFilter || role === roleFilter;
    const matchesStatus = !statusFilter || status === statusFilter;

    row.style.display = matchesName && matchesRole && matchesStatus ? '' : 'none';
  });
}

// Function to clear search filters
function clearSearch() {
  searchName.value = '';
  searchRole.value = '';
  searchStatus.value = '';
  filterRows();
}

// Event listeners
addButton.addEventListener('click', addOrUpdateEntry);
searchButton.addEventListener('click', filterRows);
clearSearchButton.addEventListener('click', clearSearch);

// Allow filtering dynamically when changing dropdowns or typing in searchName
searchName.addEventListener('input', filterRows);
searchRole.addEventListener('change', filterRows);
searchStatus.addEventListener('change', filterRows);

// Existing references and functions...

// Download the table as a PDF
async function downloadTableAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const table = document.getElementById('dataTable');

  // Create an array for table content
  const rows = [];
  rows.push(["#", "Name", "Role", "Status"]); // Add table headers

  // Loop through table rows and add content
  Array.from(table.tBodies[0].rows).forEach(row => {
    const rowData = Array.from(row.cells).slice(0, 4).map(cell => cell.textContent); // Exclude the last column (Actions)
    rows.push(rowData);
  });

  // Add content to PDF
  doc.autoTable({
    head: [rows[0]], // Header row
    body: rows.slice(1), // Table body
    startY: 20,
    styles: { fontSize: 10 },
  });

  // Save the PDF
  doc.save('table_data.pdf');
}

// Attach event listener to the Download button
document.getElementById('downloadPDFButton').addEventListener('click', downloadTableAsPDF);
