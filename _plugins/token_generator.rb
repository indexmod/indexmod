module Jekyll
  module TokenGenerator
    def generate_token(input)
      puts "Original input: #{input}"  # Вывод исходной строки для отладки

      # Удаляем все символы, не являющиеся буквами
      sanitized_input = input.gsub(/[^a-zA-Z\s]/, '')  # Удаляем все кроме букв и пробелов
      puts "Sanitized input: #{sanitized_input}"  # Вывод после очистки

      # Разделяем строку на слова
      words = sanitized_input.split
      puts "Words: #{words}"  # Вывод списка слов

      # Создаем токен: первые 3 буквы первого слова и первые буквы остальных слов
      token = words[0][0, 3].upcase  # Первые 3 буквы первого слова
      words[1..-1].each { |word| token += word[0].upcase if word.length > 0 }  # Первые буквы остальных слов

      puts "Generated token: #{token}"  # Вывод сгенерированного токена

      token
    end
  end
end

Liquid::Template.register_filter(Jekyll::TokenGenerator)
