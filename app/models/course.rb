class Course
  class NotFound < StandardError ; end
  attr_reader :name

  def initialize(name)
    raise "Name can't be blank" if name.blank?

    @name = name
    @content_path = Rails.root.join('public','courses', "#{ name }.md")

    raise NotFound, "File does not exist: #{@content_path}" unless File.exist? @content_path
  end

  def payload
    readme.payload
  end

  def readme
    @readme ||= Readme.new( File.open(@content_path).read )
  end

  Dict = {
    "how-websites-work" => {
        "name" => "How Websites Work.",
        "url" => "how-websites-work"
    },

    "practical-rest" => {
        "name" => "Practical REST",
        "url" => "practical-rest"
    }
  }

  def self.all
    Dict.values
  end

  def self.find(name)
    Dict[name]
  end
end
