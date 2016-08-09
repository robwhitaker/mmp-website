xml.instruct! :xml, :version => '1.0'
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Midnight Murder Party"
    xml.description "Welcome to the Party!"
    xml.link "http://midnightmurderparty.com/"

    @releases.each do |release|
      release = release.first
      xml.item do
        xml.title release.title
        xml.description release.content
        xml.pubDate DateTime.parse(release.release_date.to_s).rfc822()
      end
    end
  end
end
