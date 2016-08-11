xml.instruct! :xml, :version => '1.0'
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Midnight Murder Party"
    xml.description "Welcome to the Party!"
    xml.link "http://midnightmurderparty.com/"

    def prepare_release(release)
      prepared_release = {
        title: prepare_title(release),
        content: release.last.content,
        link: deep_link(release.first),
        pub_date: pub_date(release.first)
      }

      prepared_release
    end

    def prepare_title(release)
      if release.length > 1
        "Placeholder title - merge needed"
      else
        release.first.title
      end
    end

    def deep_link(release)
      ref = if release.has_attribute?(:level)
              ref = "/e/#{release.id}"
            else
              ref = "/c/#{release.id}"
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
        xml.content release[:content]
        xml.link release[:link]
        xml.pubDate release[:pub_date]
      end
    end
  end
end
