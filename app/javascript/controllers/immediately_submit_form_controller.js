import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"

// Connects to data-controller="immediately-submit-form"
export default class extends Controller {
  connect() {
    console.log('hoge')
  }

  submit() {
    this.element.submit()
  }
}
