import Checklist from './js/Checklist/Checklist';
import './sass/style.scss';


document.addEventListener('DOMContentLoaded', () => {

  const myForm = document.querySelector('.simple-checklist__app')

  if (myForm) {
    new Checklist();
  }
});