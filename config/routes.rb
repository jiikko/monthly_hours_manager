# frozen_string_literal: true

Rails.application.routes.draw do
  root 'calendars#index'
  resources :calendars do
    resources :calendar_months, only: %i[create show] do
      post :recalculate, on: :member
    end
  end

  resources :calendar_days, only: %i[update]
end
