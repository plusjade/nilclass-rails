class CoursesController < ApplicationController
  def index
  end

  def show
    @course = Course.new(params[:id])

    respond_to do |format|
      format.html do
        render template: "courses/index"
      end
      format.json do
        render json: { course: @course.payload }
      end
    end
  end
end
