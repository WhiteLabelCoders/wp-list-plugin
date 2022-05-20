import { callAjax } from '../../js/helpers';
import ChecklistRemoveTask from './ChecklistRemoveTask';
import ChecklistUpdateTaskTitle from './ChecklistUpdateTaskTitle';
import ChecklistUpdateTaskStatus from './ChecklistUpdateTaskStatus';

class ChecklistQuery {
  tasksContainer: HTMLElement

  constructor() {
    this.tasksContainer = document.querySelector('.simple-checklist__tasks') as HTMLElement
  }

  public async getTasks() {
    if (!this.tasksContainer) return

    const formData = new FormData();
    formData.append('action', 'getTasks');

    this.tasksContainer.innerHTML = '';

    return callAjax({
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        this.tasksContainer.innerHTML = res.html;
      })
      .then(() => {

        new ChecklistRemoveTask();
        new ChecklistUpdateTaskTitle();
        new ChecklistUpdateTaskStatus();

      })
  }
}

export default ChecklistQuery