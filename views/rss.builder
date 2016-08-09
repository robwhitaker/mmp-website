xml.instruct! :xml, :version => '1.0'
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Midnight Murder Party"
    xml.description "Welcome to the Party!"
    xml.link "http://midnightmurderparty.com/"

    @releases.each do |release|
      # release.each do
      #
      # end
      release = release.first
      xml.item do
        xml.title release.title
        # xml.link "http://liftoff.msfc.nasa.gov/posts/#{post.id}"
        xml.description release.content
        xml.pubDate DateTime.parse(release.release_date.to_s).rfc822()
        # xml.guid "http://liftoff.msfc.nasa.gov/posts/#{post.id}"
      end
    end
  end
end
