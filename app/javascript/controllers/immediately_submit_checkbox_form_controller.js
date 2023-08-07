import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"

// Connects to data-controller="immediately-submit-checkbox-form"
export default class extends Controller {
  submit(event) {
    event.type == 'blur' ? null: this.element.submit()
    return
  }
}
