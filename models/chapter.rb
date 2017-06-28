class Chapter < ActiveRecord::Base
  has_many :entries, foreign_key: 'chapterId', dependent: :destroy
  default_scope { order(order: :asc) }
  accepts_nested_attributes_for :entries
  after_initialize :init

  def init
    self.stylesheet      ||= ''
    self.title           ||= ''
    self.content         ||= ''
    self.authorsNote     ||= ''
    self.docId           ||= ''
    self.interactiveData ||= ''
    self.interactiveUrl  ||= ''
    self.isInteractive   ||= false
  end

  def has_content?
    !self.content.blank?
  end

  def with_entries(type = 'all')
    chapter_with_entries = self.attributes

    entries = if type == 'released'
                self.entries.select { |entry| entry.releaseDate && entry.releaseDate <= DateTime.now }
              else
                self.entries
              end

    chapter_with_entries[:entries] = entries
    chapter_with_entries
  end
end
