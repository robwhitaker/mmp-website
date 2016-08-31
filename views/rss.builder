xml.instruct! :xml, :version => '1.0'
# xml.instruct! 'xml-stylesheet'.to_sym, :stylesheet => @releases.first.first[:stylesheet]
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Midnight Murder Party"
    xml.link "http://midnightmurderparty.com/"
    xml.description "Welcome to the Party!"
    xml.language "en-us"
    xml.managingEditor "author@midnightmurderparty.com"

    def prepare_release release
      prepared_release = {
        title:       prepare_title(release),
        link:        prepare_link(release),
        description: prepare_description(release),
        pub_date:    prepare_pub_date(release)
      }

      prepared_release
    end

    def strip_html string
      doc = Nokogiri::HTML(string)
      doc.xpath("//text()").to_s
    end

    def numeric? string
      true if Float(string) rescue false
    end

    def chapter? sub_release
      sub_release[:level] == 0
    end

    def prepare_title release
      title = ''
      descriptive = ''

      release.each do |sub_release|
        case sub_release[:level]
        when 0
          title += strip_html(sub_release[:title]).gsub(/\..*/, '')
        when 1
          title_halves = strip_html(sub_release[:title]).split('. ')

          title += '-' + title_halves.first
          descriptive = title_halves.second
        when 2
          title += '-' + strip_html(sub_release[:title]).split(' ').first

          if !numeric?(strip_html(sub_release[:title]))
            descriptive = strip_html(sub_release[:title]).sub(/[0-9]+(\.[0-9]+)?/, '').strip
          end
        end
      end

      descriptive.empty? ? title : title + ' - ' + descriptive
    end

    def prepare_link release
      ref = if release.last.has_key? :use_chapter_link
              "/#!/c#{release.first[:id]}"
            else
              chapter?(release.last) ? "/#!/c#{release.last[:id]}" : "/#!/e#{release.last[:id]}"
            end

      request.base_url + ref
    end

    def prepare_description release
      '<style>' + release.first[:stylesheet] + '</style>' + release.last[:content]
    end

    def prepare_pub_date release
      DateTime.parse(release.last[:release_date].to_s).rfc822()
    end

    @releases.each do |release|
      release = prepare_release(release)

      xml.item do
        xml.title release[:title]
        xml.link release[:link]
        xml.description release[:description]
        xml.pubDate release[:pub_date]
      end
    end
  end
end
