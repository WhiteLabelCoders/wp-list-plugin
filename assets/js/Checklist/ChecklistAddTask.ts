import { callAjax } from '../helpers';
import ChecklistQuery from './ChecklistQuery';

class ChecklistAddTask {
  taskNameElement: HTMLInputElement
  addButton: HTMLButtonElement

  constructor() {
    this.taskNameElement = document.querySelector('.simple-checklist__taskName') as HTMLInputElement;
    this.addButton = document.querySelector('.add-task') as HTMLButtonElement;
    this.init();
  }

  public init() {
    this.addButton.addEventListener('click', (e) => {
      e.preventDefault();
      const taskName = this.taskNameElement.value;
      const ChecklistQueryInstance = new ChecklistQuery();

      this.addTask(taskName, () => ChecklistQueryInstance.getTasks());
    })

    this.taskNameElement.addEventListener('keydown', (e) => {

      const title = this.taskNameElement.value;
      const ChecklistQueryInstance = new ChecklistQuery();

      if (e.keyCode == 13) {
        this.addTask(title, () => ChecklistQueryInstance.getTasks());
      }
    })
  }
  public async addTask(taskName: string, cb: () => Promise<void>) {
    const formData = new FormData()
    formData.append('action', 'addTask');
    formData.append('taskTitle', taskName);


    return callAjax({
      method: 'POST',
      body: formData
    }).then(res => {
      this.taskNameElement.value = '';
    }).then(() => {
      cb();
    })
      .catch((error) => {
        console.error('Error:', error);
      })
  }
}


export default ChecklistAddTask;