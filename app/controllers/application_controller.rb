class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Course::NotFound do |exception|
    render(text: "course not found", status: :not_found)
  end
end
