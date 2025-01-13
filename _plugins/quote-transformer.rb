module Jekyll
  class QuoteTransformer < Jekyll::Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /^\.md$/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
      # Регулярное выражение для поиска текста в квадратных скобках
      content.gsub(/\[([^\]]+)\]/) do |match|
        # Заменяем квадратные скобки на HTML-цитату
        "<blockquote>#{$1}</blockquote>"
      end
    end
  end
end
