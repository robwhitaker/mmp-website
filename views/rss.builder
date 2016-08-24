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
        content:    release.last.content,
      }

      prepared_release
    end

    def strip_html(string)
      doc = Nokogiri::HTML(string)
      doc.xpath("//text()").to_s
    end

    def prepare_title(release)
      if is_entry?(release.last)
        chapter_title_base = strip_html(Chapter.find(release.last.chapter_id).title).gsub(/\..*/, '')
        prepared_release_title = strip_html(release.last.title).gsub(/\./, '').sub(/\s/, ' - ')

        "#{chapter_title_base}-#{prepared_release_title}"
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

    def is_entry?(sub_release)
      sub_release.has_attribute?(:level)
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
