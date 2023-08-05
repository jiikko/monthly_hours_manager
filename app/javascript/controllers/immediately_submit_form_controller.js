import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"

// Connects to data-controller="immediately-submit-form"
export default class extends Controller {
  static values = { previousValue: String }

  connect() {
    const inputElem = this.element.querySelector('input[type="text"]');
    if (inputElem) {
      this.previousValue = inputElem.value;
    }
  }

  submit() {
    // NOTE: checkboxのときはpreviousValueを持たないので.本当だったらcontrollerを分けるべき
    if(!this.previousValue) {
      this.element.submit()
      return
    }

    const current = this.element.querySelector('input[type="text"]').value
    if (current !== this.previousValue) {
      this.element.submit()
      this.previousValue = current
    }
  }
}
