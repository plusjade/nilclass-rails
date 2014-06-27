class Readme

  def initialize(content)
    @content = content
    @total_lines = @content.present? ? @content.lines.count : 0
  end

  def dictionary
    return @dictionary if @dictionary
    @dictionary = {}
    headers_human.each_with_index.each do |header, i|
      slug = OutputRenderer.clean_slug_and_escape(header)
      @dictionary[slug] = {
        title: header,
        name: slug,
        index: i,
        content: chunk(i)
      }
    end

    @dictionary
  end

  def chunk(index)
    parse_chunk(index)
  end

  def headers_human
    @headers_human ||= _headers_human
  end

  def _headers_human
    headers.map do |header|
      header[:content].slice(1, header[:content].length).strip
    end
  end

  def headers
    @headers ||= _headers
  end

  def _headers
    headers = []
    @content.each_line.each_with_index do |line, i|
      next unless line.start_with?("# ")

      headers << {
        index: i,
        content: line,
      }
    end

    headers
  end

  def parse_chunk(index)
    return {} unless headers[index]

    end_index = headers[index+1] ? headers[index+1][:index] : @total_lines


    output = @content
              .lines
              .to_a
              .slice(headers[index][:index], (end_index-headers[index][:index]))
              .join


    OutputRenderer.markdown(output)
  end
end
