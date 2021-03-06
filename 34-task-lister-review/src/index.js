const dataStore = { lists: [] } //GLOBAL DATASTORE
document.addEventListener('DOMContentLoaded', () => {
  // grab DOM elements
  const newListForm = document.getElementById('create-list-form')
  const mainContentDiv = document.getElementById('app-content')

  newListForm.addEventListener('submit', /*function*/ (event) => {
    event.preventDefault() //FORM will try to make a post request; i need to hijack this event
    const newListTitle = document.getElementById('new-list-title').value
    const newListObject = { title: newListTitle, tasks: [] }
    dataStore.lists.push(newListObject) //add new list to the store
    mainContentDiv.innerHTML = renderAllListContent() //massive helper fn that replaces ALL of the HTML in the div
    event.target.reset() //clear out the form
  }) //end submit handler

  mainContentDiv.addEventListener('submit', (event) => {//submit handler for new task form
    event.preventDefault() //stop the form from POSTING
    console.log(event.target) //the target is the form itself; it has 3 children: the dropdown, description, and priority level inputs. Let's grab the values from all of those
    const targetListTitle = event.target.querySelector('#parent-list').value //value from the dropdown
    const newTaskDescription = event.target.querySelector('#new-task-description').value //value from description input field
    const newTaskPriority = event.target.querySelector('#new-task-priority').value //value from priority input field

    const newTaskObject = { list: targetListTitle, description: newTaskDescription, priority: newTaskPriority } //new object for our datastore containing relevent info about new task
    const parentList = dataStore.lists.find((list) => list.title === targetListTitle)
    parentList.tasks.push(newTaskObject) //add this new task to the list it belongs to

    mainContentDiv.innerHTML = renderAllListContent() //massive helper fn that replaces ALL of the HTML in the div
  }) //end new task ev handler

  mainContentDiv.addEventListener('click', (event) => {
    if (event.target.className.includes('delete-list')) {
      const targetListTitle = event.target.dataset.title
      const filteredStore = dataStore.lists.filter((list) => list.title !== targetListTitle)
      dataStore.lists = filteredStore
      mainContentDiv.innerHTML = renderAllListContent()
    } else if (event.target.className.includes('delete-task')) {
      const parentListTitle = event.target.dataset.listTitle
      const parentList = dataStore.lists.find((list) => list.title === parentListTitle)
      const targetTaskTitle = event.target.dataset.taskName
      const filteredListTasks = parentList.tasks.filter((task) => task.description !== targetTaskTitle)
      parentList.tasks = filteredListTasks
      mainContentDiv.innerHTML = renderAllListContent()
    }

  })//end click handler for delete tasks

}) //end DOMContentLoaded

/**************HELPER FNs (could move to their own file)***************************/
const renderNewTaskForm = () => {
  return `
    <form id="create-task-form">
      <label for="parent-list">Select List:</label>
      <select id="parent-list">
        ${dataStore.lists.map(list => `<option value=${list.title}>${list.title}</option>`)}
      </select>
        <label for="new-task-description">Task description:</label>
        <input required type="text" id="new-task-description" placeholder="description">

        <label for="new-task-priority">Priority level:</label>
        <input type="text" id="new-task-priority" placeholder="priority">
        <input type="submit" value="Create New Task">

    </form>
  `
}

const renderTask = (taskData) => {
  return `
    <li>
      Task: ${taskData.description}
      <button data-list-title="${taskData.list}" data-task-name="${taskData.description}" class="delete-task">
        X
      </button>
      <br>
        Priority: ${taskData.priority}
    </li>
  `
}

const renderTasksForList = (listDataObject) => {
  return listDataObject.tasks.map(renderTask)
}

  const renderListDiv = (listDataObject) => {
    // USING DOCUMENT.CREATE ELEMENT
    // const newDiv = document.createElement('div') //create new div
    // const titleH2 = document.createElement('h2') //create new h2
    // const deleteButton = document.createElement('button') //create new button
    // deleteButton.className = 'delete-list'
    // deleteButton.dataset.title = listDataObject.title
    // deleteButton.innerText = 'X'
    // titleH2.innerText = listDataObject.title //set the user list title to the h2 inner text
  // titleH2.appendChild(deleteButton)
  // newDiv.appendChild(titleH2) //append the new h2 to the new div
  // listDiv.appendChild(newDiv) //append the new div to the list div
  return `
      <div>
        <h2>
          ${listDataObject.title}
          <button data-title="${listDataObject.title}" class="delete-list">
            X
          </button>
        </h2>
        <ul>
          ${renderTasksForList(listDataObject)}
        </ul>
      </div>
    `
}

const renderAllListContent = () => {
  // map over all lists in the store, producing all of the HTML for the lists
  // 0 is a falsey value; dataStore.lists.length will be truthy as long as the val is not zero
  return `
  ${ dataStore.lists.length ? renderNewTaskForm() : '' }
    <div id="lists">
      ${ dataStore.lists.map(l => renderListDiv(l)).join('') }
    </div>
  `
}
