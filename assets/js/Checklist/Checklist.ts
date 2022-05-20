import ChecklistQuery from "./ChecklistQuery";
import ChecklistAddTask from "./ChecklistAddTask";
import ChecklistUpdateTaskTitle from "./ChecklistUpdateTaskTitle";

class Checklist {
  constructor() {

    const CheckboxQueryInstance = new ChecklistQuery();
    CheckboxQueryInstance.getTasks();

    new ChecklistAddTask();
    
  }
}

export default Checklist;