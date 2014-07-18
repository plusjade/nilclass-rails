class Course
  class NotFound < StandardError ; end
  attr_reader :name

  def initialize(name)
    raise "Name can't be blank" if name.blank?

    @name = name
    @content_path = Rails.root.join('public','courses-data', name, "content.md")

    raise NotFound, "File does not exist: #{@content_path}" unless File.exist? @content_path
  end

  def payload
    readme.payload
  end

  def readme
    @readme ||= Readme.new( File.open(@content_path).read )
  end

  def self.all(type = nil)
    FileUtils.cd(Rails.root.join('public','courses-data')) do
      return Dir['*']
              .select { |path|
                File.directory?(path) &&
                  ((type.to_s == "published") ?
                       !path.starts_with?('draft-') :
                       true
                  )
              }
              .map do |name|
                {
                  "url" => name,
                  "name" => name.titleize
                }
              end
    end
  end

  def self.find(url)
    all.find { |a| a["url"] == url }
  end
end
