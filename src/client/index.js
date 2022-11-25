import {  checkForForm } from './js/app'
import  { handleSubmit } from './js/trip'


import './styles/resets.scss'
import './styles/buttons.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

// An EventListener for submit button
document.getElementById('submit').addEventListener('click', handleSubmit);

// An EventListener for reset button
document.getElementById('reset').addEventListener('click', checkForForm);

export {
    checkForForm,
    handleSubmit
}