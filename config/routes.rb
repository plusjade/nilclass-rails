Narly::Application.routes.draw do
  resources :courses, only: [:index, :show] do
    member do
      get ":step", action: :show
    end
  end

  root to: 'courses#index'
end
