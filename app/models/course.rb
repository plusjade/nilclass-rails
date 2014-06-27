class Course
  class NotFound < StandardError ; end

  def initialize(name)
    raise "Name can't be blank" if name.blank?

    @content_path = Rails.root.join('public','courses', name, 'content.md')
    @data_path = Rails.root.join('public','courses', name, 'payload.json')

    raise NotFound, "File does not exist: #{@content_path}" unless File.exist? @content_path
    raise NotFound, "File does not exist: #{@data_path}" unless File.exist? @data_path
  end

  def payload
    data["steps"].each do |step|
      if step["content"] && content_dictionary[step["content"]]
        step.merge!(content_dictionary[step["content"]])
      end
    end

    data
  end

  def content_dictionary
    @content_dictionary ||= Readme.new( File.open(@content_path).read ).dictionary
  end

  def data
    @data ||= JSON.parse(File.open(@data_path).read)
  end
end
