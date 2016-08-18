xml.instruct! :xml, :version => '1.0'
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Midnight Murder Party"
    xml.description "Welcome to the Party!"
    xml.link "http://midnightmurderparty.com/"

    def prepare_release(release)
      prepared_release = {
        title: prepare_title(release),
        link: deep_link(release.first),
        pub_date: pub_date(release.first),
        content: release.last.content,
        stylesheet: prepare_stylesheet(release)
      }

      prepared_release
    end

    def strip_html(string)
      doc = Nokogiri::HTML(string)
      doc.xpath("//text()").to_s
    end

    def prepare_title(release)
      chapter_title_base = strip_html(Chapter.find(release.last.chapter_id).title).gsub(/\..*/, '')
      prepared_release_title = strip_html(release.last.title).gsub(/\./, '').sub(/\s/, ' - ')

      "#{chapter_title_base}-#{prepared_release_title}"
    end

    def prepare_stylesheet(release)
      Chapter.find(release.last.chapter_id).stylesheet
    end

    def deep_link(release)
      ref = if release.has_attribute?(:level)
              ref = "/#!/e#{release.id}"
            else
              ref = "/#!/c#{release.id}"
            end
      request.base_url + ref
    end

    def pub_date(release)
      DateTime.parse(release.release_date.to_s).rfc822()
    end

    @releases.each do |release|
      release = prepare_release(release)

      xml.item do
        xml.title release[:title]
        xml.link release[:link]
        xml.pubDate release[:pub_date]
        xml.content release[:content]
        xml.stylesheet release[:stylesheet]
      end
    end
  end
end
