# frozen_string_literal: true

Rails.application.routes.draw do
  resources :calendars do
    resources :calendar_months, only: [:create, :show]
  end
end
