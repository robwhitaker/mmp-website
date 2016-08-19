xml.instruct! :xml, :version => '1.0'
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Midnight Murder Party"
    xml.description "Welcome to the Party!"
    xml.link "http://midnightmurderparty.com/"

    def prepare_release(release)
      prepared_release = {
        title:      prepare_title(release),
        link:       prepare_link(release.first),
        pub_date:   prepare_pub_date(release.first),
        stylesheet: prepare_stylesheet(release.first),
        content:    release.last.content
      }

      prepared_release
    end

    def strip_html(string)
      doc = Nokogiri::HTML(string)
      doc.xpath("//text()").to_s
    end

    def find_level_1_parent(segment)
      all_entries = Entry.order(order: :desc).where(chapter_id: segment.chapter_id, level: 1)
      all_entries.each do |entry|
        return entry if entry.order < segment.order
      end
    end

    def segment_identifier(segment, with_level_1_entry = false)
      title = strip_html(segment.title)
      identifier = ''

      if segment.level == 1
        identifier = title[0..(title.index('.') - 1)].strip
      elsif segment.level == 2
        if title.length > 2
          level_1_identifier = segment_identifier(find_level_1_parent(segment))
          identifier = "#{level_1_identifier}-#{title[0..(title.index(' '))].strip}"
        elsif with_level_1_entry
          identifier = title
        else
          level_1_identifier = segment_identifier(find_level_1_parent(segment))
          identifier = "#{level_1_identifier}-#{title}"
        end
      end

      identifier
    end

    def release_contains_level_1_entry?(release)
      contains_level_1 = false
      release.each do |segment|
        if is_entry?(segment) && segment.level == 1
          contains_level_1 = true
          break
        end
      end
      contains_level_1
    end

    def title_base(release)
      title_base = strip_html(Chapter.find(release.last.chapter_id).title).gsub(/\..*/, '')

      release.each do |segment|
        cleaned_title = strip_html(segment.title)
        with_level_1_entry = release_contains_level_1_entry?(release)

        if is_entry?(segment)
          title_base += "-#{segment_identifier(segment, with_level_1_entry)}"
        else
          next
        end
      end

      title_base
    end

    def extract_title(title, level)
      if level == 1
        title.sub(/[0-9]+[a-z]+\./, '').strip
      elsif level == 2
        title.sub(/[0-9]+(\.[0-9]+)?/, '').strip
      end
    end

    def prepare_title(release)
      if is_entry?(release.last)
        title_base = title_base(release)
        specific_title = ''

        release.each do |segment|
          cleaned_title = strip_html(segment.title)

          if is_entry?(segment)
            extracted_title = extract_title(cleaned_title, segment.level)

            if extracted_title.length > 0
              specific_title = extracted_title
            else
              specific_title = extract_title(strip_html(find_level_1_parent(segment).title), 1)
            end
          else
            next
          end
        end

        "#{title_base} - #{specific_title}"
      else
        strip_html(release.last.title)
      end
    end

    def prepare_link(release)
      ref = is_entry?(release) ? "/#!/e#{release.id}" : "/#!/c#{release.id}"
      request.base_url + ref
    end

    def prepare_pub_date(release)
      DateTime.parse(release.release_date.to_s).rfc822()
    end

    def prepare_stylesheet(release)
      is_entry?(release) ? Chapter.find(release.chapter_id).stylesheet : release.stylesheet
    end

    def is_entry?(segment)
      segment.has_attribute?(:level)
    end

    @releases.each do |release|
      release = prepare_release(release)

      xml.item do
        xml.title release[:title]
        xml.link release[:link]
        xml.pub_date release[:pub_date]
        xml.content release[:content]
        xml.stylesheet release[:stylesheet]
      end
    end
  end
end
