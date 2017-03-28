class Entry < ActiveRecord::Base
  belongs_to :chapter, foreign_key: 'chapterId'
  after_initialize :init

  def init
    self.title           ||= ''
    self.content         ||= ''
    self.authorsNote     ||= ''
    self.interactiveData ||= ''
    self.interactiveUrl  ||= ''
    self.isInteractive   ||= false
  end

  def has_content?
    !self.content.blank?
  end
end
